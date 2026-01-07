import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ChevronLeft, Building2, Megaphone, Calendar, MapPin, IndianRupee, GraduationCap, Link as LinkIcon, Share2, Clock, CheckCircle, AlertCircle, Copy, Check, Briefcase, Globe, ArrowUpRight } from 'lucide-react';
import StudentLayout from '../components/StudentLayout';
import AdminLayout from '../components/AdminLayout';

const formatTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now - date) / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return days === 1 ? '1 day ago' : `${days} days ago`;
    if (hours > 0) return hours === 1 ? '1 hour ago' : `${hours} hours ago`;
    return 'Just now';
};

const AnnouncementDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [announcement, setAnnouncement] = useState(null);
    const [loading, setLoading] = useState(true);
    const [copied, setCopied] = useState(false);

    // Check Role
    const userRole = localStorage.getItem('userRole'); // 'student' | 'admin' | 'company'
    const isAdmin = userRole === 'admin' || userRole === 'company';

    useEffect(() => {
        const fetchDetail = async () => {
            try {
                const res = await axios.get(`http://localhost:3000/announcements/${id}`);
                setAnnouncement(res.data);
            } catch (error) {
                console.error("Error fetching announcement detail:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchDetail();
    }, [id]);

    const handleShare = () => {
        navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleBack = () => {
        if (isAdmin) {
            navigate(userRole === 'company' ? '/dashboard/company' : '/dashboard/admin');
        } else {
            navigate('/announcements');
        }
    };

    // Render Content Wrapper
    const Layout = ({ children }) => {
        if (isAdmin) {
            return <AdminLayout>{children}</AdminLayout>;
        }
        return <StudentLayout>{children}</StudentLayout>;
    };

    if (loading) return (
        <Layout>
            <div className="flex h-[80vh] items-center justify-center">
                <div className="w-12 h-12 border-4 border-slate-200 border-t-indigo-600 rounded-full animate-spin"></div>
            </div>
        </Layout>
    );

    if (!announcement) return (
        <Layout>
            <div className="flex flex-col h-[80vh] items-center justify-center text-center p-6">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                    <AlertCircle size={32} className="text-slate-400" />
                </div>
                <h2 className="text-xl font-bold text-slate-800 mb-2">Content Unavailable</h2>
                <button onClick={handleBack} className="text-indigo-600 font-medium hover:underline">
                    Back to Feed
                </button>
            </div>
        </Layout>
    );

    const isDrive = announcement.type === 'drive';

    return (
        <Layout>
            <div className="bg-slate-50 min-h-screen font-sans pb-12">
                {/* Sticky Header with Actions */}
                <div className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)]">
                    <div className="max-w-6xl mx-auto px-6 py-5">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                            {/* Breadcrumb + Title Combo */}
                            <div className="flex items-start gap-5">
                                <button
                                    onClick={handleBack}
                                    className="mt-1.5 p-2 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors"
                                    title="Go Back"
                                >
                                    <ChevronLeft size={20} />
                                </button>

                                <div>
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className={`px-2.5 py-0.5 rounded-md text-[11px] font-bold uppercase tracking-wider border ${isDrive ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-indigo-50 text-indigo-700 border-indigo-100'}`}>
                                            {isDrive ? 'Campus Drive' : 'Announcement'}
                                        </span>
                                        <span className="text-slate-400 text-xs font-semibold flex items-center gap-1">
                                            <Clock size={12} /> {formatTimeAgo(announcement.createdAt)}
                                        </span>
                                    </div>
                                    <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 leading-tight">
                                        {isDrive ? announcement.role : announcement.title}
                                    </h1>
                                    <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mt-2 text-sm text-slate-600">
                                        {isDrive && <span className="font-bold flex items-center gap-1.5"><Building2 size={16} className="text-indigo-500" /> {announcement.company}</span>}
                                        {isDrive && <span className="font-medium flex items-center gap-1.5"><MapPin size={16} className="text-slate-400" /> {announcement.location}</span>}
                                    </div>
                                </div>
                            </div>

                            {/* Header Actions */}
                            <div className="flex items-center gap-3 pl-14 md:pl-0">
                                <button
                                    onClick={handleShare}
                                    className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold hover:bg-slate-50 transition-colors flex items-center gap-2 text-sm bg-white"
                                >
                                    {copied ? <Check size={16} className="text-emerald-500" /> : <Share2 size={16} />}
                                    {copied ? 'Copied' : 'Share'}
                                </button>
                                {isDrive && announcement.applyLink && !isAdmin && (
                                    (!announcement.status || announcement.status === 'Active') ? (
                                        <a
                                            href={announcement.applyLink}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="px-6 py-2.5 rounded-xl bg-slate-900 text-white font-bold hover:bg-slate-800 transition-all flex items-center gap-2 text-sm shadow-md hover:shadow-lg hover:-translate-y-0.5"
                                        >
                                            Apply Now <ArrowUpRight size={16} />
                                        </a>
                                    ) : (
                                        <button
                                            disabled
                                            className="px-6 py-2.5 rounded-xl bg-slate-100 text-slate-400 font-bold cursor-not-allowed flex items-center gap-2 text-sm border border-slate-200"
                                        >
                                            {announcement.status} <AlertCircle size={16} />
                                        </button>
                                    )
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Content Grid */}
                <div className="max-w-6xl mx-auto px-6 py-8">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                        {/* Left Column: Description (8cols) */}
                        <div className="lg:col-span-8 space-y-6">

                            {/* Status logic */}
                            {(() => {
                                const isActive = !announcement.status || announcement.status === 'Active';
                                const isEnded = announcement.status === 'Ended';
                                const isCancelled = announcement.status === 'Cancelled';

                                return (
                                    <>
                                        {/* Cancellation Alert */}
                                        {isCancelled && announcement.cancelReason && (
                                            <div className="bg-red-50 border border-red-100 rounded-2xl p-6 flex gap-4 animate-in fade-in slide-in-from-top-4">
                                                <div className="p-3 bg-white text-red-600 rounded-full shadow-sm h-fit">
                                                    <AlertCircle size={24} />
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-red-800 text-lg mb-1">Update: Drive Cancelled / Rescheduled</h4>
                                                    <p className="text-red-700 font-medium leading-relaxed">
                                                        {announcement.cancelReason}
                                                    </p>
                                                </div>
                                            </div>
                                        )}

                                        {/* Ended Alert */}
                                        {isEnded && (
                                            <div className="bg-slate-100 border border-slate-200 rounded-2xl p-6 flex gap-4 items-center">
                                                <div className="p-3 bg-white text-slate-500 rounded-full shadow-sm">
                                                    <Clock size={24} />
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-slate-700 text-lg">Drive Ended</h4>
                                                    <p className="text-slate-500 text-sm">This recruitment drive has concluded. Applications are closed.</p>
                                                </div>
                                            </div>
                                        )}
                                    </>
                                );
                            })()}

                            {/* Card 3: Important Note (Drive Only) - Keep existing logic... */}
                            {isDrive && announcement.title && (
                                <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-6 border border-amber-100 border-l-4 border-l-amber-500 shadow-sm flex gap-4">
                                    <AlertCircle className="text-amber-600 shrink-0 mt-1" size={24} />
                                    <div>
                                        <h4 className="font-bold text-amber-900 mb-1">Important Note</h4>
                                        <p className="text-amber-800 text-sm leading-relaxed">{announcement.title}</p>
                                    </div>
                                </div>
                            )}

                            {/* Card for General Announcement Title if not drive - MOVED TOP */}
                            {!isDrive && announcement.title && (
                                <div className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-2xl p-6 border border-indigo-100 border-l-4 border-l-indigo-500 shadow-sm flex gap-4 items-center">
                                    <div className="p-3 bg-white text-indigo-600 rounded-full shadow-sm">
                                        <Megaphone size={24} />
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-indigo-400 uppercase tracking-wider mb-1">Subject</p>
                                        <p className="font-bold text-indigo-900 text-lg">{announcement.title}</p>
                                    </div>
                                </div>
                            )}

                            {/* Card 1: Description */}
                            <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm">
                                <h3 className="text-lg font-extrabold text-slate-900 mb-6 flex items-center gap-2">
                                    <div className="w-1 h-6 bg-indigo-500 rounded-full"></div>
                                    {isDrive ? 'Role Description' : 'Announcement Details'}
                                </h3>
                                <div className="text-slate-600 leading-8 text-[15px] text-justify whitespace-pre-line">
                                    {announcement.content}
                                </div>
                            </div>

                            {/* Card 2: Eligibility (Drive Only) */}
                            {isDrive && announcement.eligibility && (
                                <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm relative overflow-hidden">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
                                    <h3 className="text-lg font-extrabold text-slate-900 mb-6 flex items-center gap-2 relative z-10">
                                        <div className="w-1 h-6 bg-purple-500 rounded-full"></div>
                                        Eligibility Criteria
                                    </h3>
                                    <div className="relative z-10 bg-slate-50/80 rounded-xl p-6 border border-slate-100 text-slate-700 leading-relaxed whitespace-pre-line text-[15px]">
                                        {announcement.eligibility}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Right Column: Meta Sidebar (4cols) */}
                        <div className="lg:col-span-4 space-y-6">
                            {isDrive ? (
                                <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 sticky top-28">
                                    <div className="flex items-center justify-between mb-6">
                                        <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider">Job Overview</h3>
                                        {(!announcement.status || announcement.status === 'Active') && (
                                            <div className="px-2 py-1 bg-emerald-100 text-emerald-700 text-[10px] font-bold uppercase rounded-md flex items-center gap-1">
                                                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span> Active
                                            </div>
                                        )}
                                        {announcement.status === 'Ended' && (
                                            <div className="px-2 py-1 bg-slate-100 text-slate-600 text-[10px] font-bold uppercase rounded-md border border-slate-200">
                                                Ended
                                            </div>
                                        )}
                                        {announcement.status === 'Cancelled' && (
                                            <div className="px-2 py-1 bg-red-100 text-red-700 text-[10px] font-bold uppercase rounded-md border border-red-200">
                                                Cancelled
                                            </div>
                                        )}
                                    </div>

                                    <div className="grid grid-cols-1 gap-5">
                                        <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 hover:border-slate-200 transition-colors">
                                            <div className="flex items-center gap-3 mb-2">
                                                <div className="p-2 bg-white text-indigo-600 rounded-lg shadow-sm border border-slate-100"><IndianRupee size={18} /></div>
                                                <span className="text-xs font-bold text-slate-400 uppercase">Offered CTC</span>
                                            </div>
                                            <p className="text-lg font-extrabold text-slate-900 pl-1">{announcement.package}</p>
                                        </div>

                                        <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 hover:border-slate-200 transition-colors">
                                            <div className="flex items-center gap-3 mb-2">
                                                <div className="p-2 bg-white text-emerald-600 rounded-lg shadow-sm border border-slate-100"><MapPin size={18} /></div>
                                                <span className="text-xs font-bold text-slate-400 uppercase">Location</span>
                                            </div>
                                            <p className="text-lg font-extrabold text-slate-900 pl-1">{announcement.location}</p>
                                        </div>

                                        <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 hover:border-slate-200 transition-colors">
                                            <div className="flex items-center gap-3 mb-2">
                                                <div className="p-2 bg-white text-blue-600 rounded-lg shadow-sm border border-slate-100"><Calendar size={18} /></div>
                                                <span className="text-xs font-bold text-slate-400 uppercase">Drive Date</span>
                                            </div>
                                            <p className="text-lg font-extrabold text-slate-900 pl-1">{new Date(announcement.date).toLocaleDateString(undefined, { dateStyle: 'long' })}</p>
                                        </div>

                                        <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 hover:border-slate-200 transition-colors">
                                            <div className="flex items-center gap-3 mb-2">
                                                <div className="p-2 bg-white text-purple-600 rounded-lg shadow-sm border border-slate-100"><GraduationCap size={18} /></div>
                                                <span className="text-xs font-bold text-slate-400 uppercase">Target Batch</span>
                                            </div>
                                            <p className="text-lg font-extrabold text-slate-900 pl-1">{announcement.batch}</p>
                                        </div>
                                    </div>

                                    <div className="mt-6 pt-6 border-t border-slate-100">
                                        {(!announcement.status || announcement.status === 'Active') ? (
                                            <a
                                                href={announcement.applyLink}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="w-full group block bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-bold py-4 rounded-xl text-center hover:from-indigo-700 hover:to-violet-700 transition-all shadow-lg shadow-indigo-500/20 active:scale-[0.98]"
                                            >
                                                Apply Now
                                                <span className="inline-block transform group-hover:translate-x-1 transition-transform ml-2">→</span>
                                            </a>
                                        ) : (
                                            <button
                                                disabled
                                                className="w-full block bg-slate-100 text-slate-400 font-bold py-4 rounded-xl text-center cursor-not-allowed border border-slate-200"
                                            >
                                                {announcement.status === 'Ended' ? 'Applications Closed' : 'Drive Cancelled'}
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ) : (
                                <div className="bg-indigo-50 rounded-2xl p-6 border border-indigo-100">
                                    <h3 className="text-indigo-900 font-bold mb-2 flex items-center gap-2">
                                        <Megaphone size={18} /> Internal Notice
                                    </h3>
                                    <p className="text-indigo-700 text-sm leading-relaxed">
                                        This is a general announcement from the administration. Please read carefully and take necessary action if required.
                                    </p>
                                </div>
                            )}

                            {/* Support Section */}
                            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                                <h4 className="font-bold text-slate-900 text-sm mb-2">Questions?</h4>
                                <p className="text-sm text-slate-500 mb-4">Contact the placement cell for clarification regarding this post.</p>
                                <button className="text-indigo-600 text-sm font-bold hover:underline flex items-center gap-1">
                                    Contact Support <ArrowUpRight size={14} />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default AnnouncementDetail;
