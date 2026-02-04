const express = require('express');
const router = express.Router();
const Groq = require("groq-sdk");
require('dotenv').config();

// Initialize Groq
// CAUTION: Ensure GROQ_API_KEY is in your .env file
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// Helper to get formatted text from Groq
async function generateContent(prompt) {
    try {
        const completion = await groq.chat.completions.create({
            messages: [
                {
                    role: "user",
                    content: prompt,
                },
            ],
            model: "llama-3.3-70b-versatile",
        });
        return completion.choices[0]?.message?.content || "";
    } catch (error) {
        console.error("Groq API Error:", error);
        throw error;
    }
}

// POST /api/interview/questions
router.post('/questions', async (req, res) => {
    try {
        const { jobRole, techStack, experience, topic, scenarioBased = false } = req.body;

        if (!jobRole || !techStack) {
            return res.status(400).json({ message: "Job Role and Tech Stack are required" });
        }

        let prompt;
        if (scenarioBased && topic) {
            prompt = `
                Generate 5 scenario-based interview questions for a ${jobRole} role focusing on ${topic}.
                The candidate has ${experience} years of experience with ${techStack}.
                Each question should present a realistic work scenario or problem related to ${topic}.
                Return ONLY a raw JSON array of strings (e.g. ["Scenario 1...?", "Scenario 2...?"]).
                Do not include Markdown formatting or extra text.
            `;
        } else {
            prompt = `
                Generate 10 technical interview questions for a ${jobRole} role requiring experience in ${techStack}.
                The candidate has ${experience} years of experience.
                Focus on fundamental concepts and practical applications.
                Return ONLY a raw JSON array of strings (e.g. ["Question 1?", "Question 2?"]).
                Do not include Markdown formatting or extra text.
            `;
        }

        const text = await generateContent(prompt);
        // Clean up markdown if AI adds it
        const jsonText = text.replace(/```json/g, '').replace(/```/g, '').trim();

        let questions;
        try {
            questions = JSON.parse(jsonText);
        } catch (e) {
            const match = jsonText.match(/\[.*\]/s);
            if (match) {
                questions = JSON.parse(match[0]);
            } else {
                throw new Error("Failed to parse AI response");
            }
        }

        res.json({ questions });
    } catch (error) {
        console.error("Questions Error:", error);
        res.status(500).json({ message: "Failed to generate questions", error: error.message });
    }
});

// POST /api/interview/feedback
router.post('/feedback', async (req, res) => {
    try {
        const { question, answer } = req.body;

        const prompt = `
            Evaluate this interview answer.
            Question: "${question}"
            Candidate Answer: "${answer}"
            
            Provide a JSON object with:
            1. "rating" (Integer 1-10)
            2. "feedback" (String, 1-2 sentences)
            3. "ideal_answer" (String, brief improvement)
            
            Return ONLY raw JSON.
        `;

        const text = await generateContent(prompt);
        const jsonText = text.replace(/```json/g, '').replace(/```/g, '').trim();

        let evaluation;
        try {
            evaluation = JSON.parse(jsonText);
        } catch (e) {
            const match = jsonText.match(/(\{.*\})/s);
            if (match) {
                evaluation = JSON.parse(match[0]);
            } else {
                throw new Error("Failed to parse AI response");
            }
        }

        res.json(evaluation);
    } catch (error) {
        console.error("Feedback Error:", error);
        res.status(500).json({ message: "Failed to generate feedback", error: error.message });
    }
});

// POST /api/interview/analyze-session
router.post('/analyze-session', async (req, res) => {
    try {
        const { history } = req.body; // Array of { question, answer, rating, feedback, ideal_answer }

        if (!history || !Array.isArray(history)) {
            return res.status(400).json({ message: "Invalid history data" });
        }

        const prompt = `
            Analyze this full technical interview session.
            
            History:
            ${JSON.stringify(history)}

            Provide a comprehensive JSON object with:
            1. "overallScore" (Integer 1-100, calculate avg based on ratings)
            2. "verdict" (String: "Strong Hire", "Hire", "Weak Hire", "Reject")
            3. "summary" (String: 2-3 sentences overview)
            4. "strengths" (Array of strings)
            5. "areasForImprovement" (Array of strings)
            6. "recommendedResources" (Array of strings, topics to study)

            Return ONLY raw JSON.
        `;

        const text = await generateContent(prompt);
        const jsonText = text.replace(/```json/g, '').replace(/```/g, '').trim();

        let analysis;
        try {
            analysis = JSON.parse(jsonText);
        } catch (e) {
            const match = jsonText.match(/(\{.*\})/s);
            if (match) {
                analysis = JSON.parse(match[0]);
            } else {
                throw new Error("Failed to parse AI response");
            }
        }

        res.json(analysis);

    } catch (error) {
        console.error("Session Analysis Error:", error);
        res.status(500).json({ message: "Failed to analyze session", error: error.message });
    }
});

module.exports = router;
