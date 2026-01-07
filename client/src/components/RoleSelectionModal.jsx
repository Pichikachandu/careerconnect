import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, Building, Shield, ArrowRight, GraduationCap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const RoleSelectionModal = ({ isOpen, onClose }) => {
    const navigate = useNavigate();

    const roles = [
        {
            id: 'student',
            title: 'I am a Student',
            description: 'Advance your career, take assessments, and get hired by top companies.',
            icon: GraduationCap,
            path: '/login/student',
            color: 'from-blue-500 to-indigo-600',
            shadow: 'shadow-blue-500/25'
        },
        {
            id: 'company',
            title: 'I am a Recruiter',
            description: 'Hire the best talent for your organization and manage placement drives.',
            icon: Building,
            path: '/login/company',
            color: 'from-purple-500 to-fuchsia-600',
            shadow: 'shadow-purple-500/25'
        },
        {
            id: 'admin',
            title: 'I am an Admin',
            description: 'Manage the platform, users, and overall placement operations.',
            icon: Shield,
            path: '/login/admin',
            color: 'from-slate-700 to-slate-900',
            shadow: 'shadow-slate-900/25'
        }
    ];

    const handleRoleClick = (path) => {
        onClose();
        navigate(path);
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 z-[200] bg-slate-950/40 backdrop-blur-md cursor-pointer"
                    />

                    {/* Modal Container */}
                    <div className="fixed inset-0 z-[201] flex items-center justify-center p-4 pointer-events-none">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            transition={{ type: "spring", damping: 25, stiffness: 300 }}
                            className="w-full max-w-4xl bg-white/95 backdrop-blur-2xl rounded-[2.5rem] shadow-[0_32px_128px_-16px_rgba(0,0,0,0.2)] border border-white/20 p-8 md:p-12 relative overflow-hidden pointer-events-auto"
                        >
                            {/* Decorative Background Elements */}
                            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl -mr-32 -mt-32" />
                            <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl -ml-32 -mb-32" />

                            {/* Header */}
                            <div className="relative z-10 flex justify-between items-start mb-12">
                                <div>
                                    <h2 className="text-3xl md:text-4xl font-black text-slate-900 leading-tight tracking-tight">
                                        Choose Your <br />
                                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                                            Gateway to Success
                                        </span>
                                    </h2>
                                    <p className="mt-3 text-slate-500 font-medium">Select your role to continue to the portal</p>
                                </div>
                                <button
                                    onClick={onClose}
                                    className="p-2.5 rounded-2xl bg-slate-100 text-slate-500 hover:bg-red-50 hover:text-red-500 transition-all active:scale-95"
                                >
                                    <X size={24} />
                                </button>
                            </div>

                            {/* Role Cards Grid */}
                            <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-6">
                                {roles.map((role, index) => (
                                    <motion.button
                                        key={role.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.1 * index }}
                                        whileHover={{ y: -8, scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={() => handleRoleClick(role.path)}
                                        className="group flex flex-col items-start p-8 rounded-[2rem] bg-slate-50 border border-slate-100 hover:bg-white hover:border-blue-100 transition-all duration-300 shadow-sm hover:shadow-2xl text-left h-full"
                                    >
                                        <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${role.color} flex items-center justify-center text-white mb-8 shadow-lg ${role.shadow} group-hover:rotate-12 transition-transform duration-500`}>
                                            <role.icon size={28} />
                                        </div>
                                        <h3 className="text-xl font-bold text-slate-900 mb-3 tracking-tight group-hover:text-blue-600 transition-colors">
                                            {role.title}
                                        </h3>
                                        <p className="text-sm text-slate-500 font-medium leading-relaxed mb-8 flex-grow">
                                            {role.description}
                                        </p>
                                        <div className="flex items-center gap-2 text-blue-600 font-bold text-sm">
                                            Enter Portal <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                                        </div>
                                    </motion.button>
                                ))}
                            </div>

                            {/* Footer Info */}
                            <div className="relative z-10 mt-12 p-6 rounded-3xl bg-blue-50/50 border border-blue-100/50 flex flex-col md:flex-row items-center justify-between gap-4">
                                <p className="text-sm text-slate-600 font-medium text-center md:text-left">
                                    Need help deciding? Contact our <span className="text-blue-600 font-bold">Support Team</span> available 24/7.
                                </p>
                                <button
                                    onClick={() => { onClose(); navigate('/contact'); }}
                                    className="text-sm font-bold text-blue-600 hover:text-blue-700 transition-colors"
                                >
                                    Go to Contact Us
                                </button>
                            </div>
                        </motion.div>
                    </div>
                </>
            )}
        </AnimatePresence>
    );
};

export default RoleSelectionModal;
