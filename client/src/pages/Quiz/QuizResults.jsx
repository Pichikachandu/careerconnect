import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CheckCircle, XCircle, Home, Award, BarChart2, Zap, Target, ArrowRight, BrainCircuit, Sparkles, BookOpen, ChevronDown, Check, AlertTriangle } from 'lucide-react';
import Confetti from 'react-confetti';
import StudentLayout from '../../components/StudentLayout';
import axios from 'axios';

const QuizResults = () => {
    const { state } = useLocation();
    const navigate = useNavigate();
    const [windowSize, setWindowSize] = useState({ width: window.innerWidth, height: window.innerHeight });
    const [expandedQ, setExpandedQ] = useState(null);
    const [animateScore, setAnimateScore] = useState(0);
    const [aiData, setAiData] = useState(null);
    const [loadingAnalysis, setLoadingAnalysis] = useState(true);

    const resultData = state?.resultData;

    useEffect(() => {
        const handleResize = () => setWindowSize({ width: window.innerWidth, height: window.innerHeight });
        window.addEventListener('resize', handleResize);

        if (resultData) {
            // Score Animation
            const percentage = Math.round((resultData.score / resultData.total) * 100);
            let start = 0;
            const duration = 1500;
            const intervalTime = 20;
            const steps = duration / intervalTime;
            const increment = percentage / steps;

            const timer = setInterval(() => {
                start += increment;
                if (start >= percentage) {
                    setAnimateScore(percentage);
                    clearInterval(timer);
                } else {
                    setAnimateScore(Math.floor(start));
                }
            }, intervalTime);

            // Fetch AI Analysis
            const fetchAnalysis = async () => {
                try {
                    setLoadingAnalysis(true);
                    const res = await axios.post('http://localhost:3000/api/quiz/analyze-ai', {
                        results: resultData.results,
                        score: resultData.score,
                        total: resultData.total
                    });

                    // Try parsing JSON if valid
                    try {
                        const parsed = typeof res.data.analysis === 'string' ? JSON.parse(res.data.analysis) : res.data.analysis;
                        setAiData(parsed);
                    } catch (e) {
                        console.error("Failed to parse AI JSON", e);
                        setAiData(null);
                    }
                } catch (error) {
                    console.error("AI Analysis Failed", error);
                    // Fallback handled by UI
                } finally {
                    setLoadingAnalysis(false);
                }
            };
            fetchAnalysis();

            return () => {
                clearInterval(timer);
                window.removeEventListener('resize', handleResize);
            }
        }
    }, [resultData]);

    if (!resultData) {
        return (
            <StudentLayout>
                <div className="flex items-center justify-center flex-col gap-6 font-sans h-[80vh]">
                    <div className="bg-white p-8 rounded-3xl shadow-xl text-center max-w-sm w-full border border-slate-100">
                        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
                            <BarChart2 size={32} />
                        </div>
                        <h2 className="text-xl font-bold text-slate-800 mb-2">No Result Data</h2>
                        <button
                            onClick={() => navigate('/test')}
                            className="w-full py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition shadow-lg shadow-indigo-500/20"
                        >
                            Start New Quiz
                        </button>
                    </div>
                </div>
            </StudentLayout>
        );
    }

    const { score, total, results } = resultData;
    const percentage = Math.round((score / total) * 100);
    const passed = percentage >= 60;

    const correctCount = results.filter(r => r.isCorrect).length;
    const incorrectCount = results.filter(r => !r.isCorrect && r.selected).length;
    const skippedCount = total - (correctCount + incorrectCount);

    return (
        <StudentLayout>
            <div className="font-sans min-h-full pb-20 relative bg-slate-50/50">
                {passed && <Confetti width={windowSize.width} height={windowSize.height} recycle={false} numberOfPieces={800} gravity={0.15} />}

                {/* Hero Gradient Background */}
                <div className="absolute top-0 w-full h-[500px] bg-gradient-to-b from-indigo-900 via-indigo-800 to-slate-50 z-0"></div>

                <div className="container mx-auto px-4 py-8 relative z-10 max-w-7xl">

                    {/* Header */}
                    <div className="text-center text-white mb-10 pt-4">
                        <h1 className="text-3xl md:text-5xl font-black mb-2 tracking-tight">Assessment Report</h1>
                        <p className="text-indigo-200 font-medium">Detailed breakdown of your recent performance</p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">

                        {/* LEFT COLUMN - Main Score & Actions */}
                        <div className="lg:col-span-1 space-y-6">
                            {/* Score Card */}
                            <div className="bg-white rounded-3xl p-8 shadow-xl shadow-indigo-900/10 border border-indigo-50 relative overflow-hidden text-center group">
                                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500"></div>

                                <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-6">Overall Score</h3>

                                <div className="relative w-56 h-56 mx-auto mb-6">
                                    {/* Progress Ring */}
                                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 224 224">
                                        <circle cx="112" cy="112" r="100" stroke="#f1f5f9" strokeWidth="16" fill="none" />
                                        <circle
                                            cx="112" cy="112" r="100"
                                            stroke={passed ? "#10b981" : "#f59e0b"}
                                            strokeWidth="16"
                                            fill="none"
                                            strokeDasharray={`${2 * Math.PI * 100}`}
                                            strokeDashoffset={`${2 * Math.PI * 100 * (1 - animateScore / 100)}`}
                                            strokeLinecap="round"
                                            className="transition-all duration-1000 ease-out"
                                        />
                                    </svg>
                                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                                        <span className="text-5xl md:text-6xl font-black text-slate-800 tracking-tighter loading-none mt-2">{animateScore}%</span>
                                        <span className={`text-[10px] md:text-xs font-bold mt-2 px-3 py-1 rounded-full border ${passed ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-amber-50 text-amber-600 border-amber-100'}`}>
                                            {passed ? 'PASSED' : 'IMPROVE'}
                                        </span>
                                    </div>
                                </div>

                                <div className="grid grid-cols-3 gap-2 py-4 border-t border-slate-100">
                                    <div><div className="text-2xl font-bold text-slate-800">{score}</div><div className="text-[10px] text-slate-400 uppercase font-bold">Score</div></div>
                                    <div className="border-x border-slate-100"><div className="text-2xl font-bold text-slate-800">{total}</div><div className="text-[10px] text-slate-400 uppercase font-bold">Total</div></div>
                                    <div><div className="text-2xl font-bold text-slate-800">{skippedCount}</div><div className="text-[10px] text-slate-400 uppercase font-bold">Skip</div></div>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="grid grid-cols-2 gap-3">
                                <button onClick={() => navigate('/test')} className="col-span-2 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-bold shadow-lg shadow-indigo-500/25 transition-all flex items-center justify-center gap-2">
                                    <Zap size={20} className="fill-white" /> Retake Test
                                </button>
                                <button onClick={() => navigate('/dashboard/student')} className="py-4 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-2xl font-bold transition-all">
                                    Home
                                </button>
                                <button className="py-4 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl font-bold transition-all">
                                    Export PDF
                                </button>
                            </div>
                        </div>

                        {/* RIGHT COLUMN - AI & Details */}
                        <div className="lg:col-span-2 space-y-6">

                            {/* AI Analysis Section */}
                            <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 overflow-hidden border border-indigo-50/50">
                                <div className="bg-slate-900 p-6 flex justify-between items-center relative overflow-hidden">
                                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/20 to-purple-600/20"></div>
                                    <div className="relative z-10 flex items-center gap-3">
                                        <div className="p-2 bg-indigo-500 rounded-lg shadow-lg shadow-indigo-500/40">
                                            <BrainCircuit className="text-white" size={24} />
                                        </div>
                                        <div>
                                            <h2 className="text-white font-bold text-lg">AI Performance Engine</h2>
                                            <p className="text-indigo-200 text-xs">Powered by Groq Llama 3</p>
                                        </div>
                                    </div>
                                    {loadingAnalysis && <div className="text-white/50 text-xs animate-pulse">Analyzing...</div>}
                                </div>

                                <div className="p-6 md:p-8 bg-slate-50/50">
                                    {loadingAnalysis ? (
                                        <div className="space-y-4 animate-pulse">
                                            <div className="h-4 bg-slate-200 rounded w-3/4"></div>
                                            <div className="h-20 bg-slate-200 rounded-xl"></div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="h-32 bg-slate-200 rounded-xl"></div>
                                                <div className="h-32 bg-slate-200 rounded-xl"></div>
                                            </div>
                                        </div>
                                    ) : aiData ? (
                                        <div className="space-y-6">
                                            {/* Summary */}
                                            <div className="bg-white p-5 rounded-2xl border border-indigo-100 shadow-sm">
                                                <h3 className="text-sm font-bold text-indigo-900 uppercase tracking-wide mb-2 flex items-center gap-2">
                                                    <Sparkles size={16} className="text-indigo-500" /> Executive Summary
                                                </h3>
                                                <p className="text-slate-700 leading-relaxed font-medium">
                                                    {aiData.summary || "Analysis produced general results."}
                                                </p>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                {/* Strengths & Weaknesses */}
                                                <div className="space-y-4">
                                                    <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Key Insights</h3>
                                                    <div className="space-y-3">
                                                        {aiData.strengths?.map((s, i) => (
                                                            <div key={i} className="flex gap-3 bg-white p-3 rounded-xl border border-emerald-100 shadow-sm items-start">
                                                                <CheckCircle size={18} className="text-emerald-500 mt-0.5 shrink-0" />
                                                                <span className="text-sm text-slate-700 font-medium">{s}</span>
                                                            </div>
                                                        ))}
                                                        {aiData.weaknesses?.map((w, i) => (
                                                            <div key={i} className="flex gap-3 bg-white p-3 rounded-xl border border-red-100 shadow-sm items-start">
                                                                <AlertTriangle size={18} className="text-red-500 mt-0.5 shrink-0" />
                                                                <span className="text-sm text-slate-700 font-medium">{w}</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>

                                                {/* Roadmap Timeline */}
                                                <div className="space-y-4">
                                                    <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Personalized Roadmap</h3>
                                                    <div className="relative pl-4 space-y-6 before:absolute before:inset-y-0 before:left-[7px] before:w-[2px] before:bg-slate-200">
                                                        {aiData.roadmap?.map((step, i) => (
                                                            <div key={i} className="relative pl-6">
                                                                <div className="absolute left-0 top-1.5 w-4 h-4 rounded-full bg-white border-4 border-indigo-500"></div>
                                                                <h4 className="text-xs font-bold text-indigo-600 uppercase mb-1">{step.step}</h4>
                                                                <p className="text-sm text-slate-600 font-medium">{step.action}</p>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Resources */}
                                            <div className="pt-4 border-t border-slate-200">
                                                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Recommended Resources</h3>
                                                <div className="flex flex-wrap gap-2">
                                                    {aiData.resources?.map((r, i) => (
                                                        <span key={i} className="px-3 py-1.5 bg-indigo-50 text-indigo-700 rounded-lg text-xs font-bold border border-indigo-100 hover:bg-indigo-100 transition-colors cursor-default">
                                                            {r}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="text-center py-10 text-slate-500">
                                            <p>AI Analysis unavailable. Please check API configuration.</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Question Breakdown Accordion */}
                            <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
                                <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                                    <h3 className="text-lg font-bold text-slate-800">Question Analysis</h3>
                                    <span className="text-xs font-bold bg-slate-100 text-slate-500 px-3 py-1 rounded-full">{results.length} Questions</span>
                                </div>
                                <div className="divide-y divide-slate-50">
                                    {results.map((q, idx) => {
                                        const isExpanded = expandedQ === idx;
                                        return (
                                            <div key={idx} className={`transition-all hover:bg-slate-50 ${isExpanded ? 'bg-slate-50' : ''}`}>
                                                <div
                                                    onClick={() => setExpandedQ(isExpanded ? null : idx)}
                                                    className="p-4 flex items-center gap-4 cursor-pointer"
                                                >
                                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${q.isCorrect ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'}`}>
                                                        {q.isCorrect ? <Check size={16} /> : <XCircle size={16} />}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-sm font-bold text-slate-700 truncate pr-4">{q.question}</p>
                                                    </div>
                                                    <ChevronDown size={18} className={`text-slate-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                                                </div>

                                                {/* Expanded Details */}
                                                {isExpanded && (
                                                    <div className="px-16 pb-6 text-sm grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-2 duration-200">
                                                        <div className={`p-4 rounded-xl border ${q.isCorrect ? 'bg-emerald-50/50 border-emerald-100' : 'bg-red-50/50 border-red-100'}`}>
                                                            <p className="text-[10px] uppercase font-bold text-slate-400 mb-1">Your Answer</p>
                                                            <p className={`font-bold ${q.isCorrect ? 'text-emerald-700' : 'text-red-700'}`}>{q.selected || 'Skipped'}</p>
                                                        </div>
                                                        {!q.isCorrect && (
                                                            <div className="p-4 rounded-xl border border-emerald-100 bg-emerald-50/30">
                                                                <p className="text-[10px] uppercase font-bold text-slate-400 mb-1">Correct Answer</p>
                                                                <p className="font-bold text-emerald-700">{q.correct}</p>
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </StudentLayout>
    );
};

export default QuizResults;
