const mongoose = require('mongoose');
require('dotenv').config();

const studentSchema = new mongoose.Schema({
    username: String
});

mongoose.connect(process.env.MONGO_URI)
    .then(async () => {
        const Student = mongoose.model('Student', studentSchema);
        const users = await Student.find({}, 'username');
        console.log('All Usernames:', users.map(u => u.username));
        process.exit(0);
    })
    .catch(err => {
        console.error(err);
        process.exit(1);
    });
