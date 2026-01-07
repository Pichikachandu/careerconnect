import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { User, Lock, Mail, Phone, Calendar, Briefcase, ChevronRight, UserCircle } from 'lucide-react';

const Auth = () => {
    const { role } = useParams(); // student, admin, company
    const navigate = useNavigate();
    const [isLogin, setIsLogin] = useState(true);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({});

    // Configuration for different roles
    const config = {
        student: {
            title: 'Student Portal',
            subtitle: 'Access your learning resources and placement opportunities.',
            loginUrl: 'http://localhost:3000/login',
            registerUrl: 'http://localhost:3000/register',
            dashboard: '/dashboard/student',
            gradient: 'from-blue-600 to-cyan-500',
            icon: <UserCircle size={48} className="text-blue-100" />,
            fields: [
                { name: 'name', label: 'Full Name', type: 'text', required: true, icon: User },
                { name: 'email', label: 'Email', type: 'email', required: true, icon: Mail },
                { name: 'phone', label: 'Phone', type: 'tel', required: true, icon: Phone },
                { name: 'dob', label: 'Date of Birth', type: 'date', required: true, icon: Calendar },
                { name: 'college', label: 'College', type: 'text', required: true, icon: Briefcase },
                {
                    name: 'department',
                    label: 'Department',
                    type: 'select',
                    options: ['CSE', 'ECE', 'ME', 'CE', 'IT'],
                    required: true
                },
                {
                    name: 'gender',
                    label: 'Gender',
                    type: 'radio',
                    options: ['Male', 'Female'],
                    required: true
                },
                { name: 'username', label: 'Username', type: 'text', required: true, icon: User },
                { name: 'password', label: 'Password', type: 'password', required: true, icon: Lock },
            ]
        },
        admin: {
            title: 'Admin Portal',
            subtitle: 'Manage students, announcements, and portal settings.',
            loginUrl: 'http://localhost:3000/admin/login',
            registerUrl: 'http://localhost:3000/admin/register',
            dashboard: '/dashboard/admin',
            gradient: 'from-slate-800 to-slate-900',
            icon: <Briefcase size={48} className="text-slate-100" />,
            fields: [
                { name: 'name', label: 'Name', type: 'text', required: true, icon: User },
                { name: 'position', label: 'Position', type: 'text', required: true, icon: Briefcase },
                { name: 'email', label: 'Email', type: 'email', required: true, icon: Mail },
                { name: 'phone', label: 'Phone', type: 'tel', required: true, icon: Phone },
                { name: 'username', label: 'Username', type: 'text', required: true, icon: User },
                { name: 'password', label: 'Password', type: 'password', required: true, icon: Lock },
            ]
        },
        company: {
            title: 'Recruiter Portal',
            subtitle: 'Connect with top talent and manage your hiring drives.',
            loginUrl: 'http://localhost:3000/company/login',
            registerUrl: 'http://localhost:3000/company/register',
            dashboard: '/dashboard/company',
            gradient: 'from-purple-600 to-indigo-600',
            icon: <Briefcase size={48} className="text-purple-100" />,
            fields: [
                { name: 'name', label: 'Company Name', type: 'text', required: true, icon: Briefcase },
                { name: 'email', label: 'Email', type: 'email', required: true, icon: Mail },
                { name: 'company_add', label: 'Address', type: 'text', required: true, icon: Briefcase },
                { name: 'phone', label: 'Phone', type: 'text', required: true, icon: Phone },
                { name: 'username', label: 'Username', type: 'text', required: true, icon: User },
                { name: 'password', label: 'Password', type: 'password', required: true, icon: Lock },
            ]
        }
    };

    const currentConfig = config[role] || config.student;

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        const url = isLogin ? currentConfig.loginUrl : currentConfig.registerUrl;

        try {
            const response = await axios.post(url, formData);
            if (response.status === 200 || response.status === 201) {
                // Success animation/toast could be here
                if (isLogin) {
                    // Save specific user data based on role if needed
                    if (role === 'student') localStorage.setItem('user', JSON.stringify(response.data.user));
                    if (role === 'admin') localStorage.setItem('adminData', JSON.stringify(response.data.admin));
                    if (role === 'company') localStorage.setItem('companyData', JSON.stringify(response.data.company));

                    // Set Role for RBAC
                    localStorage.setItem('userRole', role);

                    navigate(currentConfig.dashboard);
                } else {
                    setIsLogin(true);
                    alert("Registration successful! Please login.");
                }
            }
        } catch (err) {
            setError(err.response?.data?.message || 'An error occurred during authentication.');
        }
    };

    const renderField = (field) => {
        const Icon = field.icon;

        if (field.type === 'select') {
            return (
                <div key={field.name} className="space-y-1">
                    <label className="text-sm font-medium text-gray-700">{field.label}</label>
                    <div className="relative">
                        <select
                            name={field.name}
                            onChange={handleChange}
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                            required={field.required}
                        >
                            <option value="">Select {field.label}</option>
                            {field.options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                        </select>
                    </div>
                </div>
            );
        }
        if (field.type === 'radio') {
            return (
                <div key={field.name} className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">{field.label}</label>
                    <div className="flex gap-4">
                        {field.options.map(opt => (
                            <label key={opt} className="inline-flex items-center cursor-pointer">
                                <input
                                    type="radio"
                                    name={field.name}
                                    value={opt}
                                    onChange={handleChange}
                                    className="peer sr-only"
                                    required={field.required}
                                />
                                <div className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg peer-checked:bg-blue-600 peer-checked:text-white transition-all text-sm font-medium">
                                    {opt}
                                </div>
                            </label>
                        ))}
                    </div>
                </div>
            );
        }
        return (
            <div key={field.name} className="space-y-1">
                <label className="text-sm font-medium text-gray-700">{field.label}</label>
                <div className="relative">
                    {Icon && <Icon size={18} className="absolute left-3 top-3.5 text-gray-400" />}
                    <input
                        type={field.type}
                        name={field.name}
                        onChange={handleChange}
                        className={`w-full ${Icon ? 'pl-10' : 'pl-4'} pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none`}
                        placeholder={`Enter your ${field.label.toLowerCase()}`}
                        required={field.required}
                    />
                </div>
            </div>
        );
    };

    const loginFields = [
        { name: 'username', label: 'Username', type: 'text', required: true, icon: User },
        { name: 'password', label: 'Password', type: 'password', required: true, icon: Lock }
    ];

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Sidebar Image Section */}
            <div className={`hidden lg:flex w-1/2 bg-gradient-to-br ${currentConfig.gradient} relative overflow-hidden items-center justify-center p-12`}>
                <div className="absolute inset-0 bg-black/10"></div>
                <div className="relative z-10 text-white max-w-lg">
                    <div className="mb-6">{currentConfig.icon}</div>
                    <h1 className="text-4xl font-bold mb-4">{currentConfig.title}</h1>
                    <p className="text-xl opacity-90 leading-relaxed font-light">{currentConfig.subtitle}</p>
                </div>
                {/* Decorative circles */}
                <div className="absolute -top-20 -right-20 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 left-0 w-80 h-80 bg-black/10 rounded-full blur-3xl"></div>
            </div>

            {/* Form Section */}
            <div className="w-full lg:w-1/2 flex flex-col relative overflow-y-auto h-screen">
                <div className="absolute top-0 right-0 p-6 z-20">
                    <Link to="/" className="text-sm font-medium text-gray-500 hover:text-gray-900 flex items-center gap-1">
                        Back to Home <ChevronRight size={16} />
                    </Link>
                </div>

                <div className="flex-grow flex items-center justify-center p-6 lg:p-12">
                    <div className="w-full max-w-md space-y-8">
                        <div className="text-center lg:text-left">
                            <h2 className="text-3xl font-bold text-gray-900 tracking-tight">
                                {isLogin ? 'Welcome Back!' : 'Create Account'}
                            </h2>
                            <p className="mt-2 text-gray-600">
                                {isLogin ? 'Please enter your details to sign in.' : 'Fill in the form to get started.'}
                            </p>
                        </div>

                        {error && (
                            <div className="p-4 rounded-lg bg-red-50 border border-red-100 text-red-600 text-sm flex items-center gap-2 animate-shake">
                                <span className="font-bold">Error:</span> {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-5">
                            {(isLogin ? loginFields : currentConfig.fields).map(field => renderField(field))}

                            <button
                                type="submit"
                                className={`w-full py-3.5 px-4 bg-gradient-to-r ${currentConfig.gradient} hover:opacity-90 text-white font-bold rounded-lg shadow-lg transform transition-all active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
                            >
                                {isLogin ? 'Sign In' : 'Create Account'}
                            </button>
                        </form>

                        <div className="text-center pt-4">
                            <p className="text-gray-600 text-sm">
                                {isLogin ? "Don't have an account?" : "Already have an account?"}
                                <button
                                    onClick={() => {
                                        setIsLogin(!isLogin);
                                        setError('');
                                    }}
                                    className="ml-2 font-bold text-blue-600 hover:text-blue-700 transition-colors"
                                >
                                    {isLogin ? 'Register Now' : 'Sign In'}
                                </button>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Auth;
