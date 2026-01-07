import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import axios from 'axios';
import AnnouncementList from '../components/AnnouncementList';
import { LayoutDashboard, Users, Megaphone, LogOut, User, Trash2, Menu, X, Search, Bell, Settings, MoreVertical, Mail, Phone, MapPin, Edit, TrendingUp, Calendar, AlertCircle, ChevronLeft, ChevronRight, Award, Filter } from 'lucide-react';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    if (totalPages <= 1) return null;
    return (
        <div className="flex justify-center items-center gap-2 mt-6">
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="p-2 border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                <ChevronLeft size={16} />
            </button>
            <span className="text-sm font-medium text-slate-600">
                Page {currentPage} of {totalPages}
            </span>
            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="p-2 border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                <ChevronRight size={16} />
            </button>
        </div>
    );
};

const AdminDashboard = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [activeTab, setActiveTab] = useState(location.state?.activeTab || 'dashboard'); // dashboard, students, companies, announcements, content
    const [students, setStudents] = useState([]);
    const [companies, setCompanies] = useState([]);
    const [announcementsCount, setAnnouncementsCount] = useState(0);
    const [loading, setLoading] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedDepartment, setSelectedDepartment] = useState('All');

    // Pagination State
    const [studentPage, setStudentPage] = useState(1);
    const [studentTotalPages, setStudentTotalPages] = useState(1);
    const [companyPage, setCompanyPage] = useState(1);
    const [companyTotalPages, setCompanyTotalPages] = useState(1);
    const [contentList, setContentList] = useState([]);
    const [contentTotalPages, setContentTotalPages] = useState(1);
    const [contentPage, setContentPage] = useState(1);
    const [contentType, setContentType] = useState('quiz'); // 'quiz' | 'dsa'
    const [contentSearch, setContentSearch] = useState('');
    const [isSearchingContent, setIsSearchingContent] = useState(false);

    // Announcement State
    const [announcementView, setAnnouncementView] = useState('active'); // 'active' | 'history'

    // Edit Student State
    const [editingStudent, setEditingStudent] = useState(null);
    const [editForm, setEditForm] = useState({
        name: '',
        email: '',
        phone: '',
        department: '',
        gender: ''
    });

    // Content Form State
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [questionData, setQuestionData] = useState({
        // Quiz
        question_text: '', option1: '', option2: '', option3: '', option4: '', correct_answer: '', category: 'Technical', explanation: '',
        // DSA
        title: '', difficulty: 'Easy', topics: '', Body: ''
    });

    // Content Management State (Cleaned up)
    const [error, setError] = useState(null);


    useEffect(() => {
        const adminData = localStorage.getItem('adminData');
        if (!adminData) {
            navigate('/login/admin');
        } else {
            if (activeTab === 'students') fetchStudents();
            if (activeTab === 'companies') fetchCompanies();
            if (activeTab === 'content') fetchContent();
            if (activeTab === 'dashboard') { fetchStudents(); fetchCompanies(); fetchStats(); }
        }
    }, [navigate, activeTab, studentPage, companyPage, contentPage, contentType, contentSearch, selectedDepartment]);

    // Debounce Search
    useEffect(() => {
        const timer = setTimeout(() => {
            if (activeTab === 'students') { setStudentPage(1); fetchStudents(); }
            if (activeTab === 'companies') { setCompanyPage(1); fetchCompanies(); }
        }, 500);
        return () => clearTimeout(timer);
    }, [searchQuery]);

    const handleLogout = () => {
        localStorage.clear();
        navigate('/login/admin');
    };

    const fetchStudents = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`http://localhost:3000/students?page=${studentPage}&limit=10&search=${searchQuery}&department=${selectedDepartment !== 'All' ? encodeURIComponent(selectedDepartment) : ''}`);
            setStudents(res.data.data);
            setStudentTotalPages(res.data.pagination.totalPages);
        } catch (error) {
            console.error('Error fetching students', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchCompanies = async () => {
        try {
            const res = await axios.get(`http://localhost:3000/companies?page=${companyPage}&limit=10&search=${searchQuery}`);
            setCompanies(res.data.data);
            setCompanyTotalPages(res.data.pagination.totalPages);
        } catch (error) {
            console.error('Error fetching companies', error);
        }
    };

    const fetchStats = async () => {
        try {
            const annRes = await axios.get('http://localhost:3000/announcements');
            setAnnouncementsCount(annRes.data.length);
        } catch (error) {
            console.error(error);
        }
    }

    const handleDeleteStudent = async (id) => {
        if (!window.confirm('Are you sure you want to delete this student?')) return;
        try {
            await axios.delete(`http://localhost:3000/students/${id}`);
            fetchStudents();
        } catch (error) {
            console.error('Error deleting student', error);
            alert('Failed to delete student');
        }
    };

    const handleDeleteCompany = async (id) => {
        if (!window.confirm('Are you sure you want to delete this company?')) return;
        try {
            await axios.delete(`http://localhost:3000/companies/${id}`);
            fetchCompanies();
        } catch (error) {
            console.error('Error deleting company', error);
            alert('Failed to delete company');
        }
    };

    const handleEditStudent = (student) => {
        setEditingStudent(student);
        setEditForm({
            name: student.name || '',
            email: student.email || '',
            phone: student.phone || '',
            department: student.department || '',
            gender: student.gender || ''
        });
    };

    const handleUpdateStudent = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`http://localhost:3000/students/${editingStudent.username}`, editForm);
            alert('Student Updated Successfully');
            setEditingStudent(null);
            fetchStudents();
        } catch (error) {
            console.error('Error updating student', error);
            alert('Failed to update student');
        }
    };

    const handleContentSubmit = async (e) => {
        e.preventDefault();
        try {
            const endpoint = contentType === 'quiz' ? 'http://localhost:3000/api/quiz/add' : 'http://localhost:3000/api/dsa/add';

            // Format payload based on content type
            const payload = contentType === 'quiz' ? {
                question_text: questionData.question_text,
                options: [questionData.option1, questionData.option2, questionData.option3, questionData.option4],
                correct_answer: questionData.correct_answer,
                category: questionData.category,
                explanation: questionData.explanation,
                difficulty: 'Medium' // Default or add field if needed
            } : questionData;

            await axios.post(endpoint, payload);
            alert(`${contentType.toUpperCase()} Question Added Successfully!`);
            setQuestionData({
                question_text: '', option1: '', option2: '', option3: '', option4: '', correct_answer: '', category: 'Technical', explanation: '',
                title: '', difficulty: 'Easy', topics: '', Body: ''
            });
        } catch (error) {
            console.error(error);
            const msg = error.response?.data?.message || "Failed to add content. Backend likely missing add route.";
            alert(`Error: ${msg}`);
        }
    };

    const fetchContent = async () => {
        setIsSearchingContent(true);
        setError(null);
        try {
            let url;
            if (contentType === 'quiz') {
                url = `http://localhost:3000/api/quiz/questions?admin=true&page=${contentPage}&limit=10${contentSearch ? `&search=${encodeURIComponent(contentSearch)}` : ''}`;
            } else {
                url = `http://localhost:3000/api/dsa/questions?limit=10&page=${contentPage}${contentSearch ? `&search=${encodeURIComponent(contentSearch)}` : ''}`;
            }

            console.log("Fetching content from:", url);
            const res = await axios.get(url);

            let data = [];
            if (contentType === 'quiz') {
                // Parse paginated Quiz response
                if (res.data.data) {
                    data = res.data.data;
                    setContentTotalPages(res.data.pagination?.totalPages || 1);
                } else {
                    data = res.data; // Fallback for old API if needed
                }
            } else {
                // Parse paginated DSA response
                data = res.data.questions || [];
                // Calculate total pages for DSA locally or from API if provided 
                // (DSA API returns total count, so we can calc pages)
                const total = res.data.total || 0;
                setContentTotalPages(Math.ceil(total / (res.data.limit || 10)) || 1);
            }

            console.log("Data loaded:", data?.length);

            if (!Array.isArray(data)) data = [];
            setContentList(data);
        } catch (error) {
            console.error("Fetch content error", error);
            setError("Failed to load content. Check console.");
            setContentList([]);
        } finally {
            setIsSearchingContent(false);
        }
    };

    // Alias for search button
    const handleSearchContent = fetchContent;

    const handleDeleteContent = async (id) => {
        if (!window.confirm("Are you sure you want to delete this content?")) return;
        try {
            const endpoint = contentType === 'quiz'
                ? `http://localhost:3000/api/quiz/${id}`
                : `http://localhost:3000/api/dsa/${id}`;
            await axios.delete(endpoint);
            alert("Deleted successfully");
            setContentList(contentList.filter(item => (item._id || item.QID) !== id));
        } catch (error) {
            console.error("Delete error", error);
            alert("Failed to delete");
        }
    };

    // Auto-fetch content when viewing content tab or changing type
    useEffect(() => {
        if (activeTab === 'content') {
            fetchContent();
        }
    }, [activeTab, contentType]);

    const getFilteredStudents = () => {
        return students.filter(s =>
            (s.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
            (s.username || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
            (s.email || '').toLowerCase().includes(searchQuery.toLowerCase())
        );
    };

    const getFilteredCompanies = () => {
        return companies.filter(c =>
            (c.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
            (c.email || '').toLowerCase().includes(searchQuery.toLowerCase())
        );
    };

    const StatCard = ({ title, value, icon: Icon, color, trend }) => (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between hover:shadow-xl hover:scale-[1.02] transition-all duration-300 group">
            <div>
                <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">{title}</p>
                <h3 className="text-3xl font-extrabold text-slate-800">{value}</h3>
                {trend && <p className="text-xs font-medium text-emerald-500 mt-2 flex items-center gap-1"><TrendingUp size={12} /> {trend}</p>}
            </div>
            <div className={`p-4 rounded-2xl ${color} shadow-lg group-hover:shadow-2xl transition-all duration-300 transform group-hover:-translate-y-1`}>
                <Icon size={24} className="text-white" />
            </div>
        </div>
    )

    const renderContent = () => {
        switch (activeTab) {
            case 'dashboard':
                return (
                    <div className="space-y-8 animate-fade-in">
                        <div className="flex justify-between items-end">
                            <div>
                                <h2 className="text-3xl font-extrabold text-slate-800 tracking-tight">Dashboard Overview</h2>
                                <p className="text-slate-500 mt-1">Real-time platform insights and activity tracking.</p>
                            </div>
                            <div className="text-sm font-medium text-slate-400 bg-white px-4 py-2 rounded-xl shadow-sm border border-slate-100 flex items-center gap-2">
                                <Calendar size={16} /> {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <StatCard title="Total Students" value={students.length} icon={Users} color="bg-gradient-to-br from-blue-500 to-indigo-600" trend="+12% this week" />
                            <StatCard title="Companies" value={companies.length} icon={MapPin} color="bg-gradient-to-br from-orange-400 to-red-500" trend="+5% this month" />
                            <StatCard title="Active Jobs" value={announcementsCount} icon={Megaphone} color="bg-gradient-to-br from-purple-500 to-pink-600" trend="New postings" />
                            <StatCard title="Pending Review" value="0" icon={Bell} color="bg-gradient-to-br from-emerald-400 to-teal-500" trend="All caught up" />
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8 hover:shadow-md transition-shadow">
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="font-bold text-lg text-slate-800 flex items-center gap-2"><div className="w-2 h-6 bg-blue-500 rounded-full"></div> Recent Registrations</h3>
                                    <button onClick={() => setActiveTab('students')} className="text-blue-600 text-sm font-bold hover:bg-blue-50 px-3 py-1 rounded-lg transition-colors">View All</button>
                                </div>
                                <div className="space-y-4">
                                    {students.slice(0, 5).map(student => (
                                        <div key={student._id} className="flex items-center gap-4 p-4 hover:bg-slate-50 rounded-2xl transition-all border border-transparent hover:border-slate-100 group">
                                            <div className="w-12 h-12 bg-gradient-to-br from-slate-100 to-slate-200 rounded-full flex items-center justify-center text-slate-600 font-bold text-lg group-hover:scale-110 transition-transform">
                                                {student.username?.charAt(0).toUpperCase()}
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex justify-between items-start">
                                                    <div>
                                                        <p className="font-bold text-slate-800">{student.name || student.username}</p>
                                                        <p className="text-xs text-slate-500 font-medium">{student.department || 'General'} Student</p>
                                                    </div>
                                                    <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-600 px-2 py-1 rounded-md">New</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                    {students.length === 0 && <p className="text-slate-400 text-sm text-center py-8 bg-slate-50 rounded-2xl border border-dashed border-slate-200">No recent activity found.</p>}
                                </div>
                            </div>

                            <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl shadow-xl p-8 text-white relative overflow-hidden flex flex-col justify-center items-center text-center">
                                {/* Decorative elements */}
                                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl -mr-16 -mt-16"></div>
                                <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl -ml-16 -mb-16"></div>

                                <div className="relative z-10 p-6 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 w-full max-w-sm">
                                    <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full mx-auto mb-6 flex items-center justify-center shadow-lg shadow-indigo-500/30">
                                        <Users size={36} className="text-white" />
                                    </div>
                                    <h3 className="text-2xl font-bold mb-2">Platform Activity</h3>
                                    <p className="text-slate-300 text-sm mb-8 leading-relaxed">System metrics are looking good. You have healthy engagement across both student and recruiter pools.</p>

                                    <div className="flex gap-6 justify-center">
                                        <div className="text-center">
                                            <p className="text-3xl font-extrabold">{students.length}</p>
                                            <p className="text-xs text-slate-400 uppercase tracking-widest mt-1">Users</p>
                                        </div>
                                        <div className="h-12 w-px bg-white/10"></div>
                                        <div className="text-center">
                                            <p className="text-3xl font-extrabold">{companies.length}</p>
                                            <p className="text-xs text-slate-400 uppercase tracking-widest mt-1">Recruiters</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            case 'students':
                const filteredStudents = students;
                return (
                    <div className="space-y-6 animate-fade-in relative z-0">
                        {editingStudent && createPortal(
                            <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 sm:p-6 text-left">
                                <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200" onClick={() => setEditingStudent(null)}></div>
                                <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg flex flex-col relative z-20 animate-in zoom-in-95 duration-200 overflow-hidden">
                                    <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-white z-20">
                                        <div>
                                            <h3 className="text-xl font-extrabold text-slate-800">Edit Student Profile</h3>
                                            <p className="text-sm text-slate-500">Update account details</p>
                                        </div>
                                        <button onClick={() => setEditingStudent(null)} className="p-2 hover:bg-slate-100 rounded-full transition-colors border border-slate-200 text-slate-500 hover:text-red-500">
                                            <X size={20} />
                                        </button>
                                    </div>

                                    <form onSubmit={handleUpdateStudent} className="p-8 space-y-5 overflow-y-auto max-h-[80vh] scrollbar-hide">
                                        <div>
                                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 ml-1">Full Name</label>
                                            <div className="relative group">
                                                <User className="absolute left-4 top-3.5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={18} />
                                                <input
                                                    type="text"
                                                    value={editForm.name}
                                                    onChange={e => setEditForm({ ...editForm, name: e.target.value })}
                                                    className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none transition-all font-bold text-slate-700"
                                                    placeholder="Student Name"
                                                />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                            <div>
                                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 ml-1">Phone Number</label>
                                                <div className="relative group">
                                                    <Phone className="absolute left-4 top-3.5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={18} />
                                                    <input
                                                        type="text"
                                                        value={editForm.phone}
                                                        onChange={e => setEditForm({ ...editForm, phone: e.target.value })}
                                                        className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none transition-all font-medium text-slate-700"
                                                        placeholder="Phone"
                                                    />
                                                </div>
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 ml-1">Gender</label>
                                                <select
                                                    value={editForm.gender}
                                                    onChange={e => setEditForm({ ...editForm, gender: e.target.value })}
                                                    className="w-full data-[placeholder]:text-slate-400 py-3 px-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none transition-all font-medium text-slate-700 appearance-none"
                                                >
                                                    <option value="">Select Gender</option>
                                                    <option value="Male">Male</option>
                                                    <option value="Female">Female</option>
                                                    <option value="Other">Other</option>
                                                </select>
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 ml-1">Department</label>
                                            <div className="relative group">
                                                <div className="absolute left-4 top-3.5 text-slate-400 group-focus-within:text-indigo-500 transition-colors pointer-events-none">
                                                    <Award size={18} />
                                                </div>
                                                <select
                                                    value={editForm.department}
                                                    onChange={e => setEditForm({ ...editForm, department: e.target.value })}
                                                    className="w-full pl-11 pr-8 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none transition-all font-medium text-slate-700 appearance-none cursor-pointer"
                                                >
                                                    <option value="">Select Department</option>
                                                    <option value="CSE">CSE</option>
                                                    <option value="ECE">ECE</option>
                                                    <option value="ME">ME</option>
                                                    <option value="CE">CE</option>
                                                    <option value="IT">IT</option>
                                                </select>
                                                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-400">
                                                    <ChevronLeft className="-rotate-90" size={14} />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="pt-6 flex gap-3">
                                            <button type="button" onClick={() => setEditingStudent(null)} className="w-1/3 py-3.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 font-bold rounded-xl transition-colors">
                                                Cancel
                                            </button>
                                            <button type="submit" className="w-2/3 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-indigo-500/20 transform active:scale-[0.98]">
                                                Save Changes
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>, document.body
                        )}

                        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden animate-fade-in">
                            <div className="p-8 border-b border-slate-100 flex flex-col md:flex-row justify-between items-center gap-6 bg-white">
                                <div>
                                    <h2 className="text-3xl font-extrabold text-slate-800 tracking-tight">Student Directory</h2>
                                    <p className="text-slate-500 mt-2 font-medium flex items-center gap-2">
                                        <span className="bg-indigo-50 text-indigo-700 px-2.5 py-0.5 rounded-full text-xs font-bold border border-indigo-100">{filteredStudents.length} Students</span>
                                        <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                                        Manage account details and permissions
                                    </p>
                                </div>
                                <div className="flex gap-4 w-full md:w-auto">
                                    <div className="relative group w-full md:w-64">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <Search className="text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={20} />
                                        </div>
                                        <input
                                            type="text"
                                            placeholder="Search students..."
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border-none ring-1 ring-slate-200 rounded-2xl text-sm font-medium focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all outline-none placeholder:text-slate-400"
                                        />
                                    </div>
                                    <div className="relative w-48">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <Filter className="text-slate-400" size={18} />
                                        </div>
                                        <select
                                            value={selectedDepartment}
                                            onChange={(e) => { setSelectedDepartment(e.target.value); setStudentPage(1); }}
                                            className="w-full pl-11 pr-8 py-3.5 bg-slate-50 border-none ring-1 ring-slate-200 rounded-2xl text-sm font-bold text-slate-600 focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all outline-none appearance-none cursor-pointer hover:bg-slate-100"
                                        >
                                            <option value="All">All Departments</option>
                                            <option value="CSE">CSE</option>
                                            <option value="ECE">ECE</option>
                                            <option value="ME">ME</option>
                                            <option value="CE">CE</option>
                                            <option value="IT">IT</option>
                                        </select>
                                        <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-slate-400">
                                            <ChevronLeft className="-rotate-90" size={16} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead className="bg-slate-50/50 border-b border-slate-100">
                                        <tr>
                                            <th className="px-8 py-5 font-bold text-slate-400 text-[11px] uppercase tracking-wider">Student Profile</th>
                                            <th className="px-8 py-5 font-bold text-slate-400 text-[11px] uppercase tracking-wider">Contact Details</th>
                                            <th className="px-8 py-5 font-bold text-slate-400 text-[11px] uppercase tracking-wider">Department & Status</th>
                                            <th className="px-8 py-5 font-bold text-slate-400 text-[11px] uppercase tracking-wider text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-50">
                                        {loading ? (
                                            <tr><td colSpan="4" className="p-12 text-center text-slate-400 animate-pulse font-medium">Loading student data...</td></tr>
                                        ) : filteredStudents.length > 0 ? (
                                            filteredStudents.map(student => (
                                                <tr key={student._id} className="hover:bg-slate-50/80 transition-colors group">
                                                    <td className="px-8 py-5">
                                                        <div className="flex items-center gap-4">
                                                            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-500 p-0.5 shadow-sm group-hover:shadow-md transition-all">
                                                                <div className="w-full h-full bg-white rounded-[14px] flex items-center justify-center text-indigo-600 font-black text-lg">
                                                                    {student.username?.charAt(0).toUpperCase()}
                                                                </div>
                                                            </div>
                                                            <div>
                                                                <p className="font-bold text-slate-800 text-base">{student.name || 'Unknown Student'}</p>
                                                                <p className="text-xs font-semibold text-slate-400 tracking-wide uppercase">@{student.username}</p>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-8 py-5">
                                                        <div className="flex flex-col gap-2">
                                                            <div className="flex items-center gap-2 text-sm text-slate-600 font-medium group-hover:text-indigo-600 transition-colors">
                                                                <Mail size={15} className="text-slate-300 group-hover:text-indigo-400" />
                                                                {student.email}
                                                            </div>
                                                            {student.phone && (
                                                                <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                                                                    <Phone size={13} className="text-slate-300" />
                                                                    {student.phone}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td className="px-8 py-5">
                                                        <div className="flex flex-col items-start gap-1.5">
                                                            {student.department ? (
                                                                <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold bg-slate-100 text-slate-600 border border-slate-200">
                                                                    {student.department}
                                                                </span>
                                                            ) : (
                                                                <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold bg-slate-50 text-slate-400 border border-slate-100 italic">
                                                                    No Dept
                                                                </span>
                                                            )}

                                                            {/* Status Chip */}
                                                            {(student.quizAttempts?.length > 0 || student.dsaAttempts?.length > 0) ? (
                                                                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-emerald-50 text-emerald-600 border border-emerald-100">
                                                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Active
                                                                </span>
                                                            ) : (
                                                                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-blue-50 text-blue-600 border border-blue-100">
                                                                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></span> New
                                                                </span>
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td className="px-8 py-5 text-right">
                                                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all translate-x-2 group-hover:translate-x-0">
                                                            <div className="relative group/btn">
                                                                <button
                                                                    onClick={() => handleEditStudent(student)}
                                                                    className="p-2.5 bg-white border border-slate-200 text-slate-400 hover:text-indigo-600 hover:border-indigo-200 hover:bg-indigo-50 rounded-xl transition-all shadow-sm"
                                                                >
                                                                    <Edit size={16} />
                                                                </button>
                                                                <span className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 px-2 py-1 bg-slate-800 text-white text-[10px] font-bold rounded shadow-lg opacity-0 group-hover/btn:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                                                                    Edit Profile
                                                                </span>
                                                            </div>

                                                            <div className="relative group/btn">
                                                                <button
                                                                    onClick={() => handleDeleteStudent(student._id)}
                                                                    className="p-2.5 bg-white border border-slate-200 text-slate-400 hover:text-red-600 hover:border-red-200 hover:bg-red-50 rounded-xl transition-all shadow-sm"
                                                                >
                                                                    <Trash2 size={16} />
                                                                </button>
                                                                <span className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 px-2 py-1 bg-slate-800 text-white text-[10px] font-bold rounded shadow-lg opacity-0 group-hover/btn:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                                                                    Delete User
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="4">
                                                    <div className="flex flex-col items-center justify-center py-20 text-slate-400">
                                                        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                                                            <Search size={24} className="text-slate-300" />
                                                        </div>
                                                        <p className="font-medium">No students match your search.</p>
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div >
                        <Pagination currentPage={studentPage} totalPages={studentTotalPages} onPageChange={setStudentPage} />
                    </div >
                );
            case 'companies':
                const filteredCompanies = companies; // Use companies directly
                return (
                    <div className="space-y-6 animate-fade-in">
                        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
                            <div className="p-8 border-b border-slate-100 flex flex-col md:flex-row justify-between items-center gap-6 bg-gradient-to-r from-white to-slate-50/30">
                                <div>
                                    <h2 className="text-2xl font-extrabold text-slate-800">Manage Companies</h2>
                                    <p className="text-sm text-slate-500 mt-1">Oversee registered recruiters and partners.</p>
                                </div>
                                <div className="relative group">
                                    <Search className="absolute left-4 top-3.5 text-slate-400 group-focus-within:text-orange-500 transition-colors" size={20} />
                                    <input
                                        type="text"
                                        placeholder="Search companies..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="pl-12 pr-6 py-3 border border-slate-200 rounded-2xl text-sm focus:ring-4 focus:ring-orange-100 focus:border-orange-500 outline-none w-72 md:w-96 transition-all shadow-sm bg-slate-50 focus:bg-white"
                                    />
                                </div>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead className="bg-slate-50/80 border-b border-slate-200">
                                        <tr>
                                            <th className="p-5 font-bold text-slate-500 text-xs uppercase tracking-wider">Company</th>
                                            <th className="p-5 font-bold text-slate-500 text-xs uppercase tracking-wider">Contact</th>
                                            <th className="p-5 font-bold text-slate-500 text-xs uppercase tracking-wider">Location</th>
                                            <th className="p-5 font-bold text-slate-500 text-xs uppercase tracking-wider text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {filteredCompanies.length > 0 ? (
                                            filteredCompanies.map(company => (
                                                <tr key={company._id} className="hover:bg-orange-50/30 transition-colors group">
                                                    <td className="p-5 font-medium text-slate-900 flex items-center gap-4">
                                                        <div className="w-10 h-10 bg-gradient-to-br from-orange-100 to-amber-100 text-orange-700 rounded-xl flex items-center justify-center font-bold shadow-sm">
                                                            {company.name?.charAt(0).toUpperCase()}
                                                        </div>
                                                        <span className="font-bold group-hover:text-orange-700 transition-colors">{company.name}</span>
                                                    </td>
                                                    <td className="p-5">
                                                        <div className="flex items-center gap-2 text-sm text-slate-600"><Mail size={14} className="text-slate-400" /> {company.email}</div>
                                                    </td>
                                                    <td className="p-5 text-slate-600 text-sm flex items-center gap-2">
                                                        <MapPin size={14} className="text-slate-400" />
                                                        {company.company_add || 'Remote/N/A'}
                                                    </td>
                                                    <td className="p-5 text-right">
                                                        <button
                                                            onClick={() => handleDeleteCompany(company._id)}
                                                            className="p-2.5 bg-white border border-slate-200 text-slate-400 hover:text-red-600 hover:border-red-200 hover:bg-red-50 rounded-xl transition-all shadow-sm opacity-0 group-hover:opacity-100"
                                                            title="Delete Company"
                                                        >
                                                            <Trash2 size={16} />
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr><td colSpan="4" className="p-12 text-center text-slate-400 italic bg-slate-50/30">No companies found.</td></tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <Pagination currentPage={companyPage} totalPages={companyTotalPages} onPageChange={setCompanyPage} />
                    </div>
                );
            case 'content':
                return (
                    <div className="space-y-6 animate-fade-in">
                        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-8">
                            <div className="max-w-4xl mx-auto">
                                <div className="mb-8 text-center">
                                    <div className="w-16 h-16 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                        <Settings size={32} />
                                    </div>
                                    <h2 className="text-3xl font-extrabold text-slate-800">Content Management</h2>
                                    <p className="text-slate-500 mt-2">Create and manage assessment questions and coding problems.</p>
                                </div>

                                <div className="bg-slate-50 p-1.5 rounded-2xl flex gap-2 max-w-md mx-auto mb-8 border border-slate-200">
                                    <button onClick={() => { setContentType('quiz'); setContentPage(1); }} className={`flex-1 py-2.5 rounded-xl font-bold text-sm transition-all shadow-sm flex items-center justify-center gap-2 ${contentType === 'quiz' ? 'bg-white text-indigo-600 shadow-md ring-1 ring-slate-100' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-100 shadow-none'}`}>
                                        <Award size={16} /> Quiz Question
                                    </button>
                                    <button onClick={() => { setContentType('dsa'); setContentPage(1); }} className={`flex-1 py-2.5 rounded-xl font-bold text-sm transition-all shadow-sm flex items-center justify-center gap-2 ${contentType === 'dsa' ? 'bg-white text-indigo-600 shadow-md ring-1 ring-slate-100' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-100 shadow-none'}`}>
                                        <TrendingUp size={16} /> DSA Problem
                                    </button>
                                </div>

                                {/* Add Content Button */}
                                <div className="mb-8 flex justify-end">
                                    <button
                                        onClick={() => setIsModalOpen(true)}
                                        className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold py-3 px-6 rounded-xl shadow-lg shadow-indigo-500/30 flex items-center gap-2 transition-all transform hover:scale-105"
                                    >
                                        <div className="bg-white/20 p-1 rounded-lg">
                                            {contentType === 'quiz' ? <Award size={20} /> : <TrendingUp size={20} />}
                                        </div>
                                        Add New {contentType === 'quiz' ? 'Quiz Question' : 'DSA Problem'}
                                    </button>
                                </div>

                                {/* Modal for Adding Content */}
                                {isModalOpen && createPortal(
                                    <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 sm:p-6 text-left font-sans">
                                        <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
                                        <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl flex flex-col max-h-[85vh] relative z-20 my-auto animate-in zoom-in-95 duration-200">
                                            {/* Fixed Header */}
                                            <div className="px-8 py-8 border-b border-slate-200 flex justify-between items-start bg-white rounded-t-3xl flex-none shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05)] z-30">
                                                <div>
                                                    <h3 className="text-2xl font-extrabold text-slate-800 leading-tight">Add New <span className="text-indigo-600">{contentType === 'quiz' ? 'Quiz Question' : 'DSA Problem'}</span></h3>
                                                    <p className="text-slate-500 mt-1">Fill in the details below to add content to the database.</p>
                                                </div>
                                                <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors border border-slate-200 text-slate-500 hover:text-red-500">
                                                    <X size={24} />
                                                </button>
                                            </div>

                                            {/* Scrollable Content */}
                                            <div className="p-8 overflow-y-auto scrollbar-hide flex-1">
                                                <form id="contentForm" onSubmit={(e) => { handleContentSubmit(e); setIsModalOpen(false); }} className="space-y-6">
                                                    {contentType === 'quiz' ? (
                                                        <>
                                                            <div>
                                                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Question Text</label>
                                                                <textarea placeholder="e.g. What is the complexity of binary search?" className="w-full p-4 bg-slate-50 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-indigo-500 font-medium text-slate-800 transition-all focus:bg-white" value={questionData.question_text} onChange={e => setQuestionData({ ...questionData, question_text: e.target.value })} required rows={3} />
                                                            </div>
                                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                                                {['1', '2', '3', '4'].map((num, idx) => (
                                                                    <div key={num}>
                                                                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Option {String.fromCharCode(65 + idx)}</label>
                                                                        <input type="text" placeholder={`Option ${String.fromCharCode(65 + idx)}`} className="w-full p-3.5 bg-slate-50 rounded-xl border border-slate-200 focus:bg-white transition-all outline-none focus:ring-2 focus:ring-indigo-500" value={questionData[`option${num}`]} onChange={e => setQuestionData({ ...questionData, [`option${num}`]: e.target.value })} required />
                                                                    </div>
                                                                ))}
                                                            </div>
                                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                                                <div>
                                                                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Correct Answer</label>
                                                                    <select className="w-full p-3.5 bg-slate-50 rounded-xl border border-slate-200 outline-none font-medium focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all" value={questionData.correct_answer} onChange={e => setQuestionData({ ...questionData, correct_answer: e.target.value })} required>
                                                                        <option value="">Select Correct Option</option>
                                                                        <option value={questionData.option1}>{questionData.option1 || 'Option A'}</option>
                                                                        <option value={questionData.option2}>{questionData.option2 || 'Option B'}</option>
                                                                        <option value={questionData.option3}>{questionData.option3 || 'Option C'}</option>
                                                                        <option value={questionData.option4}>{questionData.option4 || 'Option D'}</option>
                                                                    </select>
                                                                </div>
                                                                <div>
                                                                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Category</label>
                                                                    <select className="w-full p-3.5 bg-slate-50 rounded-xl border border-slate-200 outline-none font-medium focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all" value={questionData.category} onChange={e => setQuestionData({ ...questionData, category: e.target.value })}>
                                                                        <option value="Technical">Technical</option>
                                                                        <option value="Aptitude">Aptitude</option>
                                                                        <option value="General">General</option>
                                                                    </select>
                                                                </div>
                                                            </div>
                                                            <div>
                                                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Explanation (Optional)</label>
                                                                <textarea placeholder="Explain why this is the correct answer..." className="w-full p-4 bg-slate-50 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all" value={questionData.explanation} onChange={e => setQuestionData({ ...questionData, explanation: e.target.value })} rows={2} />
                                                            </div>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <div>
                                                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Problem Title</label>
                                                                <input type="text" placeholder="e.g. Reverse a Linked List" className="w-full p-4 bg-slate-50 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-indigo-500 font-bold text-lg focus:bg-white transition-all" value={questionData.title} onChange={e => setQuestionData({ ...questionData, title: e.target.value })} required />
                                                            </div>
                                                            <div className="flex flex-col md:flex-row gap-5">
                                                                <div className="w-full md:w-1/3">
                                                                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Difficulty</label>
                                                                    <select className="w-full p-3.5 bg-slate-50 rounded-xl border border-slate-200 outline-none font-medium focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all" value={questionData.difficulty} onChange={e => setQuestionData({ ...questionData, difficulty: e.target.value })}>
                                                                        <option value="Easy">Easy</option>
                                                                        <option value="Medium">Medium</option>
                                                                        <option value="Hard">Hard</option>
                                                                    </select>
                                                                </div>
                                                                <div className="w-full md:w-2/3">
                                                                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Topics (Tags)</label>
                                                                    <input type="text" placeholder="Arrays, DP, Graphs..." className="w-full p-3.5 bg-slate-50 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all" value={questionData.topics} onChange={e => setQuestionData({ ...questionData, topics: e.target.value })} />
                                                                </div>
                                                            </div>
                                                            <div>
                                                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Problem Description & Cases</label>
                                                                <textarea placeholder="Write the full problem statement here. supports HTML/Markdown..." className="w-full h-48 p-4 bg-slate-900 text-slate-200 rounded-xl border border-slate-200 outline-none font-mono text-sm leading-relaxed focus:ring-2 focus:ring-indigo-500 transition-all" value={questionData.Body} onChange={e => setQuestionData({ ...questionData, Body: e.target.value })} required />
                                                            </div>
                                                        </>
                                                    )}
                                                </form>
                                            </div>

                                            {/* Fixed Footer */}
                                            <div className="px-8 py-5 border-t border-slate-200 flex gap-4 bg-white rounded-b-3xl flex-none z-20 relative shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
                                                <button type="button" onClick={() => setIsModalOpen(false)} className="w-1/3 py-3.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold rounded-xl transition-colors">
                                                    Cancel
                                                </button>
                                                <button type="submit" form="contentForm" className="w-2/3 py-3.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-indigo-500/30 transform active:scale-[0.98]">
                                                    Publish Content
                                                </button>
                                            </div>
                                        </div>
                                    </div>, document.body
                                )}

                                {/* Manage Content Section */}
                                <div className="mt-8 bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">
                                    <h3 className="text-xl font-bold text-slate-800 mb-4">Manage Existing Content</h3>
                                    <div className="flex gap-4 mb-6">
                                        <div className="flex-1 relative">
                                            <Search className="absolute left-4 top-3.5 text-slate-400" size={20} />
                                            <input
                                                type="text"
                                                placeholder={contentType === 'quiz' ? "Search by text..." : "Search by Question ID (Exact Match)"}
                                                className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-slate-300"
                                                value={contentSearch}
                                                onChange={e => setContentSearch(e.target.value)}
                                            />
                                        </div>
                                        <button
                                            onClick={handleSearchContent}
                                            disabled={isSearchingContent}
                                            className="px-6 py-3 bg-slate-800 text-white font-bold rounded-xl hover:bg-slate-700 transition-colors disabled:opacity-50"
                                        >
                                            {isSearchingContent ? 'Searching...' : 'Search'}
                                        </button>
                                    </div>

                                    <div className="overflow-x-auto rounded-xl border border-slate-200">
                                        <table className="w-full text-left border-collapse">
                                            <thead className="bg-slate-50/80 border-b border-slate-200">
                                                <tr>
                                                    <th className="p-4 font-bold text-slate-500 text-xs uppercase tracking-wider w-1/2">Question / Problem</th>
                                                    <th className="p-4 font-bold text-slate-500 text-xs uppercase tracking-wider">Type / ID</th>
                                                    <th className="p-4 font-bold text-slate-500 text-xs uppercase tracking-wider">Category</th>
                                                    <th className="p-4 font-bold text-slate-500 text-xs uppercase tracking-wider text-right">Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-100 bg-white">
                                                {contentList.length > 0 ? (
                                                    contentList.map((item, idx) => (
                                                        <tr key={idx} className="hover:bg-slate-50 transition-colors group">
                                                            <td className="p-4">
                                                                <p className="font-bold text-slate-800 line-clamp-2" title={item.question_text || item.title}>{item.question_text || item.title}</p>
                                                            </td>
                                                            <td className="p-4 text-sm text-slate-500 font-mono">
                                                                {item._id || item.QID}
                                                            </td>
                                                            <td className="p-4">
                                                                <span className={`px-2 py-1 rounded-md text-xs font-bold ${contentType === 'quiz' ? 'bg-indigo-50 text-indigo-600' : 'bg-orange-50 text-orange-600'}`}>
                                                                    {item.category || item.difficulty}
                                                                </span>
                                                            </td>
                                                            <td className="p-4 text-right">
                                                                <button
                                                                    onClick={() => handleDeleteContent(item._id || item.QID)}
                                                                    className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                                    title="Delete"
                                                                >
                                                                    <Trash2 size={18} />
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    ))
                                                ) : (
                                                    <tr><td colSpan="4" className="p-8 text-center text-slate-400">No content found.</td></tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                    <Pagination currentPage={contentPage} totalPages={contentTotalPages} onPageChange={setContentPage} />
                                </div>
                            </div>
                        </div>
                    </div>
                );
            case 'announcements':
                return (
                    <div className="space-y-6 animate-fade-in">
                        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden min-h-[500px]">
                            <div className="p-8">
                                <div className="flex justify-between items-center mb-6">
                                    <div>
                                        <h2 className="text-2xl font-bold text-slate-800">
                                            {announcementView === 'active' ? 'Active Announcements' : 'Drive History'}
                                        </h2>
                                        <p className="text-slate-500 text-sm mt-1">Manage campus drives and general updates.</p>
                                    </div>
                                    <div className="flex bg-slate-100 p-1 rounded-xl">
                                        <button
                                            onClick={() => setAnnouncementView('active')}
                                            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${announcementView === 'active' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                                        >
                                            Active
                                        </button>
                                        <button
                                            onClick={() => setAnnouncementView('history')}
                                            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${announcementView === 'history' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                                        >
                                            History
                                        </button>
                                    </div>
                                </div>
                                <AnnouncementList role="admin" searchQuery={searchQuery} statusFilter={announcementView} />
                            </div>
                        </div>
                    </div>
                );
            default:
                return <div>Select a tab</div>;
        }
    };

    return (
        <div className="flex h-screen bg-slate-50/[0.97] font-sans overflow-hidden">
            {/* Sidebar */}
            <aside className={`${sidebarOpen ? 'w-72' : 'w-24'} bg-[#0F172A] text-white transition-all duration-300 flex flex-col shadow-2xl z-20 relative`}>
                <div className="p-6 flex items-center justify-between h-20">
                    <div className={`font-black text-2xl bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 whitespace-nowrap overflow-hidden transition-all duration-300 ${!sidebarOpen && 'w-0 opacity-0'}`}>
                        CareerConnect
                    </div>
                    <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 rounded-xl hover:bg-white/10 text-slate-400 hover:text-white transition-colors">
                        {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
                    </button>
                </div>

                <nav className="flex-1 py-8 px-4 space-y-3 overflow-y-auto">
                    <NavItem
                        onClick={() => setActiveTab('dashboard')}
                        active={activeTab === 'dashboard'}
                        icon={LayoutDashboard}
                        label="Overview"
                        collapsed={!sidebarOpen}
                    />
                    <NavItem
                        onClick={() => setActiveTab('students')}
                        active={activeTab === 'students'}
                        icon={Users}
                        label="Students"
                        collapsed={!sidebarOpen}
                    />
                    <NavItem
                        onClick={() => setActiveTab('companies')}
                        active={activeTab === 'companies'}
                        icon={MapPin}
                        label="Companies"
                        collapsed={!sidebarOpen}
                    />
                    <div className="my-4 border-t border-white/10 mx-2"></div>
                    <NavItem
                        onClick={() => setActiveTab('content')}
                        active={activeTab === 'content'}
                        icon={Settings}
                        label="Content"
                        collapsed={!sidebarOpen}
                    />
                    <NavItem
                        onClick={() => setActiveTab('announcements')}
                        active={activeTab === 'announcements'}
                        icon={Megaphone}
                        label="Job Board"
                        collapsed={!sidebarOpen}
                    />
                </nav>

                <div className="p-4 mx-4 mb-4 bg-gradient-to-r from-indigo-900/50 to-blue-900/50 rounded-2xl border border-white/5 backdrop-blur-sm">
                    <Link to="/profile/admin" className={`flex items-center gap-3 p-2 rounded-xl transition-all duration-300 group ${!sidebarOpen && 'justify-center'}`}>
                        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 p-0.5">
                            <div className="w-full h-full rounded-full bg-[#0F172A] flex items-center justify-center">
                                <User size={18} className="text-white group-hover:text-indigo-400 transition-colors" />
                            </div>
                        </div>
                        <div className={`transition-all duration-300 overflow-hidden ${!sidebarOpen ? 'w-0 opacity-0 hidden' : 'w-auto'}`}>
                            <p className="text-sm font-bold text-white">Admin Account</p>
                            <p className="text-[10px] text-slate-400 uppercase tracking-wider">Super User</p>
                        </div>
                    </Link>
                </div>

                <div className="p-4 border-t border-white/5">
                    <button
                        onClick={handleLogout}
                        className={`flex items-center gap-3 w-full p-4 rounded-xl text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all group font-bold ${!sidebarOpen && 'justify-center'}`}
                        title="Logout"
                    >
                        <LogOut size={20} className="group-hover:-translate-x-1 transition-transform" />
                        <span className={`whitespace-nowrap transition-all duration-300 ${!sidebarOpen && 'w-0 opacity-0 hidden'}`}>Sign Out</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden bg-slate-50 relative">
                {/* Top Navigation Bar */}
                <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-200/60 flex items-center justify-between px-8 z-10 sticky top-0">
                    <div>
                        <h2 className="text-xl font-black text-slate-800 tracking-tight">Administrator Panel</h2>
                        <p className="text-xs text-slate-500 font-medium">Manage your campus placement ecosystem</p>
                    </div>
                    <div className="flex items-center gap-6">
                        <button className="relative p-2 text-slate-400 hover:text-indigo-600 transition-colors">
                            <Bell size={22} />
                            <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
                        </button>
                        <div className="h-8 w-px bg-slate-200"></div>
                        <div className="flex items-center gap-3">
                            <div className="text-right hidden md:block">
                                <p className="text-sm font-bold text-slate-800">Administrator</p>
                                <p className="text-xs text-slate-500">System Control</p>
                            </div>
                            <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-blue-600 text-white rounded-full flex items-center justify-center font-bold shadow-lg shadow-indigo-500/20">A</div>
                        </div>
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto p-6 lg:p-10 scrollbar-hide">
                    {renderContent()}
                </main>
            </div>
        </div>
    );
};

// Reused NavItem (Premium)
const NavItem = ({ onClick, icon: Icon, label, active, collapsed }) => {
    return (
        <button
            onClick={onClick}
            className={`
                w-full flex items-center gap-4 p-3.5 rounded-2xl transition-all duration-300 group relative overflow-hidden
                ${active
                    ? "bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-lg shadow-indigo-900/50"
                    : "text-slate-400 hover:bg-white/5 hover:text-white"
                }
                ${collapsed ? 'justify-center' : ''}
            `}
        >
            <div className={`relative z-10 ${collapsed ? '' : ''}`}>
                <Icon size={22} className={`${active ? 'text-white' : 'group-hover:text-indigo-400 transition-colors'}`} />
            </div>

            <span className={`font-bold tracking-wide text-sm whitespace-nowrap transition-all duration-300 relative z-10 ${collapsed && 'w-0 opacity-0 hidden'}`}>
                {label}
            </span>

            {/* Hover Glow Effect */}
            {!active && <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>}

            {/* Tooltip for collapsed state */}
            {collapsed && !active && (
                <div className="absolute left-16 bg-slate-800 text-white text-xs font-bold px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-all z-50 whitespace-nowrap shadow-xl border border-white/10 transform translate-x-2 group-hover:translate-x-0">
                    {label}
                </div>
            )}
        </button>
    );
}



export default AdminDashboard;
