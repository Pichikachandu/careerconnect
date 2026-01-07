const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');
const quizRoutes = require('./server/routes/quizRoutes');
const communicationRoutes = require('./server/routes/communicationRoutes');
const atsRoutes = require('./server/routes/atsRoutes');
const interviewRoutes = require('./server/routes/interviewRoutes');
const dsaRoutes = require('./server/routes/dsaRoutes');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');
require('dotenv').config();

// Cloudinary Config
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// Multer Config
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'student_profiles',
        allowed_formats: ['jpg', 'png', 'jpeg'],
        transformation: [{ width: 500, height: 500, crop: 'limit' }]
    },
});

const resumeStorage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'student_resumes',
        resource_type: 'raw', // Critical for non-image files like PDF
        format: 'pdf',
        public_id: (req, file) => `resume_${Date.now()}`
    },
});

const upload = multer({ storage: storage });
const uploadResume = multer({ storage: resumeStorage });

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.error('MongoDB Connection Error:', err));

// --- Schemas & Models ---

// Student Schema
const studentSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    dob: { type: Date },
    college: { type: String },
    department: { type: String },
    gender: { type: String },
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    city: { type: String, default: '' },
    createdAt: { type: Date, default: Date.now },
    profilePicture: { type: String, default: '' },
    quizAttempts: [{
        category: String,
        score: Number,
        total: Number,
        timestamp: Date,
        proctoringLog: [{
            snapshotUrl: String,
            reason: String,
            timestamp: { type: Date, default: Date.now }
        }]
    }],
    dsaAttempts: [{
        qid: String,
        title: String,
        difficulty: String,
        status: String,
        timestamp: Date
    }],
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
const Student = mongoose.model('Student', studentSchema);

// Admin Schema
const adminSchema = new mongoose.Schema({
    name: { type: String, required: true },
    position: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
});
const Admin = mongoose.model('Admin', adminSchema);

// Announcement Schema (Updated)
const announcementSchema = new mongoose.Schema({
    title: String,
    content: String,
    type: { type: String, enum: ['normal', 'drive'], default: 'normal' },
    company: String,
    role: String,
    package: String,
    location: String,
    date: String,
    batch: String,
    eligibility: String,
    applyLink: String,
    status: { type: String, enum: ['Active', 'Ended', 'Cancelled'], default: 'Active' },
    cancelReason: String,
    createdAt: { type: Date, default: Date.now },
});
const Announcement = mongoose.model('Announcement', announcementSchema);

// Company Schema
const companySchema = new mongoose.Schema({
    name: String,
    email: String,
    company_add: String,
    phone: String,
    username: { type: String, unique: true },
    password: String, // The password will be hashed
});
const Company = mongoose.model('Company', companySchema);

// Quiz Question Schema
const quizQuestionSchema = new mongoose.Schema({
    question_text: { type: String, required: true },
    options: [{ type: String, required: true }],
    correct_answer: { type: String, required: true },
    category: { type: String, default: 'Technical' },
    explanation: String,
    difficulty: { type: String, default: 'Medium' }
});
const QuizQuestion = mongoose.model('QuizQuestion', quizQuestionSchema);

// DSA Problem Schema
const dsaProblemSchema = new mongoose.Schema({
    title: { type: String, required: true },
    titleSlug: String,
    difficulty: { type: String, default: 'Easy' },
    topics: String, // Comma-separated or array. Keeping string to match current usage for now, or array? Current is string in CSV.
    Body: String,
    examples: [{ input: String, output: String }],
    createdAt: { type: Date, default: Date.now }
});
const DSAProblem = mongoose.model('DSAProblem', dsaProblemSchema);


// --- Routes ---

// 1. Announcements (Admin)
app.post('/announcements', async (req, res) => {
    try {
        const { title, content, type, company, role, package, location, date, batch, eligibility, applyLink } = req.body;
        const newAnnouncement = new Announcement({
            title, content, type, company, role, package, location, date, batch, eligibility, applyLink
        });
        await newAnnouncement.save();
        res.status(201).json({ message: 'Announcement created successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error creating announcement', error });
    }
});

app.get('/announcements', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const total = await Announcement.countDocuments();
        const announcements = await Announcement.find().sort({ createdAt: -1 }).skip(skip).limit(limit);

        res.status(200).json({
            data: announcements,
            pagination: {
                totalRecords: total,
                currentPage: page,
                totalPages: Math.ceil(total / limit),
                limit
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching announcements', error });
    }
});

// Update Announcement (Edit Drive)
app.put('/announcements/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const updatedData = req.body;
        const result = await Announcement.findByIdAndUpdate(id, updatedData, { new: true });
        if (!result) return res.status(404).json({ message: 'Announcement not found' });
        res.json(result);
    } catch (error) {
        res.status(500).json({ message: 'Error updating announcement', error });
    }
});

// Update Announcement Status (End/Cancel)
app.patch('/announcements/:id/status', async (req, res) => {
    try {
        const { id } = req.params;
        const { status, cancelReason } = req.body; // status: 'Ended' | 'Cancelled'

        const update = { status };
        if (status === 'Cancelled' && cancelReason) {
            update.cancelReason = cancelReason;
        }

        const result = await Announcement.findByIdAndUpdate(id, update, { new: true });
        if (!result) return res.status(404).json({ message: 'Announcement not found' });
        res.json(result);
    } catch (error) {
        res.status(500).json({ message: 'Error updating status', error });
    }
});

app.get('/announcements/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const announcement = await Announcement.findById(id);
        if (!announcement) {
            return res.status(404).json({ message: 'Announcement not found' });
        }
        res.status(200).json(announcement);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching announcement', error });
    }
});

app.delete('/announcements/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const deletedAnnouncement = await Announcement.findByIdAndDelete(id);
        if (!deletedAnnouncement) {
            return res.status(404).json({ message: 'Announcement not found' });
        }
        res.status(200).json({ message: 'Announcement deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting announcement', error });
    }
});

// 2. Company Announcements
app.post('/company/announcements', async (req, res) => {
    try {
        const { title, content, type, company, role, package, location, date, batch, eligibility, applyLink } = req.body;
        // Ideally should verify company identity here via token
        const newAnnouncement = new Announcement({
            title, content, type, company, role, package, location, date, batch, eligibility, applyLink
        });
        await newAnnouncement.save();
        res.status(201).json({ message: 'Announcement created successfully by company' });
    } catch (error) {
        res.status(500).json({ message: 'Error creating announcement', error });
    }
});

// 3. Companies
app.get('/companies', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const search = req.query.search || '';
        const skip = (page - 1) * limit;

        const query = search ? {
            $or: [
                { name: new RegExp(search, 'i') },
                { email: new RegExp(search, 'i') }
            ]
        } : {};

        const total = await Company.countDocuments(query);
        const companies = await Company.find(query).select('-password').skip(skip).limit(limit);

        res.status(200).json({
            data: companies,
            pagination: {
                totalRecords: total,
                currentPage: page,
                totalPages: Math.ceil(total / limit),
                limit
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching companies', error });
    }
});

app.delete('/companies/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const deletedCompany = await Company.findByIdAndDelete(id);
        if (!deletedCompany) {
            return res.status(404).json({ message: 'Company not found' });
        }
        res.status(200).json({ message: 'Company deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting company', error });
    }
});

// 4. Student Auth & Profile
app.post('/register', async (req, res) => {
    try {
        const { name, email, phone, dob, college, department, gender, username, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const newStudent = new Student({
            name, email, phone, dob, college, department, gender, username, password: hashedPassword,
        });
        await newStudent.save();
        res.status(201).json({ message: 'Student registration successful' });
    } catch (error) {
        if (error.code === 11000) {
            res.status(400).json({ message: 'Username already exists' });
        } else {
            res.status(500).json({ message: 'Error during registration', error });
        }
    }
});

app.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await Student.findOne({ username });
        if (!user) return res.status(401).json({ message: 'Invalid username or password' });

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) return res.status(401).json({ message: 'Invalid username or password' });

        res.status(200).json({
            message: 'Login successful',
            user: { _id: user._id, name: user.name, username: user.username, email: user.email, department: user.department }
        });
    } catch (error) {
        res.status(500).json({ message: 'Error during login', error });
    }
});

app.get('/students', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const search = req.query.search || '';
        const department = req.query.department || '';
        const skip = (page - 1) * limit;

        const query = {};
        if (search) {
            query.$or = [
                { name: new RegExp(search, 'i') },
                { username: new RegExp(search, 'i') },
                { email: new RegExp(search, 'i') }
            ];
        }
        if (department && department !== 'All') {
            query.department = department;
        }

        const total = await Student.countDocuments(query);
        const students = await Student.find(query).skip(skip).limit(limit);

        res.status(200).json({
            data: students,
            pagination: {
                totalRecords: total,
                currentPage: page,
                totalPages: Math.ceil(total / limit),
                limit
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching students', error });
    }
});

app.get('/students/:username', async (req, res) => {
    try {
        const student = await Student.findOne({ username: req.params.username });
        if (student) res.json(student);
        else res.status(404).json({ message: 'Student not found' });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

app.put('/students/:username', async (req, res) => {
    const { username } = req.params;
    const { name, email, phone, gender, department, city } = req.body;

    try {
        const updatedStudent = await Student.findOneAndUpdate(
            { username },
            { name, email, phone, gender, department, city },
            { new: true }
        );
        if (updatedStudent) res.json(updatedStudent);
        else res.status(404).json({ message: 'Student not found' });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

// Upload Profile Picture
app.post('/students/:username/upload-photo', upload.single('profilePicture'), async (req, res) => {
    try {
        const { username } = req.params;
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        const profilePictureUrl = req.file.path;

        // Update student record
        const updatedStudent = await Student.findOneAndUpdate(
            { username },
            { profilePicture: profilePictureUrl },
            { new: true }
        );

        if (!updatedStudent) return res.status(404).json({ message: 'Student not found' });

        res.json({
            message: 'Profile picture updated successfully',
            profilePicture: profilePictureUrl,
            student: updatedStudent
        });

    } catch (error) {
        console.error('Upload Error:', error);
        res.status(500).json({ message: 'Image upload failed', error: error.message });
    }
});

app.delete('/students/:username', async (req, res) => {
    try {
        const deletedStudent = await Student.findOneAndDelete({ username: req.params.username });
        if (deletedStudent) res.json({ message: 'Student deleted successfully' });
        else res.status(404).json({ message: 'Student not found' });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

app.get('/students/count', async (req, res) => {
    try {
        const count = await Student.countDocuments();
        res.status(200).json({ count });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching count', error });
    }
});


// 5. Admin Auth & Profile
app.post('/admin/register', async (req, res) => {
    try {
        const { name, position, email, phone, username, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const newAdmin = new Admin({ name, position, email, phone, username, password: hashedPassword });
        await newAdmin.save();
        res.status(201).json({ message: 'Admin registration successful' });
    } catch (error) {
        if (error.code === 11000) res.status(400).json({ message: 'Username already exists' });
        else res.status(500).json({ message: 'Error during registration', error });
    }
});

app.post('/admin/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const admin = await Admin.findOne({ username });
        if (!admin) return res.status(401).json({ message: 'Invalid username or password' });

        const isPasswordValid = await bcrypt.compare(password, admin.password);
        if (!isPasswordValid) return res.status(401).json({ message: 'Invalid username or password' });

        res.status(200).json({
            message: 'Admin login successful',
            admin: { name: admin.name, position: admin.position }
        });
    } catch (error) {
        res.status(500).json({ message: 'Error during login', error });
    }
});

app.get('/admin/profile', async (req, res) => {
    try {
        const { username } = req.query;
        const admin = await Admin.findOne({ username });
        if (!admin) return res.status(404).json({ message: 'Admin not found' });
        res.status(200).json({ username: admin.username, email: admin.email, position: admin.position });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching admin profile', error });
    }
});

app.put('/admin/:username', async (req, res) => {
    try {
        const { username } = req.params;
        const { name, email, phone, position } = req.body;
        const updatedAdmin = await Admin.findOneAndUpdate({ username }, { name, email, phone, position }, { new: true });
        if (!updatedAdmin) return res.status(404).json({ message: 'Admin not found' });
        res.status(200).json(updatedAdmin);
    } catch (error) {
        res.status(500).json({ message: 'Error updating admin profile', error });
    }
});

// 6. Company Auth
app.post('/company/register', async (req, res) => {
    try {
        const { name, email, company_add, phone, username, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const newCompany = new Company({ name, email, company_add, phone, username, password: hashedPassword });
        await newCompany.save();
        res.status(201).json({ message: 'Company registration successful' });
    } catch (error) {
        if (error.code === 11000) res.status(400).json({ message: 'Username already exists' });
        else res.status(500).json({ message: 'Error during registration', error });
    }
});

app.post('/company/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const company = await Company.findOne({ username });
        if (!company) return res.status(401).json({ message: 'Invalid username or password' });
        const isPasswordValid = await bcrypt.compare(password, company.password);
        if (!isPasswordValid) return res.status(401).json({ message: 'Invalid username or password' });
        res.status(200).json({ message: 'Company login successful', company: { name: company.name } });
    } catch (error) {
        res.status(500).json({ message: 'Error during login', error });
    }
});

// Use Routes
app.use('/api/quiz', quizRoutes);
app.use('/api/communication', communicationRoutes);
app.use('/api/ats', atsRoutes);
app.use('/api/interview', interviewRoutes);
app.use('/api/dsa', dsaRoutes);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log("✅ CareerConnect Backend - Version 2.0 (Cloudinary ATS) Active");
});
