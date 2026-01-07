const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const crypto = require('crypto');
const mongoose = require('mongoose');

// GET /api/dsa/questions
router.get('/questions', async (req, res) => {
    try {
        const { difficulty, topic, qid } = req.query;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const DSAProblem = mongoose.model('DSAProblem');

        if (qid) {
            let question;
            if (mongoose.Types.ObjectId.isValid(qid)) {
                question = await DSAProblem.findById(qid);
            }

            if (!question) {
                // Try finding by titleSlug if not found by ID or if ID was invalid
                question = await DSAProblem.findOne({ titleSlug: qid });
            }

            return question ? res.json({ ...question.toObject(), QID: question._id }) : res.status(404).json({ message: "Question not found" });
        }

        let filter = {};
        if (difficulty) filter.difficulty = difficulty;
        if (topic) filter.topics = new RegExp(topic, 'i');

        // General search support
        const search = req.query.search;
        if (search) {
            filter.$or = [
                { title: new RegExp(search, 'i') },
                { topics: new RegExp(search, 'i') }
            ];
            // If search looks like ObjectId, allow ID search too
            if (mongoose.Types.ObjectId.isValid(search)) {
                filter.$or.push({ _id: search });
            }
        }

        const total = await DSAProblem.countDocuments(filter);
        const questions = await DSAProblem.find(filter)
            .skip((page - 1) * limit)
            .limit(parseInt(limit));

        res.json({
            total,
            page: parseInt(page),
            limit: parseInt(limit),
            questions: questions.map(q => ({
                QID: q._id,
                title: q.title,
                difficulty: q.difficulty,
                topics: q.topics,
                titleSlug: q.titleSlug || q.title.toLowerCase().replace(/ /g, '-')
            }))
        });
    } catch (error) {
        console.error("Error fetching DSA questions:", error);
        res.status(500).json({ message: 'Error fetching questions', error });
    }
});

// POST /api/dsa/run
// Body: { language, code, input }
router.post('/run', (req, res) => {
    const { language, code, input } = req.body;

    // Quick validation
    if (!code) return res.status(400).json({ output: "No code provided." });

    const jobId = crypto.randomBytes(4).toString('hex');
    const tempDir = path.join(__dirname, '../../temp');
    if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir);

    let filename, command;
    const timeout = 15000; // 15 seconds execution timeout (includes compilation)

    try {
        if (language === 'python') {
            filename = path.join(tempDir, `${jobId}.py`);
            fs.writeFileSync(filename, code);
            // Python execution
            command = `python "${filename}"`;
        } else if (language === 'cpp') {
            filename = path.join(tempDir, `${jobId}.cpp`);
            const exeName = path.join(tempDir, `${jobId}.exe`);
            fs.writeFileSync(filename, code);
            // Compile then run
            command = `g++ "${filename}" -o "${exeName}" && "${exeName}"`;
        } else if (language === 'c') {
            filename = path.join(tempDir, `${jobId}.c`);
            const exeName = path.join(tempDir, `${jobId}.exe`);
            fs.writeFileSync(filename, code);
            command = `gcc "${filename}" -o "${exeName}" && "${exeName}"`;
        } else if (language === 'java') {
            // Java is tricky because class name must match file name. 
            // For simplicity, we assume Main class within the execution context
            const jobDir = path.join(tempDir, jobId);
            fs.mkdirSync(jobDir);
            filename = path.join(jobDir, 'Main.java');
            fs.writeFileSync(filename, code);
            command = `javac "${filename}" && java -cp "${jobDir}" Main`;
        } else {
            return res.status(400).json({ output: "Unsupported language." });
        }

        // Execution Logic
        const child = exec(command, { timeout: timeout, maxBuffer: 1024 * 1024 }, (error, stdout, stderr) => {
            // Cleanup logic
            try {
                if (language === 'python' && fs.existsSync(filename)) fs.unlinkSync(filename);
                if (language === 'c' || language === 'cpp') {
                    if (fs.existsSync(filename)) fs.unlinkSync(filename);
                    if (fs.existsSync(filename.replace(path.extname(filename), '.exe'))) fs.unlinkSync(filename.replace(path.extname(filename), '.exe'));
                }
                if (language === 'java') {
                    fs.rmSync(path.join(tempDir, jobId), { recursive: true, force: true });
                }
            } catch (cleanupErr) {
                console.error("Cleanup error:", cleanupErr);
            }

            if (error) {
                if (error.killed) return res.json({ output: "Time Limit Exceeded", error: true });
                return res.json({ output: stderr || error.message, error: true });
            }
            res.json({ output: stdout, error: false });
        });

        // Provide Input via Stdin
        if (input) {
            child.stdin.write(input);
            child.stdin.end();
        }

    } catch (e) {
        res.status(500).json({ output: "Internal Server Error during execution.", error: true });
    }
});

// POST /api/dsa/submit
// Saves an attempt (success or fail) to the student profile
router.post('/submit', async (req, res) => {
    const { username, qid, title, difficulty, status } = req.body;
    try {
        const Student = mongoose.model('Student');
        await Student.findOneAndUpdate(
            { username },
            {
                $push: {
                    dsaAttempts: {
                        qid, title, difficulty, status, timestamp: new Date()
                    }
                }
            }
        );
        res.json({ message: "Attempt recorded" });
    } catch (err) {
        console.error("Error saving attempt", err);
        res.status(500).json({ message: "Failed to save attempt" });
    }
});

// GET /api/dsa/stats/:username
// Returns user's DSA history
router.get('/stats/:username', async (req, res) => {
    try {
        const Student = mongoose.model('Student');
        const student = await Student.findOne({ username: req.params.username }, 'dsaAttempts');
        if (!student) return res.status(404).json({ message: "Student not found" });

        res.json(student.dsaAttempts || []);
    } catch (err) {
        console.error("Error fetching stats", err);
        res.status(500).json({ message: "Server error" });
    }
});

// GET /api/dsa/analytics/:username
// Returns aggregated analytics for the dashboard
router.get('/analytics/:username', async (req, res) => {
    try {
        const Student = mongoose.model('Student');
        const student = await Student.findOne({ username: req.params.username }, 'dsaAttempts');
        if (!student) return res.status(404).json({ message: "Student not found" });

        const attempts = student.dsaAttempts || [];
        const totalAttempts = attempts.length;
        const solvedAttempts = attempts.filter(a => a.status === 'Solved');
        const totalSolved = new Set(solvedAttempts.map(a => a.qid)).size; // Unique solved problems

        // Difficulty Split (Unique solved)
        const solvedUnique = Array.from(new Set(solvedAttempts.map(a => JSON.stringify({ qid: a.qid, diff: a.difficulty }))))
            .map(s => JSON.parse(s));

        const difficultySplit = {
            Easy: solvedUnique.filter(a => a.diff === 'Easy').length,
            Medium: solvedUnique.filter(a => a.diff === 'Medium').length,
            Hard: solvedUnique.filter(a => a.diff === 'Hard').length
        };

        const accuracy = totalAttempts > 0 ? ((solvedAttempts.length / totalAttempts) * 100).toFixed(1) : 0;

        // Recent Activity (Last 7 days)
        // Group by Date (YYYY-MM-DD)
        const last7Days = [...Array(7)].map((_, i) => {
            const d = new Date();
            d.setDate(d.getDate() - i);
            return d.toISOString().split('T')[0];
        }).reverse();

        const activityMap = attempts.reduce((acc, curr) => {
            if (!curr.timestamp) return acc;
            const date = new Date(curr.timestamp).toISOString().split('T')[0];
            acc[date] = (acc[date] || 0) + 1;
            return acc;
        }, {});

        const recentActivity = last7Days.map(date => ({
            date,
            count: activityMap[date] || 0
        }));

        res.json({
            totalSolved,
            totalAttempts,
            accuracy,
            difficultySplit,
            recentActivity
        });

    } catch (err) {
        console.error("Error fetching analytics", err);
        res.status(500).json({ message: "Server error" });
    }
});

// POST /api/dsa/add
router.post('/add', async (req, res) => {
    try {
        const { title, difficulty, topics, Body } = req.body;
        const DSAProblem = mongoose.model('DSAProblem');

        // Duplicate Check
        const exists = await DSAProblem.findOne({ title });
        if (exists) {
            return res.status(400).json({ message: 'Problem with this title already exists' });
        }

        const titleSlug = title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');

        const newProblem = new DSAProblem({
            title,
            titleSlug,
            difficulty,
            topics,
            Body
        });

        await newProblem.save();

        res.status(201).json({ message: 'DSA Problem added successfully', problem: newProblem });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error adding DSA problem', error });
    }
});

// DELETE /api/dsa/:id
router.delete('/:id', async (req, res) => {
    try {
        const DSAProblem = mongoose.model('DSAProblem');
        await DSAProblem.findByIdAndDelete(req.params.id);
        res.json({ message: 'Problem deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting problem', error });
    }
});

module.exports = router;
