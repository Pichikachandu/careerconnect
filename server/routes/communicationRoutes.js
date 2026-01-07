const express = require('express');
const router = express.Router();
const Groq = require("groq-sdk");
require('dotenv').config();

// Initialize Groq
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// Helper to get formatted text from Groq
// model parameter added to support switching
async function generateContent(messages, model = "llama-3.3-70b-versatile") {
    try {
        const completion = await groq.chat.completions.create({
            messages: messages,
            model: model,
        });
        return completion.choices[0]?.message?.content || "";
    } catch (error) {
        console.error("Groq API Error:", error);
        throw error;
    }
}

// POST /api/communication/chat
router.post('/chat', async (req, res) => {
    try {
        const { message, mode, history = [] } = req.body;
        // mode: 'voice' | 'chat' | 'scenario'
        // history: previous conversation for context

        let systemPrompt = "";
        let selectedModel = "llama-3.3-70b-versatile"; // Default smart model

        if (mode === 'voice') {
            // Voice needs SPEED (Low Latency)
            selectedModel = "llama-3.1-8b-instant";
            systemPrompt = `
                You are a friendly and encouraging English Communication Coach. 
                Your goal is to help the user practice spoken English fluency. 
                Keep your responses polite, conversational, and concise (1-2 sentences max). 
                If the user makes a major grammar mistake that affects meaning, gently correct it, but prioritize flow. 
                Do not be overly pedantic. Ask open-ended questions to keep the conversation going.
            `;
        } else if (mode === 'chat') {
            // Chat needs INTELLIGENCE (High Accuracy)
            selectedModel = "llama-3.3-70b-versatile";
            systemPrompt = `
                You are a strict but helpful **English Grammar and Style Coach**. 
                Your goal is to improve the user's written English. 
                
                For every user input, you MUST Provide the response in this specific Markdown format:

                **1. Correction:** (Only if needed, otherwise say "Perfect!")
                > [Corrected Sentence]

                **2. Feedback:**
                (Brief explanation of why the change was made, or a compliment if it was good.)

                **3. Reply:**
                (A natural, conversational follow-up question or comment to keep the chat going.)

                Keep the tone encouraging but educational.
            `;
        } else if (mode === 'scenario') {
            // Roleplay needs CREATIVITY (High Intelligence)
            selectedModel = "llama-3.3-70b-versatile";
            systemPrompt = `
                You are an AI Roleplay Partner. 
                The user wants to practice a specific scenario (e.g., Job Interview, Coffee Shop, Business Meeting). 
                Stay in character. React naturally to the user's input. 
                If the user struggles, offer a subtle hint in parentheses, but mostly focus on the roleplay.
            `;
        }

        const messages = [
            { role: "system", content: systemPrompt },
            ...history,
            { role: "user", content: message }
        ];

        const reply = await generateContent(messages, selectedModel);

        res.json({ reply });

    } catch (error) {
        console.error("Communication API Error:", error);
        res.status(500).json({ message: "Failed to generate response", error: error.message });
    }
});

// POST /api/communication/scenario-start
// To generate an opening line for a scenario
router.post('/scenario-start', async (req, res) => {
    try {
        const { scenario } = req.body;
        const prompt = `
            Act as a roleplay partner for the scenario: "${scenario}". 
            Generate a short, engaging opening line to start the conversation with the user.
        `;

        // Use smart model for opening line
        const reply = await generateContent([{ role: "user", content: prompt }], "llama-3.3-70b-versatile");
        res.json({ reply });
    } catch (error) {
        console.error("Scenario Start Error:", error);
        res.status(500).json({ message: "Failed to start scenario", error: error.message });
    }
});

module.exports = router;
