import React, { useState, useEffect } from 'react';
import StudentLayout from '../components/StudentLayout';
import AnnouncementList from '../components/AnnouncementList';
import { Megaphone, Search, Filter, Rocket, Briefcase, Zap, Bell, AlertCircle } from 'lucide-react';
import axios from 'axios';

const AnnouncementsPage = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [filterType, setFilterType] = useState('all'); // all, drive, normal

    // Dynamic Data State
    const [announcements, setAnnouncements] = useState([]);
    const [loading, setLoading] = useState(true);

    const [announcementView, setAnnouncementView] = useState('active');

    const fetchAnnouncements = async () => {
        try {
            // Using limit=50 to fetch a reasonable list for the student view
            const res = await axios.get('http://localhost:3000/announcements?limit=50');
            const data = Array.isArray(res.data) ? res.data : (res.data.data || []);
            setAnnouncements(data);
        } catch (error) {
            console.error('Error fetching announcements:', error);
            setAnnouncements([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAnnouncements();
    }, []);

    const safeAnnouncements = Array.isArray(announcements) ? announcements : [];
    const activeDrives = safeAnnouncements.filter(a => a.type === 'drive' && (!a.status || a.status === 'Active')).length;
    const newNotices = safeAnnouncements.filter(a => a.type === 'normal').length;
    const cancelledDrives = safeAnnouncements.filter(a => a.status === 'Cancelled').length;

    return (
        <StudentLayout>
            {/* Enterprise Hero Section */}
            <div className="relative bg-slate-900 py-12 px-6 lg:px-12 overflow-hidden">
                {/* Abstract Background Shapes */}
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-br from-indigo-600/20 to-purple-600/20 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-gradient-to-tr from-emerald-600/10 to-teal-600/10 rounded-full blur-3xl -ml-20 -mb-20 pointer-events-none"></div>

                <div className="relative z-10 max-w-7xl mx-auto">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <span className="bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                                    <Zap size={12} className="text-yellow-400 fill-yellow-400" /> Live Updates
                                </span>
                            </div>
                            <h1 className="text-4xl lg:text-5xl font-extrabold text-white tracking-tight mb-3">
                                Career <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">Board</span>
                            </h1>
                            <p className="text-lg text-slate-400 max-w-2xl">
                                Your central hub for campus drives, placement news, and urgent notifications. Stay ahead of the curve.
                            </p>
                        </div>

                        {/* Quick Stat Cards */}
                        <div className="flex gap-4">
                            <div className="bg-white/5 backdrop-blur-lg border border-white/10 p-4 rounded-2xl min-w-[140px]">
                                <p className="text-slate-400 text-xs font-bold uppercase mb-1">Active Drives</p>
                                <div className="flex items-end gap-2">
                                    <span className="text-3xl font-bold text-emerald-400">{activeDrives}</span>
                                    <Briefcase size={20} className="text-emerald-500/50 mb-1" />
                                </div>
                            </div>
                            <div className="bg-white/5 backdrop-blur-lg border border-white/10 p-4 rounded-2xl min-w-[140px]">
                                <p className="text-slate-400 text-xs font-bold uppercase mb-1">New Notices</p>
                                <div className="flex items-end gap-2">
                                    <span className="text-3xl font-bold text-amber-400">{newNotices}</span>
                                    <Bell size={20} className="text-amber-500/50 mb-1" />
                                </div>
                            </div>
                            <div className="bg-white/5 backdrop-blur-lg border border-white/10 p-4 rounded-2xl min-w-[140px]">
                                <p className="text-slate-400 text-xs font-bold uppercase mb-1">Updates</p>
                                <div className="flex items-end gap-2">
                                    <span className="text-3xl font-bold text-red-400">{cancelledDrives}</span>
                                    <AlertCircle size={20} className="text-red-500/50 mb-1" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Search and Filter Bar */}
                    <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-2 rounded-2xl flex flex-col md:flex-row gap-2 max-w-4xl shadow-2xl">
                        <div className="relative flex-1 group">
                            <Search className="absolute left-4 top-3.5 text-slate-400 group-focus-within:text-indigo-400 transition-colors" size={20} />
                            <input
                                type="text"
                                placeholder="Search companies, roles, or packages..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full bg-slate-900/50 text-white placeholder-slate-500 pl-12 pr-4 py-3 rounded-xl border border-transparent focus:bg-slate-900 focus:border-indigo-500/50 outline-none transition-all font-medium"
                            />
                        </div>

                        <div className="flex bg-slate-900/50 p-1 rounded-xl">
                            <button
                                onClick={() => setFilterType('all')}
                                className={`px-5 py-2.5 rounded-lg text-sm font-bold transition-all ${filterType === 'all' ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/25' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
                            >
                                All Posts
                            </button>
                            <button
                                onClick={() => setFilterType('drive')}
                                className={`px-5 py-2.5 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${filterType === 'drive' ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/25' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
                            >
                                <Briefcase size={16} /> Campus Drives
                            </button>
                            <button
                                onClick={() => setFilterType('normal')}
                                className={`px-5 py-2.5 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${filterType === 'normal' ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/25' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
                            >
                                <Megaphone size={16} /> General
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="p-6 lg:p-10 max-w-7xl mx-auto -mt-8 relative z-20">
                <div className="bg-white rounded-3xl shadow-xl border border-slate-100 p-8 min-h-[600px]">
                    <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-100">
                        <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                            {(filterType === 'all' && 'Latest Feed')}
                            {(filterType === 'drive' && 'Active Campus Drives')}
                            {(filterType === 'normal' && 'General Announcements')}
                            <span className="text-slate-400 text-sm font-normal ml-2">
                                {searchQuery && `• Results for "${searchQuery}"`}
                            </span>
                        </h2>

                        {/* Status Toggle */}
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

                    <AnnouncementList
                        role="student"
                        searchQuery={searchQuery}
                        filterType={filterType}
                        announcements={announcements}
                        statusFilter={announcementView}
                        onRefresh={fetchAnnouncements}
                    />
                </div>
            </div>
        </StudentLayout>
    );
};

export default AnnouncementsPage;
