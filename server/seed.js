const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const { parse } = require('csv-parse/sync');
require('dotenv').config();

// Define Schemas matches server.js
const quizQuestionSchema = new mongoose.Schema({
    question_text: { type: String, required: true },
    options: [{ type: String, required: true }],
    correct_answer: { type: String, required: true },
    category: { type: String, default: 'Technical' },
    explanation: String,
    difficulty: { type: String, default: 'Medium' }
});

const dsaProblemSchema = new mongoose.Schema({
    title: { type: String, required: true },
    titleSlug: String,
    difficulty: { type: String, default: 'Easy' },
    topics: String,
    Body: String,
    examples: [{ input: String, output: String }],
    createdAt: { type: Date, default: Date.now }
});

// Connect
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => {
        console.log('MongoDB Connected for Seeding');
        seedData();
    })
    .catch(err => console.error('MongoDB Connection Error:', err));

async function seedData() {
    try {
        const QuizQuestion = mongoose.model('QuizQuestion', quizQuestionSchema);
        const DSAProblem = mongoose.model('DSAProblem', dsaProblemSchema);

        // 1. Seed Quiz Questions
        const quizPath = path.join(__dirname, '../data/questions.json');
        if (fs.existsSync(quizPath)) {
            const quizData = JSON.parse(fs.readFileSync(quizPath, 'utf8'));
            console.log(`Found ${quizData.length} quiz questions to process.`);

            for (const q of quizData) {
                // Check duplicate
                const exists = await QuizQuestion.findOne({ question_text: q.question_text });
                if (!exists) {
                    await QuizQuestion.create({
                        question_text: q.question_text,
                        options: q.options,
                        correct_answer: q.correct_answer,
                        category: q.category || 'General',
                        explanation: q.explanation || '',
                        difficulty: 'Medium'
                    });
                    process.stdout.write('+');
                } else {
                    process.stdout.write('.');
                }
            }
            console.log('\nQuiz Seeding Complete.');
        } else {
            console.log('No questions.json found at ../data/questions.json');
        }

        // 2. Seed DSA Questions
        const dsaPath = path.join(__dirname, '../CodingPract/question_details.csv');
        if (fs.existsSync(dsaPath)) {
            const fileContent = fs.readFileSync(dsaPath, 'utf8');
            const dsaData = parse(fileContent, {
                columns: true,
                skip_empty_lines: true
            });
            console.log(`Found ${dsaData.length} DSA problems to process.`);

            for (const p of dsaData) {
                // CSV fields: QID,title,titleSlug,difficulty,Hints,Companies,topics,SimilarQuestions,Code,Body,isPaidOnly
                const exists = await DSAProblem.findOne({ title: p.title });
                if (!exists) {
                    await DSAProblem.create({
                        title: p.title,
                        titleSlug: p.titleSlug,
                        difficulty: p.difficulty,
                        topics: p.topics, // stored as string "['Array']" or similar based on CSV
                        Body: p.Body
                    });
                    process.stdout.write('+');
                } else {
                    process.stdout.write('.');
                }
            }
            console.log('\nDSA Seeding Complete.');
        } else {
            console.log('No question_details.csv found.');
        }

        console.log('All Done. Exiting.');
        process.exit(0);

    } catch (error) {
        console.error('Seeding Error:', error);
        process.exit(1);
    }
}
