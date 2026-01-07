import React, { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, MapPin, Settings, Megaphone, User, LogOut, Menu, X } from 'lucide-react';

const AdminLayout = ({ children }) => {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        localStorage.clear();
        navigate('/login/admin');
    };

    const NavItem = ({ icon: Icon, label, tabName, active, collapsed }) => {
        // Correctly handle navigation back to dashboard with state
        const handleClick = () => {
            navigate('/dashboard/admin', { state: { activeTab: tabName } });
        };

        const isActive = active || (location.pathname === '/dashboard/admin' && location.state?.activeTab === tabName);

        // Styling matches AdminDashboard
        return (
            <button
                onClick={handleClick}
                className={`flex items-center gap-3 p-3 rounded-xl transition-all duration-300 w-full text-left group ${isActive
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/30'
                    : 'text-slate-400 hover:bg-white/5 hover:text-white'
                    } ${collapsed && 'justify-center'}`}
            >
                <Icon size={22} className={`${!isActive && 'group-hover:text-blue-400'} transition-colors shrink-0`} />
                <span className={`font-medium whitespace-nowrap transition-all duration-300 ${collapsed && 'w-0 opacity-0 hidden'}`}>
                    {label}
                </span>
            </button>
        );
    };

    return (
        <div className="flex h-screen bg-slate-50/[0.97] font-sans overflow-hidden">
            {/* Sidebar */}
            <aside className={`${sidebarOpen ? 'w-72' : 'w-24'} bg-[#0F172A] text-white transition-all duration-300 flex flex-col shadow-2xl z-20 relative shrink-0`}>
                <div className="p-6 flex items-center justify-between h-20">
                    <div className={`font-black text-2xl bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 whitespace-nowrap overflow-hidden transition-all duration-300 ${!sidebarOpen && 'w-0 opacity-0'}`}>
                        CareerConnect
                    </div>
                    <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 rounded-xl hover:bg-white/10 text-slate-400 hover:text-white transition-colors">
                        {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
                    </button>
                </div>

                <nav className="flex-1 py-8 px-4 space-y-3 overflow-y-auto">
                    <NavItem tabName="dashboard" icon={LayoutDashboard} label="Overview" collapsed={!sidebarOpen} />
                    <NavItem tabName="students" icon={Users} label="Students" collapsed={!sidebarOpen} />
                    <NavItem tabName="companies" icon={MapPin} label="Companies" collapsed={!sidebarOpen} />
                    <div className="my-4 border-t border-white/10 mx-2"></div>
                    <NavItem tabName="content" icon={Settings} label="Content" collapsed={!sidebarOpen} />
                    {/* Check if current path is announcement detail to visually highlight Job Board */}
                    <NavItem
                        tabName="announcements"
                        icon={Megaphone}
                        label="Job Board"
                        collapsed={!sidebarOpen}
                        active={location.pathname.startsWith('/announcement')}
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
                        <span className={`whitespace-nowrap transition-all duration-300 ${!sidebarOpen && 'w-0 opacity-0 hidden'}`}>Logout</span>
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col overflow-hidden relative">
                <main className="flex-1 overflow-y-auto bg-slate-50/[0.97] scroll-smooth">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;
