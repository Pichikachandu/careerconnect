import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import StudentLayout from '../../components/StudentLayout';
import { BookOpen, Code, Clock, Shield, Play, Brain, Monitor, Target, Zap, ChevronRight, Star, Activity, Trophy, BarChart3, Users } from 'lucide-react';

const TestSelection = () => {
    const navigate = useNavigate();
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [username, setUsername] = useState('');
    const [loading, setLoading] = useState(false);

    // Stats State - Dynamic Data
    const [stats, setStats] = useState({ topScore: 0, totalTests: 0, activeUsers: 0 });

    useEffect(() => {
        // Auto-load user
        const storedUser = JSON.parse(localStorage.getItem('user'));
        if (storedUser) {
            // Prefer Name for display, fallback to username
            setUsername(storedUser.name || storedUser.username);
            fetchStats(storedUser.username);
        } else {
            // Fallback general stats if not logged in (though protected route prevents this mostly)
            setStats({ topScore: 0, totalTests: 0, activeUsers: 1205 });
        }
    }, []);

    const fetchStats = async (username) => {
        try {
            const res = await axios.get(`http://localhost:3000/api/quiz/stats/${username}`);
            setStats(res.data);
        } catch (error) {
            console.error("Failed to fetch quiz stats", error);
            // Fallback stats on error
            setStats(prev => ({ ...prev, activeUsers: 1205 }));
        }
    };

    const handleStart = () => {
        if (!username || !selectedCategory) return;

        // Get the actual authenticated username for the backend key
        const stored = JSON.parse(localStorage.getItem('user'));
        const backendUsername = stored ? stored.username : username;

        setLoading(true);
        setTimeout(() => {
            navigate('/quiz/active', {
                state: {
                    username: backendUsername, // Use distinct backend ID
                    name: username, // Pass display name for UI if needed
                    category: selectedCategory,
                    mode: 'quick'
                }
            });
        }, 800);
    };

    return (
        <StudentLayout>
            <div className="font-sans text-slate-900 h-full bg-slate-50 pb-10">
                <div className="container mx-auto px-4 py-8 max-w-6xl">

                    {/* Hero Section - Matching DSA Style */}
                    <div className="bg-gradient-to-r from-indigo-600 to-violet-800 rounded-3xl p-8 mb-10 text-white shadow-xl relative overflow-hidden">
                        <div className="relative z-10">
                            <div className="flex items-center gap-2 mb-2 text-indigo-200 font-bold text-xs uppercase tracking-wider">
                                <Zap size={14} className="text-yellow-400" /> Skill Assessment Center
                            </div>
                            <h1 className="text-3xl font-bold mb-3">Prove Your Potential</h1>
                            <p className="text-indigo-100 max-w-xl text-lg leading-relaxed">
                                Take our adaptive assessment tests to showcase your capabilities to top recruiters. Select a domain and start your verification journey.
                            </p>
                        </div>
                        <div className="absolute right-0 bottom-0 opacity-10 transform translate-x-10 translate-y-10">
                            <Target size={200} />
                        </div>
                    </div>

                    {/* Quick Stats / Info Row (Dynamic Data) */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex items-center gap-4">
                            <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                                <Trophy size={24} />
                            </div>
                            <div>
                                <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Top Score</p>
                                <p className="text-2xl font-black text-slate-800">{stats.topScore}%</p>
                            </div>
                        </div>
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex items-center gap-4">
                            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
                                <Activity size={24} />
                            </div>
                            <div>
                                <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Tests Taken</p>
                                <p className="text-2xl font-black text-slate-800">{stats.totalTests}</p>
                            </div>
                        </div>
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex items-center gap-4">
                            <div className="p-3 bg-purple-50 text-purple-600 rounded-xl">
                                <BarChart3 size={24} />
                            </div>
                            <div>
                                <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Avg. Score</p>
                                <p className="text-2xl font-black text-slate-800">{stats.averageScore || 0}%</p>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                        {/* Left Column: Assessment Tracks (8 cols) */}
                        <div className="lg:col-span-8 space-y-6">
                            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                                <BookOpen size={20} className="text-indigo-600" /> Available Tracks
                            </h2>

                            {/* Technical Track Card */}
                            <div
                                onClick={() => setSelectedCategory('Technical')}
                                className={`group bg-white p-6 rounded-2xl shadow-sm border cursor-pointer transition-all duration-200 relative overflow-hidden
                                ${selectedCategory === 'Technical'
                                        ? 'border-indigo-500 ring-1 ring-indigo-500/20'
                                        : 'border-slate-200 hover:border-indigo-300 hover:shadow-md'}`}
                            >
                                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                                    <Code size={100} />
                                </div>
                                <div className="flex items-start gap-5 relative z-10">
                                    <div className={`w-14 h-14 rounded-xl flex items-center justify-center shrink-0 transition-colors
                                        ${selectedCategory === 'Technical' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' : 'bg-indigo-50 text-indigo-600'}`}>
                                        <Code size={28} />
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex justify-between items-start">
                                            <h3 className="text-lg font-bold text-slate-900 mb-1">Technical Assessment</h3>
                                            {selectedCategory === 'Technical' && <CheckCircleIcon />}
                                        </div>
                                        <p className="text-slate-500 text-sm leading-relaxed mb-4 max-w-lg">
                                            Evaluate your core coding proficiency. Covers C, C++, Java concepts, and Data Structures & Algorithms.
                                        </p>
                                        <div className="flex gap-2">
                                            <span className="px-2.5 py-1 bg-slate-100 text-slate-600 text-[10px] font-bold uppercase tracking-wider rounded-md">30 Mins</span>
                                            <span className="px-2.5 py-1 bg-slate-100 text-slate-600 text-[10px] font-bold uppercase tracking-wider rounded-md">20 Questions</span>
                                            <span className="px-2.5 py-1 bg-slate-100 text-slate-600 text-[10px] font-bold uppercase tracking-wider rounded-md">Coding</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* General Aptitude Track Card */}
                            <div
                                onClick={() => setSelectedCategory('General')}
                                className={`group bg-white p-6 rounded-2xl shadow-sm border cursor-pointer transition-all duration-200 relative overflow-hidden
                                ${selectedCategory === 'General'
                                        ? 'border-purple-500 ring-1 ring-purple-500/20'
                                        : 'border-slate-200 hover:border-purple-300 hover:shadow-md'}`}
                            >
                                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                                    <Brain size={100} />
                                </div>
                                <div className="flex items-start gap-5 relative z-10">
                                    <div className={`w-14 h-14 rounded-xl flex items-center justify-center shrink-0 transition-colors
                                        ${selectedCategory === 'General' ? 'bg-purple-600 text-white shadow-lg shadow-purple-200' : 'bg-purple-50 text-purple-600'}`}>
                                        <Brain size={28} />
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex justify-between items-start">
                                            <h3 className="text-lg font-bold text-slate-900 mb-1">General Aptitude</h3>
                                            {selectedCategory === 'General' && <CheckCircleIcon color="text-purple-600" />}
                                        </div>
                                        <p className="text-slate-500 text-sm leading-relaxed mb-4 max-w-lg">
                                            Test your logical reasoning, quantitative aptitude, and verbal ability. Essential for preliminary screening.
                                        </p>
                                        <div className="flex gap-2">
                                            <span className="px-2.5 py-1 bg-slate-100 text-slate-600 text-[10px] font-bold uppercase tracking-wider rounded-md">30 Mins</span>
                                            <span className="px-2.5 py-1 bg-slate-100 text-slate-600 text-[10px] font-bold uppercase tracking-wider rounded-md">20 Questions</span>
                                            <span className="px-2.5 py-1 bg-slate-100 text-slate-600 text-[10px] font-bold uppercase tracking-wider rounded-md">Logic</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Column: Profile & Action (4 cols) */}
                        <div className="lg:col-span-4 space-y-6">
                            {/* Candidate Profile Widget */}
                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 sticky top-6">
                                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-2">
                                    <Target size={16} className="text-slate-400" /> Candidate Profile
                                </h3>

                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-xs font-semibold text-slate-500 mb-1.5 ml-1">Registration Name</label>
                                        <input
                                            type="text"
                                            placeholder="Enter your full name"
                                            value={username}
                                            onChange={(e) => setUsername(e.target.value)}
                                            className="w-full text-sm p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none font-medium text-slate-800 placeholder:text-slate-400"
                                        />
                                    </div>

                                    <div className="pt-2">
                                        <div className="flex justify-between text-xs text-slate-500 mb-2 font-medium">
                                            <span>Selected Track</span>
                                            <span className={selectedCategory ? 'text-indigo-600 font-bold' : 'text-slate-400'}>
                                                {selectedCategory || 'None'}
                                            </span>
                                        </div>
                                        <button
                                            onClick={handleStart}
                                            disabled={!username || !selectedCategory || loading}
                                            className={`w-full py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-lg 
                                            ${!username || !selectedCategory
                                                    ? 'bg-slate-100 text-slate-400 cursor-not-allowed shadow-none border border-slate-200'
                                                    : 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white hover:from-indigo-700 hover:to-violet-700 shadow-indigo-500/20 active:scale-[0.98]'
                                                }`}
                                        >
                                            {loading ? 'Initializing...' : (
                                                <>Start Assessment <ChevronRight size={16} /></>
                                            )}
                                        </button>
                                        {!username && selectedCategory && (
                                            <p className="text-red-500 text-[10px] mt-2 text-center font-bold animate-pulse">
                                                * Name is required
                                            </p>
                                        )}
                                    </div>
                                </div>

                                <div className="mt-6 pt-6 border-t border-slate-100">
                                    <div className="flex items-center gap-3 text-xs text-slate-400">
                                        <Shield size={14} />
                                        <p>Secure browser environment active. Anti-cheat protocols enabled.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </StudentLayout>
    );
};

// Helper for check icon
const CheckCircleIcon = ({ color = "text-indigo-600" }) => (
    <div className={`p-1 bg-white rounded-full ${color}`}>
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-check-circle"><circle cx="12" cy="12" r="10" /><path d="m9 12 2 2 4-4" /></svg>
    </div>
);

export default TestSelection;
