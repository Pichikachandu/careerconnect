import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import {
    LayoutDashboard,
    User,
    FileText,
    LogOut,
    BookOpen,
    Code,
    Video,
    Briefcase,
    Menu,
    X,

    MessageCircle,
    Megaphone
} from 'lucide-react';

const StudentLayout = ({ children }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [user, setUser] = useState(null);
    const [sidebarOpen, setSidebarOpen] = useState(true);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (!storedUser) {
            // Optional: redirect logic if strict protection is needed
            // navigate('/login/student');
            // For now just load data if present
        } else {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    const handleLogout = () => {
        localStorage.clear();
        navigate('/login/student');
    };

    return (
        <div className="flex h-screen bg-gray-50 font-sans overflow-hidden">
            {/* Sidebar */}
            <aside className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-slate-900 text-white transition-all duration-300 flex flex-col shadow-xl z-50 shrink-0`}>
                <div className="p-4 flex items-center justify-between border-b border-white/10 h-16">
                    <div className={`font-bold text-xl bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-400 whitespace-nowrap overflow-hidden transition-all ${!sidebarOpen && 'w-0 opacity-0'}`}>
                        CareerConnect
                    </div>
                    <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-1.5 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-colors">
                        {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
                    </button>
                </div>

                <nav className="flex-1 py-6 px-3 space-y-2 overflow-y-auto custom-scrollbar">
                    <NavItem to="/dashboard/student" icon={LayoutDashboard} label="Dashboard" active={location.pathname === '/dashboard/student'} collapsed={!sidebarOpen} />
                    <NavItem to="/announcements" icon={Megaphone} label="Announcements" active={location.pathname.startsWith('/announcement')} collapsed={!sidebarOpen} />
                    <NavItem to="/test" icon={BookOpen} label="Aptitude Quiz" active={location.pathname.startsWith('/test') || location.pathname.startsWith('/quiz')} collapsed={!sidebarOpen} />
                    <NavItem to="/dsa" icon={Code} label="DSA Practice" active={location.pathname.startsWith('/dsa')} collapsed={!sidebarOpen} />
                    <NavItem to="/interview" icon={Video} label="Mock Interview" active={location.pathname.startsWith('/interview')} collapsed={!sidebarOpen} />
                    <NavItem to="/module/ats" icon={Briefcase} label="Resume ATS" active={location.pathname.startsWith('/module/ats')} collapsed={!sidebarOpen} />
                    <NavItem to="/communication" icon={MessageCircle} label="English Coach" active={location.pathname.startsWith('/communication')} collapsed={!sidebarOpen} />
                    <NavItem to="/resume" icon={FileText} label="Resume Builder" active={location.pathname === '/resume'} collapsed={!sidebarOpen} />
                    <NavItem to="/profile/student" icon={User} label="My Profile" active={location.pathname === '/profile/student'} collapsed={!sidebarOpen} />


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

            {/* Main Content Wrapper */}
            <div className="flex-1 flex flex-col overflow-hidden relative">
                <main className="flex-1 overflow-y-auto bg-gray-50 scroll-smooth scrollbar-hide">
                    {children}
                </main>
            </div>
        </div>
    );
};

// Helper Components
const NavItem = ({ to, icon: Icon, label, active, collapsed }) => {
    const activeClass = active
        ? "bg-blue-600 text-white shadow-lg shadow-blue-500/30"
        : "text-gray-400 hover:bg-white/5 hover:text-white";

    return (
        <Link to={to} className={`flex items-center gap-3 p-3 rounded-xl transition-all duration-300 group ${activeClass} ${collapsed ? 'justify-center' : ''}`}>
            <Icon size={22} className={`${!active && 'group-hover:text-blue-400'} transition-colors shrink-0`} />
            <span className={`font-medium whitespace-nowrap transition-all duration-300 ${collapsed && 'w-0 opacity-0 hidden'}`}>
                {label}
            </span>
            {collapsed && !active && (
                <div className="absolute left-14 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 whitespace-nowrap shadow-lg border border-white/10">
                    {label}
                </div>
            )}
        </Link>
    );
}

export default StudentLayout;
