const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const Groq = require('groq-sdk');
const cloudinary = require('cloudinary').v2;

// Cloudinary Config for snapshots
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// GET /api/quiz/stats/:username
router.get('/stats/:username', async (req, res) => {
    try {
        const Student = mongoose.model('Student');
        const { username } = req.params;

        const student = await Student.findOne({ username });
        if (!student) return res.status(404).json({ message: 'Student not found' });

        const attempts = student.quizAttempts || [];
        const totalTests = attempts.length;
        // Calculate Top Score %
        const topScore = attempts.length > 0
            ? Math.max(...attempts.map(a => (a.score / a.total) * 100))
            : 0;

        // Calculate Average Score %
        const totalScoreSum = attempts.reduce((acc, curr) => acc + (curr.score / curr.total) * 100, 0);
        const averageScore = attempts.length > 0 ? Math.round(totalScoreSum / attempts.length) : 0;

        res.json({
            totalTests,
            topScore: Math.round(topScore),
            averageScore: averageScore
        });
    } catch (error) {
        console.error("Error fetching stats:", error);
        res.status(500).json({ message: 'Error fetching stats' });
    }
});

// POST /api/quiz/analyze-ai
router.post('/analyze-ai', async (req, res) => {
    try {
        const { results, score, total } = req.body;

        if (!process.env.GROQ_API_KEY) {
            console.error("GROQ_API_KEY is missing in .env");
            return res.status(500).json({
                analysis: "## AI Configuration Error\n\nThe server is missing the `GROQ_API_KEY`. Please ask the administrator to configure the `.env` file with a valid Groq API key to enable AI insights."
            });
        }

        const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

        const summaryResults = results.slice(0, 20).map((r, i) =>
            `Q${i + 1}: ${r.question} (Status: ${r.isCorrect ? 'Correct' : 'Incorrect'}, Topic: ${r.category || 'General'})`
        ).join('\n');

        const prompt = `
        Analyze this quiz performance:
        Score: ${score}/${total}
        
        Recent Questions Snapshot:
        ${summaryResults}
        
        You are a career mentor. Return a strictly valid JSON object.
        
        JSON Structure:
        {
          "summary": "One punchy, encouraging sentence about their level.",
          "strengths": ["Key strength 1", "Key strength 2"],
          "weaknesses": ["Key weakness 1", "Key weakness 2"],
          "roadmap": [
             { "step": "Step 1", "action": "Short actionable advice" },
             { "step": "Step 2", "action": "Short actionable advice" },
             { "step": "Step 3", "action": "Short actionable advice" }
          ],
          "resources": ["Topic to study", "Topic to study", "Topic to study"]
        }
        `;

        const completion = await groq.chat.completions.create({
            messages: [{ role: 'user', content: prompt }],
            model: 'llama-3.3-70b-versatile',
            response_format: { type: "json_object" }
        });

        res.json({ analysis: completion.choices[0]?.message?.content || "No analysis generated." });
    } catch (error) {
        console.error("AI Analysis Detailed Error:", error); // Log full error object
        res.status(500).json({
            message: 'Error generating analysis',
            error: error.message,
            analysis: `## Analysis Failed\n\nCould not generate AI insights at this moment.\n\nError: ${error.message}`
        });
    }
});

// GET /api/quiz/questions
router.get('/questions', async (req, res) => {
    try {
        const { category, search, admin } = req.query;
        const QuizQuestion = mongoose.model('QuizQuestion');

        let query = {};
        if (category) {
            query.category = new RegExp(category, 'i');
        }
        if (search) {
            query.question_text = new RegExp(search, 'i');
        }

        // Fetch all matching questions
        const questions = await QuizQuestion.find(query);

        // Admin View: Return paginated questions
        if (admin === 'true' || search) {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const skip = (page - 1) * limit;

            const total = await QuizQuestion.countDocuments(query);
            const paginatedQuestions = await QuizQuestion.find(query).skip(skip).limit(limit);

            return res.json({
                data: paginatedQuestions,
                pagination: {
                    totalRecords: total,
                    currentPage: page,
                    totalPages: Math.ceil(total / limit),
                    limit
                }
            });
        }

        // Student View: Random Shuffle & Limit
        const safeQuestions = questions.map(q => {
            const { correct_answer, explanation, ...rest } = q.toObject();
            return rest;
        });

        // Shuffle and take 10
        const shuffled = safeQuestions.sort(() => 0.5 - Math.random()).slice(0, 10);

        res.json(shuffled);
    } catch (error) {
        console.error("Error fetching questions:", error);
        res.status(500).json({ message: 'Error fetching questions', error });
    }
});

// POST /api/quiz/add
router.post('/add', async (req, res) => {
    try {
        const QuizQuestion = mongoose.model('QuizQuestion');
        const { question_text, options, correct_answer, category, explanation, difficulty } = req.body;

        // Duplicate Check
        const exists = await QuizQuestion.findOne({ question_text });
        if (exists) {
            return res.status(400).json({ message: 'Question already exists' });
        }

        const newQuestion = new QuizQuestion({
            question_text,
            options,
            correct_answer,
            category,
            explanation,
            difficulty
        });

        await newQuestion.save();
        res.status(201).json({ message: 'Question added successfully', question: newQuestion });
    } catch (error) {
        console.error("Error adding question:", error);
        res.status(500).json({ message: 'Error adding question', error });
    }
});

// DELETE /api/quiz/:id
router.delete('/:id', async (req, res) => {
    try {
        const QuizQuestion = mongoose.model('QuizQuestion');
        const { id } = req.params;
        await QuizQuestion.findByIdAndDelete(id);
        res.json({ message: 'Question deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting question', error });
    }
});

// POST /api/quiz/submit
router.post('/submit', async (req, res) => {
    try {
        const { username, category, answers, proctoringLog } = req.body;
        // answers: { questionId: "Selected Option" }

        const QuizQuestion = mongoose.model('QuizQuestion');

        let score = 0;
        let total = Object.keys(answers).length;
        const detailedResults = [];

        // Fetch all answered questions
        const questionIds = Object.keys(answers);
        const questions = await QuizQuestion.find({ _id: { $in: questionIds } });

        for (const [qId, selectedOpt] of Object.entries(answers)) {
            const question = questions.find(q => q._id.toString() === qId);
            if (question) {
                const isCorrect = question.correct_answer === selectedOpt;
                if (isCorrect) score++;
                detailedResults.push({
                    question: question.question_text,
                    selected: selectedOpt,
                    correct: question.correct_answer,
                    isCorrect
                });
            }
        }

        // Save attempt to student profile
        const Student = mongoose.model('Student');
        await Student.findOneAndUpdate(
            { username },
            {
                $push: {
                    quizAttempts: {
                        category,
                        score,
                        total,
                        proctoringLog: proctoringLog || [],
                        timestamp: new Date()
                    }
                }
            }
        );

        res.json({
            score,
            total,
            message: `You scored ${score} out of ${total}`,
            results: detailedResults
        });

    } catch (error) {
        console.error('Quiz submit error:', error);
        res.status(500).json({ message: 'Error submitting quiz', error });
    }
});

// POST /api/quiz/proctor
router.post('/proctor', async (req, res) => {
    try {
        const { imageBase64 } = req.body;
        if (!process.env.GROQ_API_KEY) {
            return res.status(500).json({ message: "Groq key missing" });
        }

        const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

        const completion = await groq.chat.completions.create({
            model: "llama-3.2-11b-vision-preview",
            messages: [
                {
                    role: "user",
                    content: [
                        {
                            type: "text",
                            text: "Analyze this webcam frame for an online exam proctoring system. Check for: 1. Multiple people in frame, 2. Person looking away from screen for too long, 3. Mobile phone usage, 4. No person in frame. Return ONLY a JSON object with: { 'isSuspicious': boolean, 'reason': 'string description if suspicious else null' }."
                        },
                        {
                            type: "image_url",
                            image_url: {
                                url: imageBase64
                            }
                        }
                    ]
                }
            ],
            response_format: { type: "json_object" }
        });

        const result = JSON.parse(completion.choices[0]?.message?.content || "{}");

        // If suspicious, upload to Cloudinary for permanent evidence
        if (result.isSuspicious) {
            try {
                const uploadRes = await cloudinary.uploader.upload(imageBase64, {
                    folder: 'proctoring_violations'
                });
                result.snapshotUrl = uploadRes.secure_url;
            } catch (uploadError) {
                console.error("Cloudinary Upload Failed:", uploadError);
            }
        }

        res.json(result);

    } catch (error) {
        console.error("Proctoring API Error:", error);
        res.status(500).json({ isSuspicious: false, error: error.message });
    }
});

module.exports = router;
