import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Header from '../components/Header';
import AnnouncementList from '../components/AnnouncementList';
import StudentLayout from '../components/StudentLayout';
import {
    BookOpen,
    Code,
    Video,
    Briefcase,
    Bell,
    Search,
    FileText,
    MessageCircle
} from 'lucide-react';

const StudentDashboard = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (!storedUser) {
            navigate('/login/student');
        } else {
            setUser(JSON.parse(storedUser));
        }
    }, [navigate]);

    const [announcementView, setAnnouncementView] = useState('active');

    if (!user) return null;

    return (
        <StudentLayout>
            {/* Topbar inside Layout */}
            <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 sticky top-0 z-10 shadow-sm">
                <h2 className="text-xl font-bold text-gray-800">Student Dashboard</h2>
                <div className="flex items-center gap-6">
                    <div className="relative hidden md:block">
                        <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search resources..."
                            className="pl-10 pr-4 py-2 border border-gray-200 rounded-full text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none w-64 transition-all"
                        />
                    </div>
                    <button className="relative p-2 text-gray-400 hover:text-blue-600 transition-colors">
                        <Bell size={20} />
                        <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                    </button>
                    <div className="flex items-center gap-3 pl-6 border-l border-gray-100">
                        <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center text-white font-bold shadow-md overflow-hidden ring-2 ring-white">
                            {user.profilePicture ? (
                                <img src={user.profilePicture} alt="Profile" className="w-full h-full object-cover" />
                            ) : (
                                (user.name || user.username || 'U').charAt(0).toUpperCase()
                            )}
                        </div>
                        <div className="hidden md:block">
                            <p className="text-sm font-semibold text-gray-800 leading-tight">{user.name || user.username || 'Student'}</p>
                            {user._id && <p className="text-xs text-gray-500">Student ID: {user._id.substring(0, 6)}</p>}
                        </div>
                    </div>
                </div>
            </header>

            <div className="p-6 lg:p-8">
                {/* Welcome Section */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back, {user.name || user.username}! 👋</h1>
                    <p className="text-gray-600">Track your preparation, resume score, and latest placement updates.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Apps Grid */}
                    <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Aptitude Quiz - Internal React Route */}
                        <Link to="/test" className="block group">
                            <div className="h-full bg-white p-6 rounded-2xl shadow-sm border border-gray-100/50 hover:shadow-xl hover:border-blue-200 transition-all duration-300 relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110"></div>
                                <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mb-4 relative z-10 group-hover:scale-110 transition-transform duration-300">
                                    <BookOpen size={24} />
                                </div>
                                <h3 className="text-lg font-bold text-gray-800 mb-2 relative z-10">Aptitude Quiz</h3>
                                <p className="text-gray-500 text-sm relative z-10">Test your logic and reasoning skills with adaptive quizzes.</p>
                            </div>
                        </Link>
                        {/* DSA Practice */}
                        <Link to="/dsa" className="block group">
                            <div className="h-full bg-white p-6 rounded-2xl shadow-sm border border-gray-100/50 hover:shadow-xl hover:border-purple-200 transition-all duration-300 relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-24 h-24 bg-purple-50 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110"></div>
                                <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center mb-4 relative z-10 group-hover:scale-110 transition-transform duration-300">
                                    <Code size={24} />
                                </div>
                                <h3 className="text-lg font-bold text-gray-800 mb-2 relative z-10">DSA Practice</h3>
                                <p className="text-gray-500 text-sm relative z-10">Master data structures with curated coding problems.</p>
                            </div>
                        </Link>

                        {/* Mock Interviews */}
                        <Link to="/interview" className="block group">
                            <div className="h-full bg-white p-6 rounded-2xl shadow-sm border border-gray-100/50 hover:shadow-xl hover:border-emerald-200 transition-all duration-300 relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-50 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110"></div>
                                <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center mb-4 relative z-10 group-hover:scale-110 transition-transform duration-300">
                                    <Video size={24} />
                                </div>
                                <h3 className="text-lg font-bold text-gray-800 mb-2 relative z-10">Mock Interviews</h3>
                                <p className="text-gray-500 text-sm relative z-10">Practice with AI-driven interview simulations.</p>
                            </div>
                        </Link>

                        {/* Resume ATS */}
                        <Link to="/module/ats" className="block group">
                            <div className="h-full bg-white p-6 rounded-2xl shadow-sm border border-gray-100/50 hover:shadow-xl hover:border-yellow-200 transition-all duration-300 relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-24 h-24 bg-yellow-50 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110"></div>
                                <div className="w-12 h-12 bg-yellow-100 text-yellow-600 rounded-xl flex items-center justify-center mb-4 relative z-10 group-hover:scale-110 transition-transform duration-300">
                                    <Briefcase size={24} />
                                </div>
                                <h3 className="text-lg font-bold text-gray-800 mb-2 relative z-10">Resume ATS</h3>
                                <p className="text-gray-500 text-sm relative z-10">Analyze your resume against job descriptions.</p>
                            </div>
                        </Link>

                        {/* English AI Coach (NEW) */}
                        <Link to="/communication" className="block group">
                            <div className="h-full bg-white p-6 rounded-2xl shadow-sm border border-gray-100/50 hover:shadow-xl hover:border-indigo-200 transition-all duration-300 relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-50 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110"></div>
                                <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center mb-4 relative z-10 group-hover:scale-110 transition-transform duration-300">
                                    <MessageCircle size={24} />
                                </div>
                                <h3 className="text-lg font-bold text-gray-800 mb-2 relative z-10">English AI Coach</h3>
                                <p className="text-gray-500 text-sm relative z-10">Improve proficiency with AI Voice, Chat & Mock scenarios.</p>
                            </div>
                        </Link>


                        {/* Internal Resume Builder Link */}
                        <Link to="/resume" className="block group">
                            <div className="h-full bg-white p-6 rounded-2xl shadow-sm border border-gray-100/50 hover:shadow-xl hover:border-pink-200 transition-all duration-300 relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-24 h-24 bg-pink-50 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110"></div>
                                <div className="w-12 h-12 bg-pink-100 text-pink-600 rounded-xl flex items-center justify-center mb-4 relative z-10 group-hover:scale-110 transition-transform duration-300">
                                    <FileText size={24} />
                                </div>
                                <h3 className="text-lg font-bold text-gray-800 mb-2 relative z-10">Resume Builder</h3>
                                <p className="text-gray-500 text-sm relative z-10">Create a professional, ATS-friendly resume in minutes.</p>
                            </div>
                        </Link>
                    </div>

                    {/* Recent Announcements - Right Column */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 w-full h-[720px] flex flex-col overflow-hidden sticky top-24">
                            <div className="p-5 border-b border-gray-100 flex flex-col gap-3 shrink-0 bg-white z-10">
                                <div className="flex items-center justify-between">
                                    <h3 className="font-bold text-gray-800 flex items-center gap-2">
                                        <Bell size={18} className="text-blue-500" /> Updates
                                    </h3>
                                    <div className="flex items-center gap-2">
                                        <div className="flex bg-slate-100 p-0.5 rounded-lg">
                                            <button
                                                onClick={() => setAnnouncementView('active')}
                                                className={`px-3 py-1 rounded-md text-[10px] font-bold transition-all ${announcementView === 'active' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                                            >
                                                Active
                                            </button>
                                            <button
                                                onClick={() => setAnnouncementView('history')}
                                                className={`px-3 py-1 rounded-md text-[10px] font-bold transition-all ${announcementView === 'history' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                                            >
                                                History
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="flex-1 overflow-y-auto p-2 bg-gray-50/30 font-sans [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
                                <AnnouncementList role="student" statusFilter={announcementView} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </StudentLayout>
    );
};

export default StudentDashboard;
