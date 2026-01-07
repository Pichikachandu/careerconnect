import React, { useState, useEffect } from 'react';
import axios from 'axios';
import StudentLayout from '../../components/StudentLayout';
import { Upload, FileText, CheckCircle, AlertCircle, Loader, Briefcase, Zap, ArrowRight, X, Target, Sparkles, AlertTriangle, History, Clock } from 'lucide-react';

const ResumeScanner = () => {
    const [file, setFile] = useState(null);
    const [jobDescription, setJobDescription] = useState('');
    const [result, setResult] = useState(null);
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(false);
    const [historyLoading, setHistoryLoading] = useState(true);
    const [isHistoryOpen, setIsHistoryOpen] = useState(false);
    const [error, setError] = useState('');

    const user = JSON.parse(localStorage.getItem('user') || '{}');

    useEffect(() => {
        if (user.username) {
            fetchHistory();
        } else {
            setHistoryLoading(false);
        }
    }, []);

    const fetchHistory = async () => {
        try {
            setHistoryLoading(true);
            const res = await axios.get(`http://localhost:3000/api/ats/history/${user.username}`);
            setHistory(res.data);
            // If no active result, show the latest from history
            if (res.data.length > 0 && !result) {
                const latest = res.data[0];
                setJobDescription(latest.jobDescription || '');
                setResult({
                    match_percentage: latest.matchPercentage,
                    summary: latest.summary,
                    missing_keywords: latest.missingKeywords || [],
                    recommendation: latest.recommendation,
                    resumeUrl: latest.resumeUrl,
                    isHistory: true,
                    timestamp: latest.timestamp
                });
            }
        } catch (err) {
            console.error("Failed to fetch ATS history:", err);
        } finally {
            setHistoryLoading(false);
        }
    };

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile && selectedFile.type === 'application/pdf') {
            setFile(selectedFile);
            setError('');
        } else {
            setError('Please upload a valid PDF file.');
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        const droppedFile = e.dataTransfer.files[0];
        if (droppedFile && droppedFile.type === 'application/pdf') {
            setFile(droppedFile);
            setError('');
        } else {
            setError('Please upload a valid PDF file.');
        }
    };

    const handleScan = async () => {
        if (!file || !jobDescription) {
            setError("Please upload a resume and provide a job description.");
            return;
        }

        const formData = new FormData();
        formData.append('resume', file);
        formData.append('jobDescription', jobDescription);

        // Include username for profile persistence
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        if (user.username) {
            formData.append('username', user.username);
        }

        setLoading(true);
        setError('');
        setResult(null);

        try {
            const res = await axios.post('http://localhost:3000/api/ats/scan', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setResult(res.data);
            fetchHistory(); // Refresh history after new scan
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || err.response?.data?.error || "Failed to scan resume. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    // Circular Progress Component
    const CircularProgress = ({ value }) => {
        const radius = 60;
        const circumference = 2 * Math.PI * radius;
        const strokeDashoffset = circumference - (value / 100) * circumference;
        const color = value >= 80 ? '#10b981' : value >= 50 ? '#f59e0b' : '#ef4444'; // emerald-500, amber-500, red-500

        return (
            <div className="relative w-40 h-40 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90 drop-shadow-lg">
                    <circle cx="50%" cy="50%" r={radius} stroke="#f1f5f9" strokeWidth="10" fill="transparent" />
                    <circle
                        cx="50%" cy="50%" r={radius}
                        stroke={color} strokeWidth="10" fill="transparent"
                        strokeDasharray={circumference}
                        strokeDashoffset={strokeDashoffset}
                        strokeLinecap="round"
                        className="transition-all duration-1000 ease-out"
                    />
                </svg>
                <div className="absolute flex flex-col items-center">
                    <span className="text-4xl font-extrabold text-slate-800 tracking-tighter">{value}%</span>
                    <span className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Match</span>
                </div>
            </div>
        );
    };

    return (
        <StudentLayout>
            <div className="font-sans text-slate-900 bg-slate-50 h-full">

                {/* Premium Hero Section */}
                <div className="container mx-auto px-4 py-8 max-w-6xl">
                    <div className="relative bg-[#0F172A] text-white py-14 px-8 rounded-3xl mb-10 overflow-hidden shadow-2xl">
                        <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/40 via-teal-900/20 to-slate-900 z-0"></div>
                        {/* Decorative Mesh Gradients */}
                        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-emerald-600/20 rounded-full blur-[120px] -mr-40 -mt-40 mix-blend-screen animate-pulse-slow"></div>
                        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-teal-600/20 rounded-full blur-[100px] -ml-20 -mb-20 mix-blend-screen animate-pulse-slow"></div>

                        <div className="relative z-10 max-w-4xl mx-auto text-center">
                            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-400/20 text-emerald-300 text-xs font-bold uppercase tracking-wider mb-6 animate-slide-up">
                                <Sparkles size={14} className="text-yellow-400" /> AI-Powered Analysis
                            </div>
                            <h1 className="text-4xl md:text-6xl font-extrabold mb-6 tracking-tight animate-slide-up animation-delay-100 leading-tight">
                                Optimize Your Resume for <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400">Success</span>
                            </h1>
                            <p className="text-lg text-slate-300 max-w-2xl mx-auto font-light leading-relaxed animate-slide-up animation-delay-200 mb-8">
                                Don't let algorithms reject you. Upload your resume and job description to get instant, actionable feedback powered by ultra-fast AI.
                            </p>

                            <button
                                onClick={() => setIsHistoryOpen(true)}
                                className="inline-flex items-center gap-2 px-6 py-2.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 rounded-full text-sm font-bold hover:bg-emerald-500/20 transition-all group animate-slide-up animation-delay-300"
                            >
                                <History size={18} className="group-hover:rotate-[-20deg] transition-transform" />
                                Recent Scan History
                                <span className="bg-emerald-500 text-white text-[10px] px-2 py-0.5 rounded-full ml-1">{history.length}</span>
                            </button>
                        </div>
                    </div>

                    <div className="relative z-20">
                        <div className="grid lg:grid-cols-12 gap-8 items-start">

                            {/* INPUT SECTION (Left Side) */}
                            <div className="lg:col-span-5 space-y-6 animate-slide-up animation-delay-300">

                                {/* 1. Upload Card */}
                                <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-100 hover:shadow-xl transition-shadow duration-300">
                                    <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center text-sm font-bold shadow-sm">1</div>
                                        Upload Resume
                                    </h2>

                                    <div
                                        onDragOver={(e) => e.preventDefault()}
                                        onDrop={handleDrop}
                                        className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 cursor-pointer relative group overflow-hidden ${file ? 'border-emerald-500 bg-emerald-50/40' : 'border-slate-200 hover:border-emerald-400 hover:bg-slate-50'}`}
                                    >
                                        <input
                                            type="file"
                                            accept=".pdf"
                                            onChange={handleFileChange}
                                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                        />

                                        <div className="relative z-0">
                                            {file ? (
                                                <div className="flex flex-col items-center animate-in fade-in zoom-in duration-300">
                                                    <div className="w-16 h-16 bg-white rounded-2xl shadow-sm border border-emerald-100 flex items-center justify-center mb-3">
                                                        <FileText size={32} className="text-emerald-600" />
                                                    </div>
                                                    <p className="font-bold text-slate-800 truncate max-w-full px-4">{file.name}</p>
                                                    <p className="text-xs text-slate-500 mt-1 font-medium bg-slate-100 px-2 py-1 rounded-full inline-block">{(file.size / 1024).toFixed(0)} KB • PDF</p>
                                                    <button
                                                        onClick={(e) => { e.stopPropagation(); setFile(null); }}
                                                        className="mt-4 text-xs bg-red-50 text-red-600 hover:bg-red-100 px-3 py-1.5 rounded-lg font-bold flex items-center gap-1 z-20 relative transition-colors"
                                                    >
                                                        <X size={12} strokeWidth={3} /> REMOVE
                                                    </button>
                                                </div>
                                            ) : (
                                                <div className="flex flex-col items-center">
                                                    <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-sm border border-slate-100">
                                                        <Upload size={28} className="text-slate-400 group-hover:text-emerald-500 transition-colors" />
                                                    </div>
                                                    <p className="font-bold text-slate-700 group-hover:text-emerald-700 transition-colors">Click to upload or drag & drop</p>
                                                    <p className="text-xs text-slate-400 mt-2 font-medium">PDF files only (Max 5MB)</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* 2. Job Description Card */}
                                <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-100 hover:shadow-xl transition-shadow duration-300">
                                    <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center text-sm font-bold shadow-sm">2</div>
                                        Job Description
                                    </h2>
                                    <div className="relative group">
                                        <textarea
                                            className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 h-48 outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all font-mono text-sm resize-none text-slate-700 placeholder:text-slate-400"
                                            placeholder="Paste the full job description here to analyze keyword matching..."
                                            value={jobDescription}
                                            onChange={(e) => setJobDescription(e.target.value)}
                                        ></textarea>
                                        <div className="absolute bottom-3 right-3 text-xs text-slate-400 font-bold bg-white border border-slate-200 px-2 py-1 rounded shadow-sm opacity-60 group-hover:opacity-100 transition-opacity">
                                            {jobDescription.length} chars
                                        </div>
                                    </div>
                                </div>

                                {/* Action Button */}
                                <button
                                    onClick={handleScan}
                                    disabled={loading}
                                    className={`w-full py-4 rounded-xl font-bold text-lg text-white shadow-xl shadow-emerald-500/25 transition-all transform active:scale-[0.98] flex items-center justify-center gap-3
                                    ${loading
                                            ? 'bg-slate-800 cursor-not-allowed opacity-90'
                                            : 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:scale-[1.02] hover:shadow-emerald-500/40'
                                        }`}
                                >
                                    {loading ? (
                                        <>
                                            <Loader className="animate-spin text-emerald-400" size={24} />
                                            <span className="text-slate-100">Analyzing Resume...</span>
                                        </>
                                    ) : (
                                        <>
                                            Run ATS Scan <ArrowRight size={24} className="text-emerald-200" />
                                        </>
                                    )}
                                </button>

                                {error && (
                                    <div className="bg-red-50 text-red-700 p-4 rounded-xl text-sm font-medium flex items-center gap-3 border border-red-100 animate-in fade-in slide-in-from-top-2 shadow-sm">
                                        <AlertCircle size={20} className="shrink-0 text-red-500" />
                                        <div>{error}</div>
                                    </div>
                                )}
                            </div>

                            {/* RESULTS SECTION (Right Side) */}
                            <div className="lg:col-span-7 animate-slide-up animation-delay-500">
                                {!result ? (
                                    <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center h-[600px] flex flex-col items-center justify-center shadow-lg relative overflow-hidden">
                                        <div className="absolute top-0 right-0 w-64 h-64 bg-slate-50 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
                                        <div className="absolute bottom-0 left-0 w-64 h-64 bg-slate-50 rounded-full blur-3xl -ml-16 -mb-16 pointer-events-none"></div>

                                        <div className="w-24 h-24 bg-slate-50 rounded-3xl rotate-3 flex items-center justify-center mb-8 shadow-sm border border-slate-100">
                                            <Target size={48} className="text-slate-300 transform -rotate-3" />
                                        </div>
                                        <h3 className="text-2xl font-bold text-slate-800 mb-3">Ready to Analyze</h3>
                                        <p className="text-slate-500 max-w-sm text-lg">
                                            Complete the steps on the left to see your detailed match report, missing keywords, and AI tips.
                                        </p>
                                    </div>
                                ) : (
                                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">

                                        {/* Score Card */}
                                        <div className="bg-white p-8 rounded-3xl shadow-lg border border-slate-100 flex flex-col md:flex-row items-center gap-10 relative overflow-hidden">
                                            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-full blur-2xl -mr-8 -mt-8 pointer-events-none"></div>
                                            <div className="shrink-0 relative z-10">
                                                <CircularProgress value={result.match_percentage} />
                                            </div>
                                            <div className="flex-1 text-center md:text-left relative z-10">
                                                <div className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-3 ${result.match_percentage >= 70 ? 'bg-emerald-100 text-emerald-700' : result.match_percentage >= 40 ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'}`}>
                                                    ATS Score Analysis
                                                </div>
                                                <h3 className="text-3xl font-extrabold text-slate-900 mb-3 tracking-tight">
                                                    {result.match_percentage >= 70 ? 'Excellent Match! 🚀' :
                                                        result.match_percentage >= 40 ? 'Good Potential 🤔' : 'Needs Optimization ⚠️'}
                                                </h3>
                                                <p className="text-slate-600 leading-relaxed text-lg mb-6">
                                                    {result.summary}
                                                </p>
                                                {result.resumeUrl && (
                                                    <a
                                                        href={result.resumeUrl}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-xl text-sm font-bold hover:bg-slate-800 transition-colors shadow-lg shadow-slate-900/10"
                                                    >
                                                        <FileText size={16} /> View Saved Resume
                                                    </a>
                                                )}
                                            </div>
                                        </div>

                                        {/* Deep Dive Grid */}
                                        <div className="grid md:grid-cols-2 gap-6">

                                            {/* Missing Keywords */}
                                            <div className="bg-white p-8 rounded-3xl shadow-lg border border-slate-100 h-full flex flex-col">
                                                <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2 text-lg">
                                                    <AlertTriangle size={20} className="text-amber-500" /> Missing Keywords
                                                </h3>
                                                <div className="flex flex-wrap gap-2 content-start flex-grow">
                                                    {result.missing_keywords && result.missing_keywords.length > 0 ? (
                                                        result.missing_keywords.map((kw, i) => (
                                                            <span key={i} className="px-3 py-1.5 bg-red-50 text-red-700 rounded-lg text-xs font-bold border border-red-100 flex items-center gap-1">
                                                                <X size={10} strokeWidth={4} /> {kw}
                                                            </span>
                                                        ))
                                                    ) : (
                                                        <div className="flex flex-col items-center justify-center w-full py-12 text-emerald-600 bg-emerald-50/50 rounded-2xl border border-emerald-100 border-dashed">
                                                            <CheckCircle size={40} className="mb-3" />
                                                            <span className="font-bold text-lg">Perfect keyword match!</span>
                                                        </div>
                                                    )}
                                                </div>
                                                {result.missing_keywords?.length > 0 && (
                                                    <p className="text-xs text-slate-400 mt-6 font-medium">Add these terms to your resume naturally.</p>
                                                )}
                                            </div>

                                            {/* Action Plan */}
                                            <div className="bg-gradient-to-br from-indigo-50 to-white p-8 rounded-3xl shadow-lg border border-indigo-100 h-full flex flex-col">
                                                <h3 className="font-bold text-indigo-900 mb-6 flex items-center gap-2 text-lg">
                                                    <Briefcase size={20} className="text-indigo-600" /> AI Recommendation
                                                </h3>
                                                <div className="prose prose-sm text-slate-700 flex-grow">
                                                    <p className="leading-relaxed bg-white/50 p-4 rounded-xl border border-indigo-50/50 shadow-sm">
                                                        {result.recommendation}
                                                    </p>
                                                </div>
                                                <div className="mt-6 flex items-center gap-2 text-xs font-bold text-indigo-400 uppercase tracking-wider">
                                                    <Sparkles size={12} /> Powered by Llama 3
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                    </div>

                    {/* HISTORY SIDE DRAWER */}
                    <div
                        className={`fixed inset-0 z-[100] transition-opacity duration-200 ${isHistoryOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                    >
                        {/* Backdrop */}
                        <div
                            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
                            onClick={() => setIsHistoryOpen(false)}
                        ></div>

                        {/* Drawer Content */}
                        <div
                            className={`absolute top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl transition-transform duration-300 ease-out transform ${isHistoryOpen ? 'translate-x-0' : 'translate-x-full'}`}
                        >
                            <div className="flex flex-col h-full overflow-hidden">
                                {/* Drawer Header */}
                                <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                                    <div>
                                        <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                                            <History className="text-emerald-600" /> Scan History
                                        </h2>
                                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">Review previous analyses</p>
                                    </div>
                                    <button
                                        onClick={() => setIsHistoryOpen(false)}
                                        className="p-2 hover:bg-slate-200 rounded-lg transition-colors text-slate-400 hover:text-slate-600 shadow-sm bg-white"
                                    >
                                        <X size={20} />
                                    </button>
                                </div>

                                {/* Drawer Body - Scrollable */}
                                <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50/30">
                                    {historyLoading ? (
                                        <div className="flex flex-col items-center justify-center py-20">
                                            <Loader className="animate-spin text-emerald-500 mb-4" size={32} />
                                            <span className="text-slate-500 font-medium tracking-tight">Fetching history...</span>
                                        </div>
                                    ) : history.length > 0 ? (
                                        history.map((scan, idx) => (
                                            <div
                                                key={idx}
                                                onClick={() => {
                                                    setJobDescription(scan.jobDescription || '');
                                                    setResult({
                                                        match_percentage: scan.matchPercentage,
                                                        summary: scan.summary,
                                                        missing_keywords: scan.missingKeywords || [],
                                                        recommendation: scan.recommendation,
                                                        resumeUrl: scan.resumeUrl,
                                                        timestamp: scan.timestamp,
                                                        isHistory: true
                                                    });
                                                    setIsHistoryOpen(false);
                                                    window.scrollTo({ top: 300, behavior: 'smooth' });
                                                }}
                                                className="bg-white p-5 rounded-2xl border border-slate-100 hover:border-emerald-500/50 hover:shadow-lg hover:shadow-emerald-500/5 transition-all cursor-pointer group relative overflow-hidden"
                                            >
                                                <div className="flex justify-between items-start mb-3">
                                                    <div className="flex flex-col">
                                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 flex items-center gap-1">
                                                            <Clock size={10} /> {new Date(scan.timestamp).toLocaleDateString()}
                                                        </span>
                                                        <h4 className="font-bold text-slate-800 line-clamp-1 group-hover:text-emerald-700 transition-colors">
                                                            Analysis Result
                                                        </h4>
                                                    </div>
                                                    <div className={`text-lg font-black ${scan.matchPercentage >= 70 ? 'text-emerald-500' : scan.matchPercentage >= 40 ? 'text-amber-500' : 'text-red-500'}`}>
                                                        {scan.matchPercentage}%
                                                    </div>
                                                </div>
                                                <p className="text-xs text-slate-500 line-clamp-2 italic leading-relaxed">
                                                    "{scan.summary}"
                                                </p>
                                                <div className="flex items-center justify-between pt-3 mt-3 border-t border-slate-50">
                                                    <span className="text-[10px] font-extrabold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded uppercase tracking-tighter">View Report</span>
                                                    {scan.resumeUrl && (
                                                        <div className="text-[10px] font-bold text-slate-400 flex items-center gap-1">
                                                            <FileText size={10} /> PDF Saved
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-center py-20 px-6">
                                            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 border border-slate-100 shadow-sm">
                                                <Clock className="text-slate-200" size={32} />
                                            </div>
                                            <h4 className="text-lg font-bold text-slate-800 mb-2">No History Yet</h4>
                                            <p className="text-slate-500 text-sm leading-relaxed">
                                                Run your first ATS scan to see your analysis history appear here.
                                            </p>
                                        </div>
                                    )}
                                </div>

                                {/* Drawer Footer */}
                                <div className="p-6 border-t border-slate-100 bg-white">
                                    <p className="text-[10px] text-center text-slate-400 font-bold uppercase tracking-widest">
                                        {history.length} Analysis Records Found
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </StudentLayout>
    );
};

export default ResumeScanner;
