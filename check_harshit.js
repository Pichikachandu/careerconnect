const mongoose = require('mongoose');
require('dotenv').config();

const studentSchema = new mongoose.Schema({
    username: String,
    atsScans: [{
        resumeUrl: String,
        jobDescription: String,
        matchPercentage: Number,
        summary: String,
        missingKeywords: [String],
        recommendation: String,
        timestamp: { type: Date, default: Date.now }
    }]
});

mongoose.connect(process.env.MONGO_URI)
    .then(async () => {
        const Student = mongoose.model('Student', studentSchema);
        const student = await Student.findOne({ username: 'Harshit' });

        if (student) {
            console.log(`User: ${student.username}`);
            console.log(`Scans Count: ${student.atsScans.length}`);
            if (student.atsScans.length > 0) {
                console.log('--- Last Scan Details ---');
                const last = student.atsScans[student.atsScans.length - 1];
                console.log('Match %:', last.matchPercentage);
                console.log('Summary:', last.summary);
                console.log('Missing Keywords:', last.missingKeywords);
                console.log('Recommendation:', last.recommendation);
                console.log('Resume URL:', last.resumeUrl);
            }
        } else {
            console.log('Student Harshit not found');
        }

        process.exit(0);
    })
    .catch(err => {
        console.error(err);
        process.exit(1);
    });
