const mongoose = require('mongoose');
require('dotenv').config();

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

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(async () => {
        const QuizQuestion = mongoose.model('QuizQuestion', quizQuestionSchema);
        const DSAProblem = mongoose.model('DSAProblem', dsaProblemSchema);

        const quizCount = await QuizQuestion.countDocuments();
        const dsaCount = await DSAProblem.countDocuments();

        console.log(`Quiz Questions: ${quizCount}`);
        console.log(`DSA Problems: ${dsaCount}`);
        process.exit(0);
    })
    .catch(err => {
        console.error(err);
        process.exit(1);
    });
