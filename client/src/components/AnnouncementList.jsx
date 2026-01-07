import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Plus, Trash2, Calendar, Megaphone, Briefcase, Clock, ChevronRight, X, Building2, MapPin, IndianRupee, GraduationCap, Link as LinkIcon, Edit, AlertCircle, RefreshCw, Send } from 'lucide-react';

const formatTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now - date) / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return days === 1 ? '1 day ago' : `${days} days ago`;
    if (hours > 0) return hours === 1 ? '1 hour ago' : `${hours} hours ago`;
    if (minutes > 0) return minutes === 1 ? '1 minute ago' : `${minutes} minutes ago`;
    return 'Just now';
};

const AnnouncementList = ({ role, searchQuery = '', filterType = 'all', announcements: announcementsProp, onRefresh, statusFilter = 'active' }) => {
    const isControlled = Array.isArray(announcementsProp);
    const [internalAnnouncements, setInternalAnnouncements] = useState([]);
    const [internalLoading, setInternalLoading] = useState(!isControlled);
    const [showForm, setShowForm] = useState(false);
    const navigate = useNavigate();

    const displayAnnouncements = isControlled ? announcementsProp : internalAnnouncements;
    const loading = isControlled ? false : internalLoading;

    // Edit, Cancel, Reschedule State
    const [editingId, setEditingId] = useState(null);
    const [isRescheduling, setIsRescheduling] = useState(false);
    const [cancelModalOpen, setCancelModalOpen] = useState(false);
    const [selectedDriveId, setSelectedDriveId] = useState(null);
    const [cancelReasonText, setCancelReasonText] = useState('');

    const [type, setType] = useState('normal');
    const [formData, setFormData] = useState({
        title: '', content: '', company: '', role: '', package: '', location: '', date: '', batch: '', eligibility: '', applyLink: ''
    });

    const fetchAnnouncements = async () => {
        if (isControlled) {
            if (onRefresh) onRefresh();
            return;
        }
        setInternalLoading(true);
        try {
            const res = await axios.get('http://localhost:3000/announcements?limit=50');
            const data = Array.isArray(res.data) ? res.data : (res.data.data || []);
            setInternalAnnouncements(data);
        } catch (error) {
            console.error('Error fetching announcements:', error);
            setInternalAnnouncements([]);
        } finally {
            setInternalLoading(false);
        }
    };

    useEffect(() => {
        if (!isControlled) fetchAnnouncements();
    }, [isControlled]);

    const handleDelete = async (e, id) => {
        e.stopPropagation();
        if (!window.confirm('Are you sure you want to delete this announcement?')) return;
        try {
            await axios.delete(`http://localhost:3000/announcements/${id}`);
            fetchAnnouncements();
        } catch (error) {
            alert('Error deleting announcement');
        }
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        const url = role === 'company' ? 'http://localhost:3000/company/announcements' : 'http://localhost:3000/announcements';

        let payload = { ...formData, type };

        // If rescheduling, force status to Active and clear cancel reason
        if (isRescheduling) {
            payload.status = 'Active';
            payload.cancelReason = ''; // Clear reason
        }

        try {
            if (editingId) {
                // Determine if we need to call PUT (update details) or also PATCH (status)?
                // Assuming PUT updates all fields passed in body.
                // If backend PUT only updates fields in payload, this works.
                // If isRescheduling, we want to update status too. 
                // Let's send a separate status update if needed, OR assume PUT handles it.
                // For safety, if rescheduling, I'll explicitly reset status via the status endpoint too? 
                // Or just hope PUT schema allows status. 
                // Given previous context, PUT usually updates content. 
                // Let's rely on PUT. If it fails to update status, we'll fix backend.
                // Actually, let's do both to be safe if rescheduling.

                await axios.put(`http://localhost:3000/announcements/${editingId}`, payload);
                if (isRescheduling) {
                    await axios.patch(`http://localhost:3000/announcements/${editingId}/status`, { status: 'Active', cancelReason: '' });
                }

                alert(isRescheduling ? 'Drive Rescheduled & Activated!' : 'Announcement updated!');
            } else {
                await axios.post(url, payload);
                alert('Announcement created!');
            }
            setShowForm(false);
            setEditingId(null);
            setIsRescheduling(false);
            setFormData({
                title: '', content: '', company: '', role: '', package: '', location: '', date: '', batch: '', eligibility: '', applyLink: ''
            });
            fetchAnnouncements();
        } catch (error) {
            alert('Error saving announcement');
        }
    };

    const handleEdit = (ann) => {
        setEditingId(ann._id);
        setIsRescheduling(false);
        setType(ann.type);
        setFormData({
            title: ann.title || '', content: ann.content || '', company: ann.company || '', role: ann.role || '',
            package: ann.package || '', location: ann.location || '', date: ann.date ? ann.date.split('T')[0] : '', // Fix date format for input
            batch: ann.batch || '', eligibility: ann.eligibility || '', applyLink: ann.applyLink || ''
        });
        setShowForm(true);
    };

    const handleReschedule = (ann) => {
        setEditingId(ann._id);
        setIsRescheduling(true);
        setType(ann.type);
        setFormData({
            title: ann.title || '', content: ann.content || '', company: ann.company || '', role: ann.role || '',
            package: ann.package || '', location: ann.location || '', date: '', // Clear date to force pick? Or keep old? Let's keep old but focus on it? 
            // Better to keep old date so they see what it was.
            date: ann.date ? ann.date.split('T')[0] : '',
            batch: ann.batch || '', eligibility: ann.eligibility || '', applyLink: ann.applyLink || ''
        });
        setShowForm(true);
    };

    const handleStatusUpdate = async (id, status, reason = '') => {
        if (status === 'Ended' && !window.confirm('Are you sure you want to END this drive? It will move to history.')) return;
        try {
            await axios.patch(`http://localhost:3000/announcements/${id}/status`, { status, cancelReason: reason });
            setCancelModalOpen(false);
            setCancelReasonText('');
            fetchAnnouncements();
        } catch (error) {
            console.error(error);
            alert('Failed to update status');
        }
    };

    const canManage = role === 'admin' || role === 'company';

    const filteredAnnouncements = (Array.isArray(displayAnnouncements) ? displayAnnouncements : []).filter(ann => {
        const matchesType = filterType === 'all' || ann.type === filterType;
        const matchesStatus = statusFilter === 'all' ? true : statusFilter === 'active'
            ? (!ann.status || ann.status === 'Active' || ann.status === 'Cancelled')
            : (ann.status === 'Ended');

        const query = searchQuery.toLowerCase();
        const matchesSearch = [ann.title, ann.company, ann.role, ann.location].some(field => field?.toLowerCase().includes(query));
        return matchesType && matchesSearch && matchesStatus;
    });

    if (loading) return (
        <div className="flex flex-col items-center justify-center py-12">
            <div className="w-12 h-12 border-4 border-slate-200 border-t-indigo-600 rounded-full animate-spin"></div>
            <p className="text-slate-500 mt-4 font-medium animate-pulse">Loading updates...</p>
        </div>
    );

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div></div>
                {canManage && (
                    <button
                        onClick={() => { setShowForm(true); setEditingId(null); setIsRescheduling(false); }}
                        className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl flex items-center gap-2 hover:bg-indigo-700 transition-all font-bold shadow-lg shadow-indigo-500/30 transform active:scale-95"
                    >
                        <Plus size={20} /> New Post
                    </button>
                )}
            </div>

            {showForm && createPortal(
                <div className="fixed inset-0 bg-slate-900/60 z-[100] flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-200 overflow-y-auto">
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-200 my-8">
                        <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                            <div>
                                <h3 className="text-xl font-extrabold text-slate-800">
                                    {editingId ? (isRescheduling ? 'Reschedule/Restart Drive' : 'Edit Announcement') : 'Create Announcement'}
                                </h3>
                                <p className="text-sm text-slate-500">
                                    {isRescheduling ? 'Update the date and details to reactivate this drive.' : 'Share news or a new job opportunity.'}
                                </p>
                            </div>
                            <button onClick={() => setShowForm(false)} className="p-2 hover:bg-white hover:text-red-500 rounded-xl transition-all shadow-sm border border-transparent hover:border-slate-200">
                                <X size={20} className="text-slate-400" />
                            </button>
                        </div>

                        <form onSubmit={handleCreate} className="p-8 space-y-6 max-h-[80vh] overflow-y-auto scrollbar-hide">
                            {!editingId && (
                                <div className="flex bg-slate-100 p-1.5 rounded-xl mb-6">
                                    <button type="button" onClick={() => setType('normal')} className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${type === 'normal' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
                                        General Update
                                    </button>
                                    <button type="button" onClick={() => setType('drive')} className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${type === 'drive' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
                                        Campus Drive
                                    </button>
                                </div>
                            )}

                            {type === 'normal' ? (
                                <>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 ml-1">Title</label>
                                        <input
                                            type="text"
                                            value={formData.title}
                                            onChange={e => setFormData({ ...formData, title: e.target.value })}
                                            className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none font-bold text-slate-800"
                                            placeholder="e.g. New Feature Release v2.0"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 ml-1">Content</label>
                                        <textarea
                                            value={formData.content}
                                            onChange={e => setFormData({ ...formData, content: e.target.value })}
                                            className="w-full h-32 p-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none font-medium text-slate-800 resize-none"
                                            rows="4"
                                            placeholder="Describe the update in detail..."
                                            required
                                        />
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div className="grid grid-cols-2 gap-5">
                                        <div>
                                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 ml-1">Company Name</label>
                                            <div className="relative">
                                                <Building2 className="absolute left-3.5 top-3.5 text-slate-400" size={18} />
                                                <input
                                                    type="text"
                                                    value={formData.company}
                                                    onChange={e => setFormData({ ...formData, company: e.target.value })}
                                                    className="w-full pl-10 p-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none font-bold text-slate-800"
                                                    placeholder="e.g. Google"
                                                    required
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 ml-1">Job Role</label>
                                            <div className="relative">
                                                <Briefcase className="absolute left-3.5 top-3.5 text-slate-400" size={18} />
                                                <input
                                                    type="text"
                                                    value={formData.role}
                                                    onChange={e => setFormData({ ...formData, role: e.target.value })}
                                                    className="w-full pl-10 p-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none font-bold text-slate-800"
                                                    placeholder="e.g. Software Engineer"
                                                    required
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-5">
                                        <div>
                                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 ml-1">Package</label>
                                            <div className="relative">
                                                <IndianRupee className="absolute left-3.5 top-3.5 text-slate-400" size={18} />
                                                <input
                                                    type="text"
                                                    value={formData.package}
                                                    onChange={e => setFormData({ ...formData, package: e.target.value })}
                                                    className="w-full pl-10 p-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none font-bold text-slate-800"
                                                    placeholder="e.g. 12 LPA"
                                                    required
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label className={`block text-xs font-bold uppercase tracking-wider mb-2 ml-1 ${isRescheduling ? 'text-indigo-600 animate-pulse' : 'text-slate-500'}`}>
                                                {isRescheduling ? 'New Drive Date' : 'Drive Date'}
                                            </label>
                                            <div className="relative">
                                                <Calendar className={`absolute left-3.5 top-3.5 ${isRescheduling ? 'text-indigo-500' : 'text-slate-400'}`} size={18} />
                                                <input
                                                    type="date"
                                                    value={formData.date}
                                                    onChange={e => setFormData({ ...formData, date: e.target.value })}
                                                    className={`w-full pl-10 p-3.5 bg-slate-50 border rounded-xl focus:ring-2 outline-none font-medium text-slate-800 ${isRescheduling ? 'border-indigo-300 ring-2 ring-indigo-500/20' : 'border-slate-200 focus:ring-emerald-500'}`}
                                                    required
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-5 mt-5">
                                        <div>
                                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 ml-1">Job Location</label>
                                            <div className="relative">
                                                <MapPin className="absolute left-3.5 top-3.5 text-slate-400" size={18} />
                                                <input type="text" value={formData.location} onChange={e => setFormData({ ...formData, location: e.target.value })} className="w-full pl-10 p-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none font-medium text-slate-800" placeholder="e.g. Bangalore" required />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 ml-1">Eligible Batch</label>
                                            <div className="relative">
                                                <GraduationCap className="absolute left-3.5 top-3.5 text-slate-400" size={18} />
                                                <input type="text" value={formData.batch} onChange={e => setFormData({ ...formData, batch: e.target.value })} className="w-full pl-10 p-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none font-medium text-slate-800" placeholder="e.g. 2024, 2025" required />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-5">
                                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 ml-1">Eligibility Criteria</label>
                                        <textarea value={formData.eligibility} onChange={e => setFormData({ ...formData, eligibility: e.target.value })} className="w-full h-24 p-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none font-medium text-slate-800 resize-none" rows="3" placeholder="e.g. BE/B.Tech (CS/IT) with 60% aggregate" />
                                    </div>

                                    <div className="mt-5">
                                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 ml-1">Application Link</label>
                                        <div className="relative">
                                            <LinkIcon className="absolute left-3.5 top-3.5 text-slate-400" size={18} />
                                            <input type="url" value={formData.applyLink} onChange={e => setFormData({ ...formData, applyLink: e.target.value })} className="w-full pl-10 p-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none font-medium text-blue-600 underline" placeholder="https://..." />
                                        </div>
                                    </div>

                                    <div className="mt-5">
                                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 ml-1">Additional Note (Title)</label>
                                        <input type="text" placeholder="e.g. Important Note: Laptop mandatory" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none font-bold text-slate-800" />
                                    </div>

                                    <div className="mt-5">
                                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 ml-1">Full Description</label>
                                        <textarea value={formData.content} onChange={e => setFormData({ ...formData, content: e.target.value })} className="w-full h-24 p-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none font-medium text-slate-800 resize-none" rows="3" placeholder="Provide complete details about the drive process, rounds, etc." />
                                    </div>
                                </>
                            )}
                            <div className="pt-4">
                                <button type="submit" className={`w-full py-4 text-white font-bold rounded-xl transition-all shadow-lg transform active:scale-[0.98] ${type === 'drive' ? 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-emerald-500/30' : 'bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 shadow-indigo-500/30'}`}>
                                    {isRescheduling ? 'Reschedule & Activiate Drive' : (editingId ? 'Update Announcement' : (type === 'drive' ? 'Publish Campus Drive' : 'Post Update'))}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>, document.body
            )}

            {/* Cancel Modal */}
            {/* Cancel Modal */}
            {cancelModalOpen && createPortal(
                <div className="fixed inset-0 z-[105] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setCancelModalOpen(false)}></div>
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md relative z-10 p-6 animate-in zoom-in-95 duration-200">
                        <h3 className="text-xl font-bold text-slate-800 mb-2">Cancel or Reschedule Drive</h3>
                        <p className="text-slate-500 text-sm mb-4">Please provide a reason. This will be visible to students.</p>
                        <textarea
                            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-red-500 h-32 resize-none font-medium"
                            placeholder="Reason (e.g. Postponed...)"
                            value={cancelReasonText}
                            onChange={e => setCancelReasonText(e.target.value)}
                        />
                        <div className="flex justify-end gap-3 mt-4">
                            <button onClick={() => setCancelModalOpen(false)} className="px-4 py-2 text-slate-600 font-bold hover:bg-slate-50 rounded-lg">Back</button>
                            <button
                                onClick={() => handleStatusUpdate(selectedDriveId, 'Cancelled', cancelReasonText)}
                                className="px-4 py-2 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 shadow-lg shadow-red-500/30"
                                disabled={!cancelReasonText.trim()}
                            >
                                Confirm Cancel
                            </button>
                        </div>
                    </div>
                </div>, document.body
            )}

            <div className="grid gap-4">
                {filteredAnnouncements.length === 0 ? (
                    <div className="text-center py-20 bg-slate-50 rounded-3xl border border-dashed border-slate-200">
                        <div className="w-20 h-20 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Megaphone size={40} />
                        </div>
                        <h3 className="text-xl font-bold text-slate-700">No Announcements Found</h3>
                        <p className="text-slate-500 max-w-sm mx-auto mt-2">Try adjusting your filters.</p>
                    </div>
                ) : (
                    filteredAnnouncements.map(ann => {
                        const isDrive = ann.type === 'drive';
                        const isActive = !ann.status || ann.status === 'Active';
                        const isCancelled = ann.status === 'Cancelled';
                        const isEnded = ann.status === 'Ended';

                        return (
                            <div
                                key={ann._id}
                                onClick={() => navigate(`/announcement/${ann._id}`)}
                                className={`group relative bg-white rounded-2xl p-6 border shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer 
                                ${isDrive
                                        ? (isCancelled
                                            ? 'border-red-100 ring-1 ring-red-50'
                                            : (isEnded
                                                ? 'border-slate-200 ring-1 ring-slate-50 bg-slate-50/30'
                                                : 'border-l-4 border-l-emerald-500'))
                                        : 'border-slate-100'}`}
                            >
                                <div className="absolute top-6 right-6 flex gap-2" onClick={e => e.stopPropagation()}>
                                    {/* Status Badge */}
                                    {ann.status && ann.status !== 'Active' && (
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${isEnded ? 'bg-slate-200 text-slate-600' : 'bg-red-100 text-red-600'}`}>
                                            {ann.status}
                                        </span>
                                    )}

                                    {/* Admin Actions */}
                                    {role === 'admin' && (
                                        <>
                                            {/* Reschedule for Cancelled/Ended */}
                                            {(isCancelled || isEnded) && (
                                                <button
                                                    onClick={() => handleReschedule(ann)}
                                                    className="p-2 text-indigo-500 hover:text-white hover:bg-indigo-600 rounded-lg transition-all shadow-sm bg-indigo-50"
                                                    title={isEnded ? "Restart Drive" : "Reschedule Drive"}
                                                >
                                                    <RefreshCw size={18} />
                                                </button>
                                            )}

                                            {/* Active Drive Actions */}
                                            {(isActive || isCancelled) && (
                                                <button
                                                    onClick={() => handleEdit(ann)}
                                                    className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-slate-50 rounded-lg transition-all"
                                                    title="Edit Details"
                                                >
                                                    <Edit size={18} />
                                                </button>
                                            )}

                                            {isDrive && isActive && (
                                                <>
                                                    <button
                                                        onClick={() => handleStatusUpdate(ann._id, 'Ended')}
                                                        className="p-2 text-slate-400 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-all"
                                                        title="End Drive"
                                                    >
                                                        <Clock size={18} />
                                                    </button>
                                                    <button
                                                        onClick={() => { setSelectedDriveId(ann._id); setCancelModalOpen(true); }}
                                                        className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                                                        title="Cancel Drive"
                                                    >
                                                        <X size={18} />
                                                    </button>
                                                </>
                                            )}

                                            {/* Delete for all */}
                                            <button
                                                onClick={(e) => handleDelete(e, ann._id)}
                                                className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </>
                                    )}
                                </div>

                                {/* Card Body */}
                                <div className="flex items-start gap-5">
                                    <div className={`mt-1 w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 border shadow-sm transition-colors 
                                        ${isDrive
                                            ? (isCancelled
                                                ? 'bg-red-50 text-red-500 border-red-100'
                                                : (isEnded
                                                    ? 'bg-slate-100 text-slate-500 border-slate-200 grayscale'
                                                    : 'bg-emerald-50 text-emerald-600 border-emerald-100'))
                                            : 'bg-indigo-50 text-indigo-600 border-indigo-100'}`}>
                                        {isDrive ? (isCancelled ? <AlertCircle size={28} /> : (isEnded ? <Clock size={28} /> : <Building2 size={28} />)) : <Megaphone size={28} />}
                                    </div>
                                    <div className="flex-1">

                                        <div className="flex flex-wrap items-center gap-2 mb-2">
                                            <span className={`px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${isDrive ? 'bg-emerald-100 text-emerald-700' : 'bg-indigo-100 text-indigo-700'}`}>
                                                {isDrive ? 'Campus Drive' : 'General Update'}
                                            </span>
                                            <div className="flex items-center gap-1 text-slate-400 text-xs font-semibold">
                                                <Calendar size={12} />
                                                <span>{new Date(ann.createdAt).toLocaleDateString()}</span>
                                            </div>
                                        </div>

                                        {isDrive ? (
                                            <div>
                                                <h3 className={`text-xl font-extrabold mb-1 transition-colors ${isCancelled ? 'text-red-800 line-through' : 'text-slate-900 group-hover:text-emerald-600'}`}>
                                                    {ann.company} - {ann.role}
                                                </h3>
                                                <p className="text-slate-500 font-medium text-sm mb-4">{ann.title && `(${ann.title})`}</p>

                                                {/* Logic to show cancel reason */}
                                                {(isCancelled && ann.cancelReason) && (
                                                    <div className="mb-4 bg-red-50 border border-red-100 p-3 rounded-lg text-red-700 text-sm font-medium flex items-start gap-2">
                                                        <div className="mt-0.5 shrink-0"><AlertCircle size={16} /></div>
                                                        <div><span className="font-bold">Cancelled:</span> {ann.cancelReason}</div>
                                                    </div>
                                                )}

                                                <button className={`font-bold text-sm flex items-center gap-1 hover:underline mt-2 ${isCancelled ? 'text-red-500' : 'text-emerald-600'}`}>
                                                    View Full Details <ChevronRight size={16} />
                                                </button>
                                            </div>
                                        ) : (
                                            <div>
                                                <h3 className="text-lg font-bold text-slate-800 mb-2 group-hover:text-indigo-600 transition-colors">
                                                    {ann.title}
                                                </h3>
                                                <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-line mb-4 line-clamp-2">
                                                    {ann.content}
                                                </p>
                                                <button className="text-indigo-600 font-bold text-sm flex items-center gap-1 hover:underline">
                                                    Read More <ChevronRight size={16} />
                                                </button>
                                            </div>
                                        )}

                                        <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-50">
                                            <div className="flex items-center gap-2 text-slate-400 text-xs font-medium">
                                                <Clock size={12} />
                                                <span>{formatTimeAgo(ann.createdAt)}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
};

export default AnnouncementList;
