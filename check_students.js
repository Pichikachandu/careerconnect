const mongoose = require('mongoose');
require('dotenv').config();

const studentSchema = new mongoose.Schema({
    username: String,
    atsScans: Array
});

mongoose.connect(process.env.MONGO_URI)
    .then(async () => {
        const Student = mongoose.model('Student', studentSchema);
        const students = await Student.find({}, 'username atsScans');

        console.log('--- Student Data ---');
        students.forEach(s => {
            console.log(`User: ${s.username} | Scans Count: ${s.atsScans ? s.atsScans.length : 0}`);
            if (s.atsScans && s.atsScans.length > 0) {
                console.log('Last Scan:', JSON.stringify(s.atsScans[s.atsScans.length - 1], null, 2));
            }
        });

        process.exit(0);
    })
    .catch(err => {
        console.error(err);
        process.exit(1);
    });
