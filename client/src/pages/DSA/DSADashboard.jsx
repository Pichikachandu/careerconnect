import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import StudentLayout from '../../components/StudentLayout';
import { Search, Code, Filter, ChevronRight, CheckCircle, Clock, TrendingUp, Activity, PieChart as PieIcon } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

const DSADashboard = () => {
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [filter, setFilter] = useState({ difficulty: '', topic: '', search: '' });

    // Stats State
    const [stats, setStats] = useState([]); // Keep for problem status check
    const [analytics, setAnalytics] = useState(null);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem('user'));
        setUser(storedUser);
        if (storedUser) {
            fetchStats(storedUser.username);
        }
        fetchQuestions();
    }, [page, filter.difficulty, filter.topic]);

    const fetchStats = async (username) => {
        try {
            // Parallel fetch: stats for "Solved" check, analytics for charts
            const [statsRes, analyticsRes] = await Promise.all([
                axios.get(`http://localhost:3000/api/dsa/stats/${username}`),
                axios.get(`http://localhost:3000/api/dsa/analytics/${username}`)
            ]);
            setStats(statsRes.data);
            setAnalytics(analyticsRes.data);
        } catch (err) {
            console.error("Failed to fetch stats", err);
        }
    };

    const fetchQuestions = async () => {
        setLoading(true);
        try {
            const query = new URLSearchParams({
                page,
                limit: 10,
                difficulty: filter.difficulty,
                topic: filter.topic,
            });
            const res = await axios.get(`http://localhost:3000/api/dsa/questions?${query.toString()}`);
            setQuestions(res.data.questions);
            setTotalPages(Math.ceil(res.data.total / 10));
        } catch (err) {
            console.error("Failed to fetch questions", err);
        }
        setLoading(false);
    };

    const handleFilterChange = (key, value) => {
        setFilter({ ...filter, [key]: value });
        setPage(1);
    };

    // Use server analytics or default
    const totalSolved = analytics?.totalSolved || 0;
    const accuracy = analytics?.accuracy || 0;

    // Difficulty Data from server
    const difficultyData = [
        { name: 'Easy', value: analytics?.difficultySplit?.Easy || 0, color: '#10B981' },
        { name: 'Medium', value: analytics?.difficultySplit?.Medium || 0, color: '#F59E0B' },
        { name: 'Hard', value: analytics?.difficultySplit?.Hard || 0, color: '#EF4444' }
    ];

    // Activity Data from server
    const activityData = analytics?.recentActivity?.map(d => ({
        name: d.date, // Format date if needed
        status: d.count // Reusing 'status' key for chart compatibility or updating chart
    })) || Array(7).fill({ name: '', status: 0 });

    return (
        <StudentLayout>
            <div className="font-sans text-slate-900 h-full bg-slate-50">
                <div className="container mx-auto px-4 py-8 max-w-6xl">

                    {/* Hero */}
                    <div className="bg-gradient-to-r from-emerald-600 to-teal-800 rounded-3xl p-8 mb-10 text-white shadow-xl relative overflow-hidden">
                        <div className="relative z-10">
                            <h1 className="text-3xl font-bold mb-2">Data Structures & Algorithms</h1>
                            <p className="text-emerald-100 max-w-xl">
                                Master coding challenges with our comprehensive problem library. Track your progress, visualize metrics, and ace your technical interviews.
                            </p>
                        </div>
                        <div className="absolute right-0 bottom-0 opacity-20 transform translate-x-10 translate-y-10">
                            <Code size={180} />
                        </div>
                    </div>

                    {/* Performance Dashboard */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
                        {/* Summary Card */}
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 min-w-0">
                            <h3 className="font-bold text-slate-700 flex items-center gap-2 mb-6">
                                <Activity size={20} className="text-blue-500" /> Overall Performance
                            </h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 bg-slate-50 rounded-xl text-center">
                                    <div className="text-3xl font-black text-slate-800">{totalSolved}</div>
                                    <div className="text-xs text-slate-500 font-bold uppercase tracking-wider">Solved</div>
                                </div>
                                <div className="p-4 bg-slate-50 rounded-xl text-center">
                                    <div className="text-3xl font-black text-slate-800">{accuracy}%</div>
                                    <div className="text-xs text-slate-500 font-bold uppercase tracking-wider">Accuracy</div>
                                </div>
                            </div>
                        </div>

                        {/* Difficulty Distribution Chart */}
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col items-center justify-center min-w-0">
                            <h3 className="font-bold text-slate-700 flex items-center gap-2 mb-2 w-full">
                                <PieIcon size={20} className="text-purple-500" /> Difficulty Split
                            </h3>
                            <div className="w-full h-40 min-h-[160px]">
                                <ResponsiveContainer width="100%" height={160}>
                                    <PieChart>
                                        <Pie
                                            data={difficultyData}
                                            innerRadius={40}
                                            outerRadius={60}
                                            paddingAngle={5}
                                            dataKey="value"
                                        >
                                            {difficultyData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                            <div className="flex gap-4 text-xs font-bold text-slate-500">
                                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500"></span> Easy</span>
                                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-500"></span> Medium</span>
                                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-500"></span> Hard</span>
                            </div>
                        </div>

                        {/* Recent Activity Chart */}
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 min-w-0">
                            <h3 className="font-bold text-slate-700 flex items-center gap-2 mb-4">
                                <TrendingUp size={20} className="text-emerald-500" /> Recent Activity
                            </h3>
                            <div className="w-full h-40 min-h-[160px]">
                                <ResponsiveContainer width="100%" height={160}>
                                    <LineChart data={activityData}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                        <XAxis dataKey="name" hide />
                                        <YAxis hide />
                                        <Tooltip />
                                        <Line type="monotone" dataKey="status" stroke="#10B981" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                            <p className="text-center text-xs text-slate-400 mt-2">Daily Practice Attempts (Last 7 Days)</p>
                        </div>
                    </div>

                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold text-slate-800">Practice Problems</h2>
                        {/* Filters */}
                        <div className="flex gap-4">
                            <select
                                className="bg-white border border-slate-200 text-slate-700 text-sm rounded-lg p-2.5 outline-none font-medium"
                                value={filter.difficulty}
                                onChange={(e) => handleFilterChange('difficulty', e.target.value)}
                            >
                                <option value="">All Difficulties</option>
                                <option value="Easy">Easy</option>
                                <option value="Medium">Medium</option>
                                <option value="Hard">Hard</option>
                            </select>

                            <input
                                type="text"
                                placeholder="Search topic..."
                                className="bg-white border border-slate-200 text-slate-700 text-sm rounded-lg p-2.5 outline-none w-48 font-medium"
                                value={filter.topic}
                                onChange={(e) => handleFilterChange('topic', e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Questions List */}
                    <div className="space-y-3">
                        {loading ? (
                            [...Array(5)].map((_, i) => (
                                <div key={i} className="h-20 bg-white border border-slate-100 rounded-xl animate-pulse"></div>
                            ))
                        ) : (
                            questions.map((q) => {
                                // Check if user solved this
                                const isSolved = stats.some(s => s.qid === q.QID && s.status === 'Solved');

                                return (
                                    <Link to={`/dsa/problem/${q.QID}`} state={{ isSolved, title: q.title }} key={q.QID} className="block group">
                                        <div className={`p-5 rounded-xl border transition-all flex items-center justify-between
                                        ${isSolved ? 'bg-emerald-50/30 border-emerald-200 ring-1 ring-emerald-500/20' : 'bg-white border-slate-200 hover:border-indigo-300 hover:shadow-md'}`}>
                                            <div className="flex items-center gap-5">
                                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-sm shadow-sm
                                            ${q.difficulty === 'Easy' ? 'bg-emerald-100/50 text-emerald-600' :
                                                        q.difficulty === 'Medium' ? 'bg-amber-100/50 text-amber-600' :
                                                            'bg-red-100/50 text-red-600'}`}>
                                                    {q.difficulty[0]}
                                                </div>
                                                <div>
                                                    <h3 className="font-bold text-slate-800 group-hover:text-indigo-600 transition-colors text-lg flex items-center gap-2">
                                                        {q.title}
                                                        {isSolved && (
                                                            <span className="flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded-full">
                                                                <CheckCircle size={12} className="fill-current capitalize" /> Solved
                                                            </span>
                                                        )}
                                                    </h3>
                                                    <div className="flex gap-2 mt-1.5">
                                                        {JSON.parse(q.topics.replace(/'/g, '"')).slice(0, 3).map((t, i) => (
                                                            <span key={i} className="text-[10px] uppercase font-bold bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full tracking-wider">{t}</span>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-4 text-slate-400">
                                                <button className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors ${isSolved ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-50 hover:bg-slate-100 text-slate-600'}`}>
                                                    {isSolved ? 'Solve Again' : 'Solve Challenge'}
                                                </button>
                                            </div>
                                        </div>
                                    </Link>
                                )
                            })
                        )}
                    </div>

                    {/* Pagination */}
                    <div className="flex justify-center mt-10 gap-2">
                        <button
                            disabled={page === 1}
                            onClick={() => setPage(p => p - 1)}
                            className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-slate-600 disabled:opacity-50 hover:bg-slate-50 font-bold"
                        >
                            Previous
                        </button>
                        <span className="px-4 py-2 text-slate-600 font-medium">Page {page} of {totalPages}</span>
                        <button
                            disabled={page === totalPages}
                            onClick={() => setPage(p => p + 1)}
                            className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-slate-600 disabled:opacity-50 hover:bg-slate-50 font-bold"
                        >
                            Next
                        </button>
                    </div>
                </div>
            </div>
        </StudentLayout>
    );
};

export default DSADashboard;
