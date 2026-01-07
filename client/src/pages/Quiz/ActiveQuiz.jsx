import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Webcam from 'react-webcam';
import { Clock, AlertCircle, CheckCircle, ChevronRight, ChevronLeft, Flag, Monitor, Grid, HelpCircle, Save, X, Shield, Eye, AlertTriangle } from 'lucide-react';

const ActiveQuiz = () => {
    const { state } = useLocation();
    const navigate = useNavigate();

    // Derived from navigation state
    const username = state?.username || 'Guest';
    const category = state?.category || 'General';

    const [questions, setQuestions] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [answers, setAnswers] = useState({}); // { qId: "Option A" }
    const [markedQuestions, setMarkedQuestions] = useState({}); // { qId: true }
    const [loading, setLoading] = useState(true);
    const [timeLeft, setTimeLeft] = useState(1200); // 20 minutes default
    const [warnings, setWarnings] = useState([]);
    const [isProctoring, setIsProctoring] = useState(false);
    const webcamRef = React.useRef(null);

    useEffect(() => {
        // Fetch questions
        const fetchQuestions = async () => {
            try {
                const res = await axios.get(`http://localhost:3000/api/quiz/questions?category=${category}`);
                setQuestions(res.data);
                setLoading(false);
            } catch (error) {
                console.error("Failed to load questions", error);
                alert("Failed to load quiz. Please make sure the backend is running.");
                navigate('/test');
            }
        };
        fetchQuestions();
    }, [category, navigate]);

    // Timer Logic
    useEffect(() => {
        if (loading || questions.length === 0) return;
        const timer = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    clearInterval(timer);
                    handleSubmit();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(timer);
    }, [loading, questions]);

    // AI Proctoring Logic
    useEffect(() => {
        if (loading || questions.length === 0) return;

        const proctorInterval = setInterval(async () => {
            if (webcamRef.current) {
                const imageSrc = webcamRef.current.getScreenshot();
                if (imageSrc) {
                    try {
                        setIsProctoring(true);
                        const res = await axios.post('http://localhost:3000/api/quiz/proctor', {
                            imageBase64: imageSrc
                        });

                        if (res.data.isSuspicious) {
                            const newWarning = {
                                id: Date.now(),
                                reason: res.data.reason,
                                snapshotUrl: res.data.snapshotUrl,
                                time: new Date().toLocaleTimeString()
                            };
                            setWarnings(prev => [...prev, newWarning]);

                            // Visual feedback for warning
                            if (window.confirm(`⚠️ PROCTORING ALERT: ${res.data.reason}\n\nThis activity has been logged. Continuous violations will lead to automatic submission. Do you want to continue?`)) {
                                // Just acknowledged
                            }
                        }
                    } catch (error) {
                        console.error("AI Proctoring failed", error);
                    } finally {
                        setIsProctoring(false);
                    }
                }
            }
        }, 30000); // Every 30 seconds to save Groq tokens and reduce noise

        return () => clearInterval(proctorInterval);
    }, [loading, questions]);

    // Auto-submit if too many warnings
    useEffect(() => {
        if (warnings.length >= 3) {
            alert("TEST TERMINATED: Multiple proctoring violations detected. Your test is being automatically submitted.");
            handleSubmit();
        }
    }, [warnings]);

    const handleOptionSelect = (option) => {
        const currentQ = questions[currentIndex];
        setAnswers({ ...answers, [currentQ._id]: option });
    };

    const toggleMarkForReview = () => {
        const currentQ = questions[currentIndex];
        setMarkedQuestions(prev => ({
            ...prev,
            [currentQ._id]: !prev[currentQ._id]
        }));
    };

    const clearResponse = () => {
        const currentQ = questions[currentIndex];
        const newAnswers = { ...answers };
        delete newAnswers[currentQ._id];
        setAnswers(newAnswers);
    };

    const handleSubmit = async () => {
        try {
            const res = await axios.post('http://localhost:3000/api/quiz/submit', {
                username,
                category,
                answers,
                proctoringLog: warnings.map(w => ({
                    snapshotUrl: w.snapshotUrl,
                    reason: w.reason,
                    timestamp: new Date(w.id)
                }))
            });
            navigate('/quiz/results', { state: { resultData: res.data } });
        } catch (error) {
            console.error("Submission failed", error);
            alert("Error submitting quiz. Check console.");
        }
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <div className="flex flex-col items-center">
                    <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-4"></div>
                    <p className="text-slate-500 font-medium animate-pulse">Setting up secure environment...</p>
                </div>
            </div>
        );
    }

    if (questions.length === 0) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <div className="text-center max-w-md p-8 bg-white rounded-2xl shadow-xl border border-slate-200">
                    <AlertCircle size={48} className="mx-auto text-red-500 mb-4" />
                    <h2 className="text-xl font-bold text-slate-800 mb-2">No Questions Found</h2>
                    <p className="text-slate-500 mb-6">We couldn't find any questions for the {category} category.</p>
                    <button onClick={() => navigate('/test')} className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-bold hover:bg-indigo-700 transition-colors">Return to Dashboard</button>
                </div>
            </div>
        )
    }

    const currentQuestion = questions[currentIndex];

    // Status counts
    const answeredCount = Object.keys(answers).length;
    const markedCount = Object.keys(markedQuestions).filter(k => markedQuestions[k]).length;
    const notVisitedCount = questions.length - (Object.keys(answers).length + markedCount); // Rough approx, technically need visited set

    return (
        <div className="h-screen bg-slate-50 font-sans flex flex-col overflow-hidden">
            {/* 1. Top Header */}
            <header className="bg-white border-b border-slate-200 h-16 shrink-0 flex items-center justify-between px-6 shadow-sm z-20">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-lg flex items-center justify-center">
                        <Monitor size={20} />
                    </div>
                    <div>
                        <h1 className="text-sm font-bold text-slate-900 uppercase tracking-wide">{category} Assessment</h1>
                        <p className="text-xs text-slate-500 font-medium">Candidate: {username}</p>
                    </div>
                </div>

                <div className={`flex items-center gap-3 px-5 py-2 rounded-lg border font-mono font-bold text-xl shadow-inner ${timeLeft < 300 ? 'bg-red-50 text-red-600 border-red-200 animate-pulse' : 'bg-slate-100 text-slate-700 border-slate-200'}`}>
                    <Clock size={20} className={timeLeft < 300 ? 'text-red-500' : 'text-slate-400'} />
                    {formatTime(timeLeft)}
                </div>

                <div className="flex items-center gap-4 bg-emerald-50 text-emerald-700 px-4 py-2 rounded-full border border-emerald-100">
                    <div className="flex items-center gap-2">
                        <Shield size={16} className="text-emerald-600" />
                        <span className="text-xs font-black uppercase tracking-widest">AI Proctoring Enabled</span>
                    </div>
                    {isProctoring && <div className="w-2 h-2 bg-emerald-500 rounded-full animate-ping"></div>}
                </div>
            </header>

            {/* 2. Main Content Area */}
            <div className="flex-1 flex overflow-hidden">

                {/* Left: Question Area */}
                <main className="flex-1 flex flex-col h-full overflow-y-auto w-full md:w-3/4">
                    {/* Question Header */}
                    <div className="bg-white border-b border-slate-100 p-6 flex justify-between items-start sticky top-0 z-10">
                        <div className="flex items-center gap-4">
                            <span className="text-4xl font-black text-indigo-100 select-none">
                                {currentIndex + 1 < 10 ? `0${currentIndex + 1}` : currentIndex + 1}
                            </span>
                            <div>
                                <h2 className="text-lg font-bold text-slate-800">Question {currentIndex + 1}</h2>
                                <p className="text-xs text-slate-400 font-medium bg-slate-100 px-2 py-0.5 rounded inline-block mt-1">Single Choice • 1 Mark</p>
                            </div>
                        </div>
                        <button
                            onClick={toggleMarkForReview}
                            className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-bold transition-colors border ${markedQuestions[currentQuestion._id]
                                ? 'bg-amber-50 text-amber-600 border-amber-200'
                                : 'bg-white text-slate-400 border-slate-200 hover:border-slate-300'}`}
                        >
                            <Flag size={14} className={markedQuestions[currentQuestion._id] ? 'fill-current' : ''} />
                            {markedQuestions[currentQuestion._id] ? 'Marked for Review' : 'Mark for Review'}
                        </button>
                    </div>

                    {/* Question Body */}
                    <div className="p-6 md:p-10 max-w-5xl mx-auto w-full">
                        <div className="text-lg md:text-xl font-medium text-slate-800 leading-relaxed mb-8 selection:bg-indigo-100 selection:text-indigo-900">
                            {currentQuestion.question_text}
                        </div>

                        {/* Options */}
                        <div className="space-y-4">
                            {currentQuestion.options.map((option, idx) => {
                                const isSelected = answers[currentQuestion._id] === option;
                                return (
                                    <label
                                        key={idx}
                                        className={`relative group flex items-start gap-4 p-5 rounded-xl border-2 cursor-pointer transition-all duration-200
                                        ${isSelected
                                                ? 'border-indigo-600 bg-indigo-50/50 shadow-md transform scale-[1.01]'
                                                : 'border-slate-200 bg-white hover:border-indigo-300 hover:bg-slate-50'
                                            }`}
                                    >
                                        <div className="pt-1">
                                            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all
                                                ${isSelected
                                                    ? 'border-indigo-600 bg-indigo-600'
                                                    : 'border-slate-300 group-hover:border-indigo-400'}`}>
                                                {isSelected && <div className="w-2.5 h-2.5 bg-white rounded-full"></div>}
                                            </div>
                                        </div>
                                        {/* Hidden Radio for accessibility/logic */}
                                        <input
                                            type="radio"
                                            name={`question-${currentQuestion._id}`}
                                            value={option}
                                            checked={isSelected}
                                            onChange={() => handleOptionSelect(option)}
                                            className="hidden"
                                        />
                                        <span className={`text-lg transition-colors ${isSelected ? 'font-semibold text-indigo-900' : 'text-slate-600'}`}>
                                            {option}
                                        </span>
                                    </label>
                                );
                            })}
                        </div>
                    </div>

                    {/* Footer Controls */}
                    <div className="mt-auto bg-white border-t border-slate-200 p-4 md:p-6 flex justify-between items-center sticky bottom-0 z-10">
                        <div className="flex gap-3">
                            <button
                                onClick={clearResponse}
                                disabled={!answers[currentQuestion._id]}
                                className="px-4 py-2 text-slate-500 font-bold text-sm hover:text-red-500 disabled:opacity-30 disabled:hover:text-slate-500 transition-colors"
                            >
                                Clear Response
                            </button>
                        </div>

                        <div className="flex gap-4">
                            <button
                                onClick={() => setCurrentIndex(prev => Math.max(0, prev - 1))}
                                disabled={currentIndex === 0}
                                className="px-6 py-2.5 rounded-lg font-bold text-slate-600 border border-slate-300 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
                            >
                                <ChevronLeft size={18} /> Previous
                            </button>
                            <button
                                onClick={() => setCurrentIndex(prev => Math.min(questions.length - 1, prev + 1))}
                                disabled={currentIndex === questions.length - 1}
                                className={`px-6 py-2.5 rounded-lg font-bold text-white transition-all flex items-center gap-2 shadow-lg shadow-indigo-500/30
                                    ${currentIndex === questions.length - 1
                                        ? 'bg-slate-200 text-slate-400 shadow-none cursor-not-allowed hidden' // Hide next on last q
                                        : 'bg-indigo-600 hover:bg-indigo-700 hover:-translate-y-0.5'}`}
                            >
                                Save & Next <ChevronRight size={18} />
                            </button>

                            {/* Submit Button (Only on last question) */}
                            {currentIndex === questions.length - 1 && (
                                <button
                                    onClick={handleSubmit}
                                    className="px-8 py-2.5 rounded-lg font-bold text-white bg-emerald-600 hover:bg-emerald-700 transition-all flex items-center gap-2 shadow-lg shadow-emerald-500/30 hover:-translate-y-0.5 animate-pulse"
                                >
                                    Submit Test <Save size={18} />
                                </button>
                            )}
                        </div>
                    </div>
                </main>

                {/* Right: Question Palette (Hidden on Mobile, toggleable usually but for now stacking or fixed) */}
                <aside className="w-80 bg-white border-l border-slate-200 hidden md:flex flex-col z-10">
                    <div className="p-6 border-b border-slate-100">
                        <h3 className="font-bold text-slate-800 flex items-center gap-2 mb-4">
                            <Grid size={18} className="text-indigo-600" /> Question Palette
                        </h3>
                        <div className="grid grid-cols-2 gap-3 text-xs font-semibold text-slate-600">
                            <div className="flex items-center gap-2"><div className="w-3 h-3 rounded bg-emerald-500"></div> Answered</div>
                            <div className="flex items-center gap-2"><div className="w-3 h-3 rounded bg-amber-500"></div> Marked</div>
                            <div className="flex items-center gap-2"><div className="w-3 h-3 rounded bg-slate-200"></div> Not Visited</div>
                            <div className="flex items-center gap-2"><div className="w-3 h-3 rounded bg-indigo-600 text-white flex items-center justify-center text-[8px]">●</div> Current</div>
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto p-6">
                        <div className="grid grid-cols-5 gap-3">
                            {questions.map((q, idx) => {
                                const isAnswered = answers[q._id];
                                const isMarked = markedQuestions[q._id];
                                const isCurrent = idx === currentIndex;

                                let baseClass = "bg-slate-100 text-slate-600 hover:bg-slate-200";
                                if (isCurrent) baseClass = "ring-2 ring-indigo-600 bg-indigo-50 text-indigo-700 font-extrabold";
                                else if (isMarked) baseClass = "bg-amber-100 text-amber-700 border border-amber-300";
                                else if (isAnswered) baseClass = "bg-emerald-100 text-emerald-700 border border-emerald-300";

                                return (
                                    <button
                                        key={idx}
                                        onClick={() => setCurrentIndex(idx)}
                                        className={`aspect-square rounded-lg flex items-center justify-center text-sm font-bold transition-all relative ${baseClass}`}
                                    >
                                        {idx + 1}
                                        {isMarked && <div className="absolute top-0.5 right-0.5 w-1.5 h-1.5 bg-amber-500 rounded-full"></div>}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    <div className="p-6 bg-slate-50 border-t border-slate-200 text-center">
                        <div className="mb-4 relative group">
                            <div className="absolute inset-0 bg-indigo-600/10 rounded-xl blur opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            <Webcam
                                audio={false}
                                ref={webcamRef}
                                screenshotFormat="image/jpeg"
                                className="w-full rounded-xl shadow-inner relative z-10 border-2 border-slate-200"
                                videoConstraints={{ width: 320, height: 240, facingMode: "user" }}
                            />
                            <div className="absolute top-2 right-2 px-2 py-1 bg-black/50 backdrop-blur-md rounded-md text-[8px] text-white font-bold flex items-center gap-1 z-20">
                                <Eye size={10} /> REC
                            </div>
                        </div>

                        {warnings.length > 0 && (
                            <div className="mb-4 p-3 bg-red-50 border border-red-100 rounded-xl text-left">
                                <p className="text-[10px] font-bold text-red-600 uppercase mb-2 flex items-center gap-1">
                                    <AlertTriangle size={12} /> Violations ({warnings.length}/3)
                                </p>
                                <div className="space-y-1 max-h-20 overflow-y-auto">
                                    {warnings.map(w => (
                                        <div key={w.id} className="text-[9px] text-red-500 font-medium">
                                            • {w.reason} ({w.time})
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        <p className="text-xs text-slate-400 mb-4 font-medium italic">
                            AI is monitoring your activity
                        </p>
                        <button
                            onClick={handleSubmit}
                            className="w-full py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-colors shadow-lg shadow-slate-900/10"
                        >
                            Submit Assessment
                        </button>
                    </div>
                </aside>

            </div>
        </div>
    );
};

export default ActiveQuiz;
