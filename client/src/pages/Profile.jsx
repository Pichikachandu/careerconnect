import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import StudentLayout from '../components/StudentLayout';
import { User, Mail, Phone, MapPin, Briefcase, Camera, Save, Shield, MoreHorizontal, Settings, Bell, Calendar, Award, Star, Activity, Sparkles } from 'lucide-react';

const Profile = ({ role }) => {
    // role: 'student', 'admin', 'company'
    const navigate = useNavigate();
    const [isEditing, setIsEditing] = useState(false);
    const [userData, setUserData] = useState(null);
    const [activeTab, setActiveTab] = useState('overview');
    const [uploading, setUploading] = useState(false);

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('profilePicture', file);

        setUploading(true);
        try {
            const res = await axios.post(`http://localhost:3000/students/${userData.username}/upload-photo`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setUserData({ ...userData, profilePicture: res.data.profilePicture });
            localStorage.setItem('user', JSON.stringify({ ...userData, profilePicture: res.data.profilePicture }));
            alert('Profile picture updated successfully!');
        } catch (error) {
            console.error('Upload failed', error);
            alert('Failed to upload image. Check server logs.');
        } finally {
            setUploading(false);
        }
    };

    useEffect(() => {
        const fetchUserData = async () => {
            if (role === 'student') {
                const storedUser = JSON.parse(localStorage.getItem('user'));
                if (storedUser && storedUser.username) {
                    try {
                        const res = await axios.get(`http://localhost:3000/students/${storedUser.username}`);
                        setUserData(res.data);
                    } catch (err) {
                        console.error("Failed to fetch profile", err);
                        setUserData(storedUser); // Fallback
                    }
                }
            } else if (role === 'admin') {
                const storedAdmin = JSON.parse(localStorage.getItem('adminData'));
                setUserData(storedAdmin);
            } else if (role === 'company') {
                const storedCompany = JSON.parse(localStorage.getItem('companyData'));
                setUserData(storedCompany);
            }
        };

        fetchUserData();
    }, [role, navigate]);

    if (!userData) return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
    );

    const handleSave = async () => {
        setIsEditing(false);
        if (role === 'student') {
            try {
                await axios.put(`http://localhost:3000/students/${userData.username}`, userData);
                localStorage.setItem('user', JSON.stringify(userData)); // Sync local
                alert("Profile updated successfully!");
            } catch (err) {
                console.error(err);
                alert("Failed to update profile.");
            }
        }
        else if (role === 'admin') {
            try {
                const res = await axios.put(`http://localhost:3000/admin/${userData.username}`, userData);
                localStorage.setItem('adminData', JSON.stringify(res.data)); // Sync updated data
                alert("Profile updated successfully!");
            } catch (err) {
                console.error(err);
                alert("Failed to update profile.");
            }
        }
        else if (role === 'company') {
            localStorage.setItem('companyData', JSON.stringify(userData));
            alert("Profile updated successfully!");
        }
    }

    return (
        <StudentLayout>
            <div className="bg-slate-50 font-sans min-h-screen pb-10 flex flex-col">

                {/* Premium Floating Hero Section (Matches TestSelection & ResumeScanner) */}
                <div className="relative bg-[#0F172A] text-white py-12 px-8 rounded-3xl mx-4 mt-4 overflow-hidden shadow-2xl shrink-0">
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/40 via-blue-900/20 to-slate-900 z-0"></div>
                    {/* Decorative Mesh Gradients */}
                    <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-indigo-600/20 rounded-full blur-[120px] -mr-40 -mt-40 mix-blend-screen animate-pulse-slow"></div>
                    <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[100px] -ml-20 -mb-20 mix-blend-screen animate-pulse-slow"></div>

                    <div className="relative z-10 max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
                        <div className="text-center md:text-left">
                            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-400/20 text-indigo-300 text-xs font-bold uppercase tracking-wider mb-4 animate-slide-up">
                                <Sparkles size={14} className="text-yellow-400" /> Student Profile
                            </div>
                            <h1 className="text-3xl md:text-5xl font-extrabold mb-2 tracking-tight animate-slide-up animation-delay-100">
                                Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">{userData.name?.split(' ')[0]}</span>
                            </h1>
                            <p className="text-slate-400 font-medium animate-slide-up animation-delay-200">
                                Manage your personal details, academic progress, and security settings.
                            </p>
                        </div>

                        <div className="flex gap-3 animate-slide-up animation-delay-200">
                            <button className="p-3 bg-white/5 hover:bg-white/10 text-white rounded-xl backdrop-blur-md transition-all text-sm font-bold flex items-center gap-2 border border-white/10 hover:border-white/20">
                                <Settings size={20} />
                            </button>
                            <button className="p-3 bg-white/5 hover:bg-white/10 text-white rounded-xl backdrop-blur-md transition-all text-sm font-bold flex items-center gap-2 border border-white/10 hover:border-white/20 relative">
                                <Bell size={20} />
                                <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full border border-[#0F172A]"></span>
                            </button>
                        </div>
                    </div>
                </div>

                <main className="w-full max-w-7xl mx-auto px-4 py-8 relative z-20 flex-grow">
                    <div className="flex flex-col lg:flex-row gap-8">

                        {/* Sidebar / Profile Card */}
                        <div className="lg:w-1/3 animate-slide-up animation-delay-300">
                            <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden sticky top-6">
                                <div className="p-8 flex flex-col items-center text-center border-b border-slate-50 relative bg-gradient-to-b from-white to-slate-50/50">
                                    <div className="relative mb-6 group">
                                        <div className="w-40 h-40 rounded-full p-1.5 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 shadow-2xl relative">
                                            <div className="w-full h-full rounded-full bg-slate-100 overflow-hidden flex items-center justify-center border-4 border-white relative">
                                                {uploading ? (
                                                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-10">
                                                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                                                    </div>
                                                ) : null}
                                                {userData.profilePicture ? (
                                                    <img src={userData.profilePicture} alt="Profile" className="w-full h-full object-cover" />
                                                ) : (
                                                    <span className="text-5xl font-bold text-slate-300">{userData.name?.charAt(0).toUpperCase() || 'U'}</span>
                                                )}
                                            </div>
                                        </div>
                                        {role === 'student' && (
                                            <>
                                                <input
                                                    type="file"
                                                    id="profile-upload"
                                                    accept="image/*"
                                                    className="hidden"
                                                    onChange={handleImageUpload}
                                                />
                                                <label htmlFor="profile-upload" className="absolute bottom-2 right-2 p-3 bg-indigo-600 text-white rounded-full shadow-lg hover:bg-indigo-700 transition-all cursor-pointer hover:scale-110 active:scale-95 z-20">
                                                    <Camera size={18} />
                                                </label>
                                            </>
                                        )}
                                    </div>

                                    <h1 className="text-2xl font-bold text-slate-900 mb-1 tracking-tight">{userData.name || userData.username}</h1>
                                    <p className="text-slate-500 font-medium mb-5 flex items-center justify-center gap-1.5">
                                        <Briefcase size={16} className="text-indigo-500" />
                                        {role === 'student' ? userData.department : role === 'admin' ? 'Administrator' : 'Recruiter'}
                                    </p>

                                    <div className="flex items-center gap-2 mb-8">
                                        <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold rounded-full border border-emerald-200 uppercase tracking-wide flex items-center gap-1">
                                            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div> Active
                                        </span>
                                        <span className="px-3 py-1 bg-indigo-50 text-indigo-700 text-xs font-bold rounded-full border border-indigo-100 uppercase tracking-wide">
                                            {role}
                                        </span>
                                    </div>

                                    <div className="w-full grid grid-cols-3 gap-2 py-4 border-t border-slate-100">
                                        <div className="text-center group cursor-pointer">
                                            <div className="text-xl font-extrabold text-slate-800 group-hover:text-indigo-600 transition-colors">12</div>
                                            <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Projects</div>
                                        </div>
                                        <div className="text-center border-x border-slate-100 group cursor-pointer">
                                            <div className="text-xl font-extrabold text-slate-800 group-hover:text-indigo-600 transition-colors">85%</div>
                                            <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Score</div>
                                        </div>
                                        <div className="text-center group cursor-pointer">
                                            <div className="text-xl font-extrabold text-slate-800 group-hover:text-indigo-600 transition-colors">5</div>
                                            <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Badges</div>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-8 bg-slate-50/50 space-y-5">
                                    <SideItem icon={Mail} label="Email" value={userData.email} />
                                    <SideItem icon={Phone} label="Phone" value={userData.phone} />
                                    <SideItem icon={MapPin} label="Location" value={userData.city || 'Not Updated'} />
                                    <SideItem icon={Calendar} label="Joined" value={userData.createdAt ? new Date(userData.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'Sept 2023'} />
                                </div>
                            </div>
                        </div>

                        {/* Main Content Area */}
                        <div className="lg:w-2/3 space-y-8 animate-slide-up animation-delay-400">

                            {/* Tab Navigation */}
                            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-1.5 flex gap-1.5 overflow-x-auto sticky top-6 z-10">
                                <TabButton active={activeTab === 'overview'} onClick={() => setActiveTab('overview')} icon={User}>Overview</TabButton>
                                <TabButton active={activeTab === 'activity'} onClick={() => setActiveTab('activity')} icon={Activity}>Activity</TabButton>
                                <TabButton active={activeTab === 'achievements'} onClick={() => setActiveTab('achievements')} icon={Award}>Achievements</TabButton>
                                <TabButton active={activeTab === 'security'} onClick={() => setActiveTab('security')} icon={Shield}>Security</TabButton>
                            </div>

                            {/* Profile Edit Form */}
                            {activeTab === 'overview' && (
                                <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
                                    <div className="px-8 py-6 border-b border-slate-50 flex justify-between items-center bg-gradient-to-r from-white to-slate-50/50">
                                        <div>
                                            <h2 className="text-lg font-bold text-slate-800">Profile Information</h2>
                                            <p className="text-sm text-slate-500">Manage your personal information and preferences.</p>
                                        </div>

                                        {isEditing ? (
                                            <div className="flex gap-3">
                                                <button onClick={() => setIsEditing(false)} className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-xl font-bold transition">Cancel</button>
                                                <button onClick={handleSave} className="px-5 py-2 text-sm bg-indigo-600 text-white rounded-xl font-bold shadow-lg shadow-indigo-500/30 hover:bg-indigo-700 transition flex items-center gap-2 transform active:scale-95">
                                                    <Save size={16} /> Save Changes
                                                </button>
                                            </div>
                                        ) : (
                                            <button onClick={() => setIsEditing(true)} className="px-4 py-2 text-sm bg-white border border-slate-200 text-slate-700 rounded-xl font-bold shadow-sm hover:bg-slate-50 transition flex items-center gap-2">
                                                Edit Profile <MoreHorizontal size={16} />
                                            </button>
                                        )}
                                    </div>

                                    <div className="p-8">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-8">
                                            <ReadOnlyField label="User ID" value={`#${role.toUpperCase()}_001`} />
                                            <EditableField
                                                label="Username"
                                                value={userData.username}
                                                isEditing={isEditing}
                                                onChange={(val) => setUserData({ ...userData, username: val })}
                                            />
                                            <EditableField
                                                label="Full Name"
                                                value={userData.name}
                                                isEditing={isEditing}
                                                onChange={(val) => setUserData({ ...userData, name: val })}
                                            />
                                            <EditableField
                                                label="Email Address"
                                                value={userData.email}
                                                isEditing={isEditing}
                                                onChange={(val) => setUserData({ ...userData, email: val })}
                                            />
                                            <EditableField
                                                label="Phone Number"
                                                value={userData.phone}
                                                isEditing={isEditing}
                                                onChange={(val) => setUserData({ ...userData, phone: val })}
                                            />
                                            <EditableField
                                                label="Location"
                                                value={userData.city}
                                                isEditing={isEditing}
                                                onChange={(val) => setUserData({ ...userData, city: val })}
                                            />

                                            {role === 'student' && (
                                                <>
                                                    <EditableField
                                                        label="Department"
                                                        value={userData.department}
                                                        isEditing={isEditing}
                                                        onChange={(val) => setUserData({ ...userData, department: val })}
                                                    />
                                                    <EditableField
                                                        label="Gender"
                                                        value={userData.gender}
                                                        isEditing={isEditing}
                                                        onChange={(val) => setUserData({ ...userData, gender: val })}
                                                    />
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab !== 'overview' && (
                                <div className="bg-white rounded-3xl shadow-xl border border-slate-100 p-16 text-center">
                                    <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                                        <Star size={40} className="text-slate-300" />
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-800 mb-2">Coming Soon</h3>
                                    <p className="text-slate-500 max-w-sm mx-auto">This section is currently under development. Check back later for updates!</p>
                                </div>
                            )}
                        </div>
                    </div>
                </main>
            </div>
        </StudentLayout>
    );
};

// Helper Components
const SideItem = ({ icon: Icon, label, value }) => (
    <div className="flex items-center gap-4 group">
        <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300">
            <Icon size={18} />
        </div>
        <div className="min-w-0">
            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider mb-0.5">{label}</p>
            <p className="text-slate-800 font-semibold truncate text-sm">{value || 'N/A'}</p>
        </div>
    </div>
);

const TabButton = ({ active, onClick, icon: Icon, children }) => (
    <button
        onClick={onClick}
        className={`flex-1 py-3 px-4 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 ${active ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/25' : 'text-slate-500 hover:bg-slate-50 hover:text-indigo-600'}`}
    >
        <Icon size={16} /> {children}
    </button>
);

const EditableField = ({ label, value, isEditing, onChange }) => (
    <div className="space-y-2.5">
        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block pl-1">{label}</label>
        {isEditing ? (
            <input
                type="text"
                value={value || ''}
                onChange={(e) => onChange(e.target.value)}
                className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:bg-white outline-none transition-all text-sm font-medium text-slate-900 shadow-sm"
            />
        ) : (
            <div className="p-3.5 bg-slate-50/50 border border-transparent rounded-xl text-sm font-medium text-slate-700">
                {value || 'Not set'}
            </div>
        )}
    </div>
);

const ReadOnlyField = ({ label, value }) => (
    <div className="space-y-2.5">
        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block pl-1">{label}</label>
        <div className="p-3.5 bg-slate-100/50 border border-transparent rounded-xl text-sm font-semibold text-slate-500 select-none cursor-not-allowed flex items-center gap-2">
            <Shield size={14} className="text-slate-400" /> {value}
        </div>
    </div>
);

export default Profile;
