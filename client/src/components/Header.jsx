import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Menu,
    X,
    ChevronDown,
    Shield,
    User,
    Building,
    GraduationCap,
    MessageCircle,
    Info,
    Home as HomeIcon,
    ArrowRight
} from 'lucide-react';
import RoleSelectionModal from './RoleSelectionModal';

const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();

    // Scroll effect for sticky header
    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleScrollToElement = (id) => {
        setIsMenuOpen(false);
        if (location.pathname === '/') {
            const element = document.getElementById(id);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
            }
        } else {
            navigate('/');
            setTimeout(() => {
                const element = document.getElementById(id);
                if (element) {
                    element.scrollIntoView({ behavior: 'smooth' });
                }
            }, 100);
        }
    };

    const navLinks = [
        { name: 'Home', path: '/', icon: HomeIcon },
        { name: 'About', action: () => handleScrollToElement('about'), icon: Info },
        { name: 'Contact', path: '/contact', icon: MessageCircle },
    ];

    const portalLinks = [
        { name: 'Student Portal', path: '/login/student', icon: User, color: 'text-blue-600', bg: 'bg-blue-50' },
        { name: 'Company Portal', path: '/login/company', icon: Building, color: 'text-purple-600', bg: 'bg-purple-50' },
        { name: 'Admin Portal', path: '/login/admin', icon: Shield, color: 'text-slate-600', bg: 'bg-slate-100' },
    ];

    return (
        <header
            className={`fixed w-full z-[100] top-0 transition-all duration-700 ease-in-out border-b ${scrolled
                ? 'bg-white/90 backdrop-blur-2xl border-slate-200/50 py-2 shadow-lg shadow-blue-500/5'
                : 'bg-transparent border-transparent py-4'
                }`}
        >
            <div className="container mx-auto px-6 flex justify-between items-center">
                {/* Logo Section */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center"
                >
                    <Link to="/" className="flex items-center gap-2 group">
                        <div className="w-10 h-10 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-500/20 group-hover:scale-110 transition-transform duration-300">
                            <GraduationCap size={24} />
                        </div>
                        <span className={`text-2xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r transition-all duration-700 ${scrolled
                            ? 'from-blue-600 to-indigo-600'
                            : 'from-white to-white'
                            }`}>
                            CareerConnect
                        </span>
                    </Link>
                </motion.div>

                {/* Desktop Navigation */}
                <nav className="hidden lg:flex items-center space-x-1">
                    {navLinks.map((link) => (
                        link.path ? (
                            <Link
                                key={link.name}
                                to={link.path}
                                className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${scrolled
                                    ? 'text-slate-600 hover:text-blue-600 hover:bg-blue-50'
                                    : 'text-slate-200 hover:text-white hover:bg-white/10'
                                    }`}
                            >
                                {link.name}
                            </Link>
                        ) : (
                            <button
                                key={link.name}
                                onClick={link.action}
                                className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${scrolled
                                    ? 'text-slate-600 hover:text-blue-600 hover:bg-blue-50'
                                    : 'text-slate-200 hover:text-white hover:bg-white/10'
                                    }`}
                            >
                                {link.name}
                            </button>
                        )
                    ))}

                    <div className="h-4 w-[1px] bg-slate-200/30 mx-2" />

                    {/* Portal Dropdown */}
                    <div className="relative group p-2">
                        <button className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-bold transition-all duration-300 ${scrolled
                            ? 'text-slate-700 hover:bg-slate-100'
                            : 'text-white hover:bg-white/10'
                            }`}>
                            Portals <ChevronDown size={14} className="group-hover:rotate-180 transition-transform duration-300" />
                        </button>

                        {/* Dropdown Menu */}
                        <div className="absolute right-0 mt-2 w-64 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform origin-top-right scale-95 group-hover:scale-100">
                            <div className="bg-white rounded-2xl shadow-2xl border border-slate-100 p-2 mt-2">
                                {portalLinks.map((portal) => (
                                    <Link
                                        key={portal.name}
                                        to={portal.path}
                                        className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 transition-all group/item"
                                    >
                                        <div className={`w-10 h-10 ${portal.bg} ${portal.color} rounded-lg flex items-center justify-center group-hover/item:scale-110 transition-transform`}>
                                            <portal.icon size={20} />
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-slate-900 leading-tight">{portal.name}</p>
                                            <p className="text-[10px] text-slate-400 font-medium">Click to access portal</p>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={() => setIsRoleModalOpen(true)}
                        className="ml-2 px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full text-sm font-bold shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 hover:-translate-y-0.5 active:scale-95 transition-all"
                    >
                        Join Now
                    </button>
                </nav>

                {/* Mobile Menu Toggle */}
                <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className={`lg:hidden p-2.5 rounded-xl transition-colors ${scrolled ? 'bg-slate-100 text-slate-600' : 'bg-white/10 text-white'
                        }`}
                >
                    {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </motion.button>
            </div>

            {/* Mobile Navigation Menu */}
            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="lg:hidden bg-white border-t border-slate-100 overflow-hidden shadow-2xl"
                    >
                        <div className="px-6 py-8 space-y-8">
                            <div className="space-y-4">
                                <p className="text-[10px] uppercase font-bold tracking-widest text-slate-400">Main Menu</p>
                                {navLinks.map((link, i) => (
                                    <motion.div
                                        initial={{ x: -20, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        transition={{ delay: i * 0.1 }}
                                        key={link.name}
                                    >
                                        {link.path ? (
                                            <Link
                                                to={link.path}
                                                onClick={() => setIsMenuOpen(false)}
                                                className="flex items-center gap-4 text-xl font-bold text-slate-900 hover:text-blue-600"
                                            >
                                                <link.icon className="text-blue-600" size={24} />
                                                {link.name}
                                            </Link>
                                        ) : (
                                            <button
                                                onClick={link.action}
                                                className="flex items-center gap-4 text-xl font-bold text-slate-900 hover:text-blue-600 w-full text-left"
                                            >
                                                <link.icon className="text-blue-600" size={24} />
                                                {link.name}
                                            </button>
                                        )}
                                    </motion.div>
                                ))}
                            </div>

                            <div className="space-y-4 pt-8 border-t border-slate-100">
                                <p className="text-[10px] uppercase font-bold tracking-widest text-slate-400">Authorized Portals</p>
                                <div className="grid grid-cols-1 gap-4">
                                    {portalLinks.map((portal, i) => (
                                        <motion.div
                                            initial={{ x: -20, opacity: 0 }}
                                            animate={{ x: 0, opacity: 1 }}
                                            transition={{ delay: 0.3 + (i * 0.1) }}
                                            key={portal.name}
                                        >
                                            <Link
                                                to={portal.path}
                                                onClick={() => setIsMenuOpen(false)}
                                                className={`flex items-center justify-between p-4 rounded-2xl ${portal.bg} border-l-4 border-current ${portal.color}`}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <portal.icon size={20} />
                                                    <span className="font-bold">{portal.name}</span>
                                                </div>
                                                <ArrowRight size={18} />
                                            </Link>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>

                            <button
                                onClick={() => {
                                    setIsMenuOpen(false);
                                    setIsRoleModalOpen(true);
                                }}
                                className="block w-full text-center py-4 bg-slate-900 text-white rounded-2xl font-bold active:scale-95 transition-all shadow-lg shadow-slate-200"
                            >
                                Get Started Today
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <RoleSelectionModal
                isOpen={isRoleModalOpen}
                onClose={() => setIsRoleModalOpen(false)}
            />
        </header>
    );
};

export default Header;
