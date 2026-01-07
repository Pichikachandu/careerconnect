import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
    Award, CheckCircle, TrendingUp, AlertTriangle, BookOpen, Share2,
    Home, Download, ChevronDown, ChevronUp, Star, ShieldCheck, XCircle,
    BarChart3, Clock, Target, ArrowRight, FileText, Zap
} from 'lucide-react';
import StudentLayout from '../../components/StudentLayout';

const InterviewResults = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { history, jobRole } = location.state || {};

    const [analysis, setAnalysis] = useState(null);
    const [loading, setLoading] = useState(true);
    const [expandedQ, setExpandedQ] = useState(null);

    useEffect(() => {
        if (!history || history.length === 0) {
            navigate('/interview');
            return;
        }
        fetchAnalysis();
    }, []);

    const fetchAnalysis = async () => {
        try {
            const res = await axios.post('http://localhost:3000/api/interview/analyze-session', { history });
            setAnalysis(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return (
        <StudentLayout>
            <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center bg-white p-8">
                <div className="relative">
                    <div className="w-20 h-20 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <Zap size={24} className="text-indigo-600" />
                    </div>
                </div>
                <h2 className="text-2xl font-bold text-slate-800 mt-6 animate-pulse">Generating Report...</h2>
                <p className="text-slate-500 mt-2">Analyzing technical accuracy & communication skills</p>
            </div>
        </StudentLayout>
    );

    if (!analysis) return null;

    return (
        <StudentLayout>
            <div className="min-h-screen bg-slate-50/50 font-sans">

                {/* Printable Report Header */}
                <div className="bg-white border-b border-slate-200 sticky top-0 z-20 shadow-sm">
                    <div className="max-w-6xl mx-auto px-6 h-16 flex justify-between items-center">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600">
                                <FileText size={20} />
                            </div>
                            <div>
                                <h1 className="text-sm font-bold text-slate-900 uppercase tracking-wide">Candidate Assessment Report</h1>
                                <p className="text-xs text-slate-500">ID: #88219X • {new Date().toLocaleDateString()}</p>
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <button onClick={() => navigate('/interview')} className="text-slate-500 hover:text-slate-800 text-sm font-medium px-3 py-1.5 transition-colors">
                                Close
                            </button>
                            <button
                                onClick={() => window.print()}
                                className="bg-slate-900 text-white hover:bg-slate-800 text-sm font-bold px-4 py-1.5 rounded-lg flex items-center gap-2 transition-all shadow-lg shadow-slate-900/10"
                            >
                                <Download size={14} /> Download PDF
                            </button>
                        </div>
                    </div>
                </div>

                <div className="max-w-5xl mx-auto p-6 md:p-10 space-y-10">

                    {/* Hero Section */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Score Card */}
                        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200 flex flex-col items-center justify-center relative overflow-hidden group">
                            <div className={`absolute inset-0 opacity-5 transition-opacity duration-500 group-hover:opacity-10 
                                ${analysis.verdict?.includes('Hire') ? 'bg-emerald-500' : 'bg-red-500'}`}></div>

                            <div className="relative z-10 text-center">
                                <div className="text-6xl font-black text-slate-900 mb-2 tracking-tight">{analysis.overallScore}</div>
                                <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Overall Match Score</div>
                                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border
                                    ${analysis.verdict?.includes('Hire')
                                        ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                                        : 'bg-red-50 text-red-700 border-red-100'}`}>
                                    {analysis.verdict?.includes('Hire') ? <ShieldCheck size={12} /> : <XCircle size={12} />}
                                    {analysis.verdict}
                                </span>
                            </div>
                        </div>

                        {/* Summary & Stats */}
                        <div className="md:col-span-2 bg-white p-8 rounded-3xl shadow-sm border border-slate-200 flex flex-col justify-between">
                            <div>
                                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2 mb-3">
                                    <Target size={20} className="text-indigo-600" /> Executive Summary
                                </h3>
                                <p className="text-slate-600 leading-relaxed">{analysis.summary}</p>
                            </div>
                            <div className="mt-8 pt-6 border-t border-slate-100 grid grid-cols-3 gap-4">
                                <div>
                                    <div className="text-xs text-slate-400 font-bold uppercase mb-1">Role</div>
                                    <div className="font-semibold text-slate-800">{jobRole}</div>
                                </div>
                                <div>
                                    <div className="text-xs text-slate-400 font-bold uppercase mb-1">Questions</div>
                                    <div className="font-semibold text-slate-800">{history.length} Questions</div>
                                </div>
                                <div>
                                    <div className="text-xs text-slate-400 font-bold uppercase mb-1">Focus</div>
                                    <div className="font-semibold text-slate-800">Technical Proficiency</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Insights Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Strengths */}
                        <div className="bg-emerald-50/50 rounded-3xl p-8 border border-emerald-100">
                            <h3 className="flex items-center gap-2 font-bold text-lg text-emerald-900 mb-6">
                                <CheckCircle className="fill-emerald-100 text-emerald-600" size={24} />
                                Notable Strengths
                            </h3>
                            <div className="space-y-4">
                                {analysis.strengths?.map((item, i) => (
                                    <div key={i} className="flex gap-4 items-start bg-white/60 p-3 rounded-xl">
                                        <div className="mt-1 w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0"></div>
                                        <p className="text-emerald-900 text-sm font-medium leading-relaxed">{item}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Weaknesses */}
                        <div className="bg-amber-50/50 rounded-3xl p-8 border border-amber-100">
                            <h3 className="flex items-center gap-2 font-bold text-lg text-amber-900 mb-6">
                                <TrendingUp className="fill-amber-100 text-amber-600" size={24} />
                                Growth Opportunities
                            </h3>
                            <div className="space-y-4">
                                {analysis.areasForImprovement?.map((item, i) => (
                                    <div key={i} className="flex gap-4 items-start bg-white/60 p-3 rounded-xl">
                                        <div className="mt-1 w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0"></div>
                                        <p className="text-amber-900 text-sm font-medium leading-relaxed">{item}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Deep Dive Section */}
                    <div>
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                                <BarChart3 className="text-indigo-600" /> Response Analysis
                            </h3>
                            <span className="text-sm text-slate-500 font-medium">Detailed breakdown of {history.length} responses</span>
                        </div>

                        <div className="space-y-4">
                            {history.map((q, idx) => (
                                <div key={idx} className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300">
                                    <div
                                        onClick={() => setExpandedQ(expandedQ === idx ? null : idx)}
                                        className="p-6 flex items-start gap-4 cursor-pointer"
                                    >
                                        <div className={`shrink-0 w-12 h-12 rounded-xl flex flex-col items-center justify-center border font-bold text-lg
                                            ${q.rating >= 7 ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                                                : q.rating >= 4 ? 'bg-amber-50 text-amber-700 border-amber-100'
                                                    : 'bg-red-50 text-red-700 border-red-100'}`}>
                                            {q.rating}
                                            <span className="text-[8px] font-normal uppercase opacity-70">/10</span>
                                        </div>

                                        <div className="flex-grow pt-1.5">
                                            <div className="flex justify-between items-start mb-1">
                                                <h4 className="font-bold text-slate-800 text-base md:text-lg">{q.question}</h4>
                                                {/* <span className="text-slate-400 text-xs font-mono ml-4 shrink-0">Q{idx + 1}</span> */}
                                            </div>
                                            <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                                <span>{q.rating >= 8 ? 'Excellent' : q.rating >= 5 ? 'Fair' : 'Weak'}</span>
                                                {expandedQ !== idx && <span className="text-indigo-600 normal-case ml-2 flex items-center gap-1 hover:underline">View Details <ArrowRight size={12} /></span>}
                                            </div>
                                        </div>

                                        {expandedQ === idx ? <ChevronUp className="text-slate-300" /> : <ChevronDown className="text-slate-300" />}
                                    </div>

                                    {expandedQ === idx && (
                                        <div className="border-t border-slate-100 bg-slate-50/50 p-6 md:p-8 animate-in slide-in-from-top-1">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                                <div className="space-y-3">
                                                    <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
                                                        <div className="w-2 h-2 rounded-full bg-slate-400"></div> Your Response
                                                    </div>
                                                    <div className="bg-white p-4 rounded-xl border border-slate-200 text-slate-700 italic leading-relaxed text-sm">
                                                        "{q.answer}"
                                                    </div>
                                                    <div className="bg-indigo-50 p-4 rounded-xl border border-indigo-100 text-indigo-800 text-sm">
                                                        <span className="font-bold block mb-1">AI Feedback:</span>
                                                        {q.feedback}
                                                    </div>
                                                </div>

                                                <div className="space-y-3">
                                                    <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 uppercase tracking-wider">
                                                        <div className="w-2 h-2 rounded-full bg-emerald-500"></div> Ideal Approach
                                                    </div>
                                                    <div className="bg-emerald-50/50 p-5 rounded-xl border border-emerald-100/50 text-slate-700 text-sm leading-relaxed">
                                                        {q.ideal_answer}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Resources Footer */}
                    <div className="bg-slate-900 rounded-3xl p-8 md:p-12 text-center relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-indigo-500/20 via-transparent to-transparent"></div>
                        <div className="relative z-10 max-w-2xl mx-auto space-y-6">
                            <BookOpen size={32} className="mx-auto text-indigo-400" />
                            <h3 className="text-2xl font-bold text-white">Recommended Study Plan</h3>
                            <p className="text-slate-400">Based on your gaps, we recommend focusing on these key areas before your next attempt.</p>

                            <div className="flex flex-wrap justify-center gap-3">
                                {analysis.recommendedResources?.map((res, i) => (
                                    <span key={i} className="bg-white/10 hover:bg-white/20 px-4 py-2 rounded-full text-sm font-medium text-indigo-100 border border-white/10 transition-colors cursor-default">
                                        {res}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </StudentLayout>
    );
};

export default InterviewResults;
