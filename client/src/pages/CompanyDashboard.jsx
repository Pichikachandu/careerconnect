import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AnnouncementList from '../components/AnnouncementList';
import { LayoutDashboard, Megaphone, LogOut, Briefcase, Menu, X, PlusCircle, Globe, Mail, Phone, User } from 'lucide-react';

const CompanyDashboard = () => {
    const navigate = useNavigate();
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [companyInfo, setCompanyInfo] = useState(null);

    useEffect(() => {
        const companyData = localStorage.getItem('companyData');
        if (!companyData) {
            navigate('/login/company');
        } else {
            setCompanyInfo(JSON.parse(companyData));
        }
    }, [navigate]);

    const handleLogout = () => {
        localStorage.clear();
        navigate('/login/company');
    };

    return (
        <div className="flex h-screen bg-gray-50 font-sans overflow-hidden">
            {/* Sidebar */}
            <aside className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-slate-900 text-white transition-all duration-300 flex flex-col shadow-xl z-20`}>
                <div className="p-4 flex items-center justify-between border-b border-white/10 h-16">
                    <div className={`font-bold text-xl bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400 whitespace-nowrap overflow-hidden transition-all ${!sidebarOpen && 'w-0 opacity-0'}`}>
                        Recruiter
                    </div>
                    <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-1.5 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-colors">
                        {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
                    </button>
                </div>

                <nav className="flex-1 py-6 px-3 space-y-2 overflow-y-auto">
                    <div className={`flex items-center gap-3 p-3 rounded-xl transition-all duration-300 bg-purple-600 text-white shadow-lg shadow-purple-500/30 ${!sidebarOpen && 'justify-center'}`}>
                        <LayoutDashboard size={22} />
                        <span className={`font-medium whitespace-nowrap transition-all duration-300 ${!sidebarOpen && 'w-0 opacity-0 hidden'}`}>
                            Dashboard
                        </span>
                    </div>

                    <Link to="/profile/company" className={`flex items-center gap-3 p-3 rounded-xl transition-all duration-300 group text-gray-400 hover:bg-white/5 hover:text-white ${!sidebarOpen && 'justify-center'}`}>
                        <User size={22} className="group-hover:text-purple-400 transition-colors" />
                        <span className={`font-medium whitespace-nowrap transition-all duration-300 ${!sidebarOpen && 'w-0 opacity-0 hidden'}`}>
                            Company Profile
                        </span>
                    </Link>
                </nav>

                <div className="p-4 border-t border-white/10">
                    <button
                        onClick={handleLogout}
                        className={`flex items-center gap-3 w-full p-3 rounded-lg text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all group ${!sidebarOpen && 'justify-center'}`}
                        title="Logout"
                    >
                        <LogOut size={20} className="group-hover:-translate-x-1 transition-transform" />
                        <span className={`whitespace-nowrap transition-all duration-300 ${!sidebarOpen && 'w-0 opacity-0 hidden'}`}>Logout</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 z-10">
                    <h2 className="text-xl font-bold text-gray-800">Recruitment Portal</h2>
                    {companyInfo && (
                        <div className="flex items-center gap-3">
                            <div className="text-right hidden md:block">
                                <p className="text-sm font-bold text-gray-800">{companyInfo.name || companyInfo.username}</p>
                                <p className="text-xs text-gray-500">Recruiter</p>
                            </div>
                            <div className="w-9 h-9 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center font-bold">
                                {companyInfo.username?.charAt(0).toUpperCase()}
                            </div>
                        </div>
                    )}
                </header>

                <main className="flex-1 overflow-y-auto p-6 lg:p-8 bg-gray-50/50">
                    <div className="max-w-6xl mx-auto space-y-8">
                        {/* Welcome Card */}
                        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl shadow-lg p-8 text-white relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
                            <div className="relative z-10">
                                <h1 className="text-3xl font-bold mb-2">Welcome, {companyInfo?.name || 'Recruiter'}! 🚀</h1>
                                <p className="text-purple-100 max-w-2xl">
                                    Manage your job postings, track student applications, and find the perfect candidates for your organization.
                                </p>
                            </div>
                        </div>

                        {/* Announcements Management */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                            <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-white">
                                <div>
                                    <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                                        <Megaphone size={24} className="text-purple-600" /> Active Job Postings
                                    </h2>
                                    <p className="text-gray-500 text-sm mt-1">Create and manage your recruitment announcements.</p>
                                </div>
                                {/* <button className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors shadow-md shadow-purple-500/20">
                                    <PlusCircle size={18} /> New Posting
                                </button> */}
                            </div>
                            <div className="p-6">
                                <AnnouncementList role="company" />
                            </div>
                        </div>

                        {/* Stats Row (Placeholder) */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-blue-100 text-blue-600 rounded-xl">
                                        <Briefcase size={24} />
                                    </div>
                                    <div>
                                        <p className="text-gray-500 text-xs uppercase font-bold">Total Jobs</p>
                                        <p className="text-2xl font-bold text-gray-800">0</p>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-green-100 text-green-600 rounded-xl">
                                        <User size={24} />
                                    </div>
                                    <div>
                                        <p className="text-gray-500 text-xs uppercase font-bold">Applications</p>
                                        <p className="text-2xl font-bold text-gray-800">0</p>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-orange-100 text-orange-600 rounded-xl">
                                        <Globe size={24} />
                                    </div>
                                    <div>
                                        <p className="text-gray-500 text-xs uppercase font-bold">Views</p>
                                        <p className="text-2xl font-bold text-gray-800">0</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default CompanyDashboard;
