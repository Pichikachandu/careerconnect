const express = require('express');
const router = express.Router();
const multer = require('multer');
const pdf = require('pdf-parse');
const Groq = require("groq-sdk");
const axios = require('axios');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const mongoose = require('mongoose');
require('dotenv').config();

// Cloudinary Config
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
console.log("🚀 [ATS] Cloudinary Integration Route Loaded (Memory Mode)");

// Helper: Extract Text from PDF (Buffer)
async function extractTextFromPDF(buffer) {
    try {
        const data = await pdf(buffer);
        return data.text;
    } catch (error) {
        console.error("Critical PDF Parse Error:", error);
        throw new Error(`Failed to parse PDF: ${error.message}`);
    }
}

// Helper: Groq Analysis
async function analyzeResume(resumeText, jobDescription) {
    const prompt = `
        You are an expert ATS (Application Tracking System) scanner.
        
        Job Description:
        "${jobDescription.substring(0, 1000)}..." (truncated)
        
        Resume Content:
        "${resumeText.substring(0, 2000)}..." (truncated)
        
        Analyze the resume against the job description.
        Return a JSON object with:
        1. "match_percentage" (Integer 0-100)
        2. "missing_keywords" (Array of strings)
        3. "summary" (Brief professional summary of the candidate's fit)
        4. "recommendation" (Actionable advice to improve)
        
        Return ONLY raw JSON. No markdown.
    `;

    try {
        const completion = await groq.chat.completions.create({
            messages: [{ role: "user", content: prompt }],
            model: "llama-3.3-70b-versatile",
        });

        const content = completion.choices[0]?.message?.content || "";
        const jsonText = content.replace(/```json/g, '').replace(/```/g, '').trim();

        // Robust JSON parsing
        try {
            return JSON.parse(jsonText);
        } catch (e) {
            const match = jsonText.match(/(\{.*\})/s);
            if (match) return JSON.parse(match[0]);
            throw new Error("Failed to parse AI response: " + jsonText);
        }
    } catch (error) {
        console.error("AI Analysis Error:", error);
        throw error;
    }
}

// POST /api/ats/scan
// Body: FormData { resume: File, jobDescription: String }
// POST /api/ats/scan
// Body: FormData { resume: File, jobDescription: String }
// Helper: Upload Buffer to Cloudinary
async function uploadToCloudinary(buffer) {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            {
                folder: 'student_resumes',
                resource_type: 'image', // Use 'image' for PDF viewing support
                format: 'pdf',
                access_mode: 'public',
                type: 'upload',
                public_id: `resume_${Date.now()}`
            },
            (error, result) => {
                if (error) reject(error);
                else resolve(result);
            }
        );
        uploadStream.end(buffer);
    });
}

router.post('/scan', upload.single('resume'), async (req, res) => {
    try {
        const { jobDescription, username } = req.body;
        if (!req.file || !jobDescription) {
            return res.status(400).json({ message: "Resume and Job Description are required." });
        }

        console.log(`[ATS] Processing scan request for ${username}. File: ${req.file.originalname}`);

        // 1. Extract Text from Buffer (Immediate)
        const resumeText = await extractTextFromPDF(req.file.buffer);

        // 2. AI Analysis
        const analysis = await analyzeResume(resumeText, jobDescription);

        // 3. Parallel Upload to Cloudinary (Persistent storage)
        let resumeUrl = "";
        try {
            const uploadRes = await uploadToCloudinary(req.file.buffer);
            resumeUrl = uploadRes.secure_url;
            console.log(`[ATS] Resume uploaded to Cloudinary: ${resumeUrl}`);
        } catch (uploadError) {
            console.error("[ATS] Cloudinary Upload Failed:", uploadError);
        }

        // 4. Store Scan in Student Profile if username provided
        if (username) {
            console.log(`[ATS] Attempting to save scan for user: ${username}`);
            try {
                const Student = mongoose.model('Student');
                const updateResult = await Student.findOneAndUpdate(
                    { username: { $regex: new RegExp(`^${username}$`, 'i') } }, // Case-insensitive exact match
                    {
                        $push: {
                            atsScans: {
                                resumeUrl,
                                jobDescription: jobDescription.substring(0, 500),
                                matchPercentage: analysis.match_percentage || 0,
                                summary: analysis.summary || "No summary provided",
                                missingKeywords: analysis.missing_keywords || [],
                                recommendation: analysis.recommendation || "No recommendation",
                                timestamp: new Date()
                            }
                        }
                    },
                    { new: true }
                );

                if (updateResult) {
                    console.log(`[ATS] ✅ Scan history saved successfully for ${username}. History count: ${updateResult.atsScans.length}`);
                } else {
                    console.warn(`[ATS] ⚠️ User "${username}" not found in Student collection. History not saved.`);
                }
            } catch (dbError) {
                console.error("[ATS] ❌ Database Save Error:", dbError);
            }
        } else {
            console.warn("[ATS] ⚠️ No username provided in request. Skipping history save.");
        }

        console.log("[ATS] Analysis complete.");
        res.json({ ...analysis, resumeUrl });

    } catch (error) {
        console.error("[ATS] Route Handler Error:", error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
});

// GET /api/ats/history/:username
router.get('/history/:username', async (req, res) => {
    try {
        const { username } = req.params;
        const Student = mongoose.model('Student');
        const student = await Student.findOne({
            username: { $regex: new RegExp(`^${username}$`, 'i') }
        }).select('atsScans');

        if (!student) {
            return res.status(404).json({ message: "Student not found" });
        }

        // Return scans sorted by newest first
        const history = (student.atsScans || []).sort((a, b) => b.timestamp - a.timestamp);
        res.json(history);
    } catch (error) {
        console.error("[ATS] History Fetch Error:", error);
        res.status(500).json({ message: "Failed to fetch history" });
    }
});

module.exports = router;
