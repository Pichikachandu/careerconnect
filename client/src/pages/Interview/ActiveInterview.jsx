import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Webcam from 'react-webcam';
import { Mic, MicOff, Camera, RefreshCw, ChevronRight, CheckCircle, AlertTriangle, BrainCircuit, Play, StopCircle, Award, Lightbulb, GraduationCap, ArrowLeft, Clock, Monitor, Wifi, Maximize2, Volume2, Shield } from 'lucide-react';

const ActiveInterview = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { jobRole, techStack, experience } = location.state || {};

    const [questions, setQuestions] = useState([]);
    const [currentQIndex, setCurrentQIndex] = useState(0);
    const [isRecording, setIsRecording] = useState(false);
    const isRecordingRef = useRef(false);

    useEffect(() => { isRecordingRef.current = isRecording; }, [isRecording]);

    const [transcript, setTranscript] = useState('');
    const [interimTranscript, setInterimTranscript] = useState('');
    const [feedback, setFeedback] = useState(null);
    const [history, setHistory] = useState([]);
    const [currentUser, setCurrentUser] = useState(null);

    useEffect(() => {
        const stored = JSON.parse(localStorage.getItem('user'));
        if (stored) setCurrentUser(stored);
    }, []);
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(false);
    const [elapsedTime, setElapsedTime] = useState(0);

    const recognitionRef = useRef(null);

    // Timer active only when interview is loaded
    useEffect(() => {
        let interval;
        if (!loading) {
            interval = setInterval(() => setElapsedTime(prev => prev + 1), 1000);
        }
        return () => clearInterval(interval);
    }, [loading]);

    useEffect(() => {
        if (!jobRole) {
            navigate('/interview');
            return;
        }
        initInterview();
        initSpeech();
    }, []);

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const initSpeech = () => {
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            const recognition = new SpeechRecognition();
            recognition.continuous = true;
            recognition.interimResults = true;
            recognition.lang = 'en-US';

            recognition.onresult = (event) => {
                let final = '';
                let interim = '';

                for (let i = event.resultIndex; i < event.results.length; ++i) {
                    if (event.results[i].isFinal) {
                        final += event.results[i][0].transcript;
                    } else {
                        interim += event.results[i][0].transcript;
                    }
                }

                if (final) {
                    setTranscript(prev => (prev + " " + final).trim());
                    setInterimTranscript(''); // Clear interim
                } else {
                    setInterimTranscript(interim);
                }
            };

            recognition.onerror = (event) => {
                console.error("Speech Recognition Error:", event.error);
                if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
                    alert("Microphone blocked. Please allow permissions in browser settings (Lock icon in URL bar).");
                    setIsRecording(false);
                }
            };

            recognition.onend = () => {
                if (recognitionRef.current && isRecordingRef.current) {
                    try { recognitionRef.current.start(); } catch (e) { }
                }
            };

            recognitionRef.current = recognition;
        } else {
            alert("Speech recognition not supported. Please use Google Chrome.");
        }
    };

    const initInterview = async () => {
        setLoading(true);
        try {
            const res = await axios.post('http://localhost:3000/api/interview/questions', {
                jobRole, techStack, experience
            });
            setQuestions(res.data.questions);
        } catch (err) {
            console.error(err);
            alert("Failed to generate questions. Check backend Gemini/Groq Key.");
        }
        setLoading(false);
    };

    const toggleRecording = () => {
        if (isRecording) {
            setIsRecording(false);
            if (recognitionRef.current) recognitionRef.current.stop();
        } else {
            setTranscript('');
            setIsRecording(true);
            if (recognitionRef.current) {
                try { recognitionRef.current.start(); } catch (e) { }
            }
        }
    };

    const submitAnswer = async () => {
        if (isRecording) toggleRecording();
        setProcessing(true);
        try {
            const res = await axios.post('http://localhost:3000/api/interview/feedback', {
                question: questions[currentQIndex],
                answer: transcript
            });
            setFeedback(res.data);

            setHistory(prev => [...prev, {
                question: questions[currentQIndex],
                answer: transcript,
                rating: res.data.rating,
                feedback: res.data.feedback,
                ideal_answer: res.data.ideal_answer
            }]);
        } catch (err) {
            console.error(err);
        }
        setProcessing(false);
    };

    const nextQuestion = () => {
        setFeedback(null);
        setTranscript('');
        if (currentQIndex < questions.length - 1) {
            setCurrentQIndex(prev => prev + 1);
        } else {
            navigate('/interview/result', {
                state: { history, jobRole }
            });
        }
    };

    if (loading) return (
        <div className="min-h-screen bg-[#0A0A0A] flex flex-col items-center justify-center text-white font-sans selection:bg-indigo-500/30">
            <div className="relative">
                <div className="w-16 h-16 rounded-full border-4 border-indigo-500/30 border-t-indigo-500 animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                    <BrainCircuit size={24} className="text-indigo-500" />
                </div>
            </div>
            <h2 className="text-2xl font-bold mt-6 tracking-tight">Initializing Environment</h2>
            <div className="flex items-center gap-2 text-zinc-400 mt-2 text-sm font-medium">
                <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                Crafting parameters for {jobRole}
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#0A0A0A] text-zinc-100 font-sans selection:bg-indigo-500/30 flex flex-col overflow-hidden">

            {/* Top Bar / Navbar */}
            <header className="h-16 border-b border-zinc-800 bg-[#0A0A0A]/80 backdrop-blur-md flex items-center justify-between px-6 sticky top-0 z-50">
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 text-indigo-400 font-bold tracking-tight">
                        <div className="p-1.5 bg-indigo-500/10 rounded-lg border border-indigo-500/20">
                            <Monitor size={18} />
                        </div>
                        CareerConnect <span className="text-zinc-500 font-medium hidden sm:inline">| Interview Round</span>
                    </div>
                    <div className="h-4 w-px bg-zinc-800 hidden sm:block"></div>
                    <div className="hidden sm:flex items-center gap-2 text-xs font-medium bg-zinc-900 px-3 py-1.5 rounded-full border border-zinc-800">
                        <span className="text-zinc-400">Position:</span>
                        <span className="text-zinc-100">{jobRole}</span>
                    </div>
                </div>

                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2 text-zinc-400 text-sm font-mono">
                        <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                        {formatTime(elapsedTime)}
                    </div>
                    <button
                        onClick={() => navigate('/interview')}
                        className="px-3 py-1.5 text-xs font-bold text-zinc-400 hover:text-white border border-zinc-800 hover:border-red-500/50 hover:bg-red-500/10 rounded-lg transition-all"
                    >
                        End Session
                    </button>
                    <div className="flex items-center gap-3 pl-6 border-l border-zinc-800">
                        <div className="flex flex-col items-end">
                            <span className="text-xs font-bold text-zinc-200">{currentUser?.name || currentUser?.username || 'Candidate'}</span>
                            <span className="text-[10px] text-zinc-500">ID: #{currentUser?._id ? currentUser._id.slice(-6).toUpperCase() : '88219X'}</span>
                        </div>
                        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-xs font-bold border border-white/10">
                            {currentUser?.name ? currentUser.name.charAt(0).toUpperCase() : (currentUser?.username ? currentUser.username.charAt(0).toUpperCase() : 'C')}
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Workspace */}
            <main className="flex-grow p-4 lg:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 max-w-[1920px] mx-auto w-full h-[calc(100vh-4rem)]">

                {/* Left Panel: Camera & System Status (4 Cols) */}
                <div className="lg:col-span-4 flex flex-col gap-6">
                    {/* Camera Feed */}
                    <div className="bg-zinc-900 rounded-2xl border border-zinc-800 overflow-hidden shadow-2xl relative group h-[300px] lg:h-[360px] shrink-0">
                        <Webcam
                            audio={false}
                            className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                            mirrored={true}
                        />

                        {/* Camera Overlays */}
                        <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10 flex items-center gap-2">
                            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>
                            <span className="text-[10px] font-bold tracking-wider text-emerald-400">SIGNAL STABLE</span>
                        </div>

                        <div className="absolute top-4 right-4 flex gap-2">
                            <div className="p-2 bg-black/60 backdrop-blur-md rounded-lg border border-white/10 text-zinc-400">
                                <MicOff size={14} />
                            </div>
                        </div>

                        {/* Name Tag */}
                        <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
                            <div className="bg-black/80 backdrop-blur-xl px-4 py-2 rounded-xl border border-white/10">
                                <h3 className="text-sm font-bold text-white">Active Candidate</h3>
                                <p className="text-[10px] text-zinc-400">Video Feed • 1080p</p>
                            </div>
                            <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-zinc-800 border-2 border-zinc-700 flex items-center justify-center">
                                <Shield size={16} className="text-emerald-500" />
                            </div>
                        </div>
                    </div>

                    {/* System Metrics */}
                    <div className="flex-grow bg-zinc-900/50 rounded-2xl border border-zinc-800 p-6 flex flex-col justify-between">
                        <div>
                            <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-4">Assessment Progress</h3>
                            <div className="space-y-4">
                                <div>
                                    <div className="flex justify-between text-xs font-medium mb-2">
                                        <span className="text-zinc-300">Question Completion</span>
                                        <span className="text-indigo-400">{currentQIndex + 1} / {questions.length}</span>
                                    </div>
                                    <div className="h-2 w-full bg-zinc-800 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-indigo-500 rounded-full transition-all duration-500"
                                            style={{ width: `${((currentQIndex + 1) / questions.length) * 100}%` }}
                                        ></div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div className="p-3 bg-zinc-900 rounded-xl border border-zinc-800">
                                        <div className="text-zinc-500 text-[10px] font-bold uppercase mb-1">Tech Stack</div>
                                        <div className="text-zinc-200 font-medium truncate">{techStack}</div>
                                    </div>
                                    <div className="p-3 bg-zinc-900 rounded-xl border border-zinc-800">
                                        <div className="text-zinc-500 text-[10px] font-bold uppercase mb-1">Experience</div>
                                        <div className="text-zinc-200 font-medium">{experience} Years</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="pt-6 border-t border-zinc-800">
                            <div className="flex items-center gap-3 text-xs text-zinc-500">
                                <Wifi size={14} className="text-emerald-500" />
                                <span>Network Latency: 24ms</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Panel: Question & Interaction (8 Cols) */}
                <div className="lg:col-span-8 flex flex-col h-full gap-6">

                    {/* Question Card */}
                    <div className="bg-zinc-900 rounded-2xl border border-zinc-800 p-8 shadow-xl relative overflow-hidden shrink-0">
                        {/* Decorative Gradients */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none -translate-y-1/2 translate-x-1/2"></div>

                        <div className="relative z-10">
                            <div className="flex justify-between items-start mb-6">
                                <span className="bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                                    Question {currentQIndex + 1}
                                </span>
                                <div className="flex gap-1">
                                    {[...Array(3)].map((_, i) => (
                                        <div key={i} className="w-1.5 h-1.5 rounded-full bg-zinc-800"></div>
                                    ))}
                                </div>
                            </div>

                            <h1 className="text-2xl md:text-3xl font-bold text-zinc-100 leading-tight">
                                {questions[currentQIndex]}
                            </h1>

                            <div className="mt-6 flex items-center gap-4 text-sm text-zinc-500 font-medium">
                                <span className="flex items-center gap-1.5"><Clock size={16} /> Est. Time: 2-3 mins</span>
                                <span className="w-1 h-1 rounded-full bg-zinc-800"></span>
                                <span className="flex items-center gap-1.5"><Volume2 size={16} /> Verbal Response Req.</span>
                            </div>
                        </div>
                    </div>

                    {/* Interaction Area (Transcript / Result) */}
                    <div className="flex-grow bg-zinc-900 rounded-2xl border border-zinc-800 overflow-hidden flex flex-col relative shadow-inner">
                        <div className="flex-1 p-6 md:p-8 overflow-y-auto custom-scrollbar">
                            {!feedback ? (
                                <div className="h-full flex flex-col">
                                    {transcript || interimTranscript ? (
                                        <div className="space-y-4 animate-in fade-in duration-300">
                                            <div className="flex gap-4">
                                                <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center shrink-0 mt-1">
                                                    <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse"></div>
                                                </div>
                                                <div className="space-y-2 max-w-3xl">
                                                    <p className="text-lg text-zinc-300 leading-relaxed font-light">
                                                        {transcript} <span className="text-zinc-500">{interimTranscript}</span>
                                                    </p>
                                                    {isRecording && <span className="inline-block w-1.5 h-4 bg-indigo-500 animate-pulse ml-1"></span>}
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="h-full flex flex-col items-center justify-center text-zinc-600 space-y-6 opacity-60">
                                            <div className="w-20 h-20 rounded-full bg-zinc-800/50 border border-zinc-800 flex items-center justify-center">
                                                <Mic size={32} />
                                            </div>
                                            <div className="text-center space-y-2">
                                                <p className="text-lg font-medium text-zinc-400">Ready to Answer?</p>
                                                <p className="text-sm">Click the microphone button below to start recording your response.</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="space-y-8 animate-in slide-in-from-bottom-6 duration-500">
                                    {/* Score Header */}
                                    <div className="flex items-center gap-6 pb-6 border-b border-zinc-800">
                                        <div className="relative">
                                            <svg className="w-24 h-24 transform -rotate-90">
                                                <circle cx="48" cy="48" r="40" stroke="#27272a" strokeWidth="8" fill="none" />
                                                <circle cx="48" cy="48" r="40" stroke={feedback.rating >= 7 ? "#10b981" : feedback.rating >= 4 ? "#eab308" : "#ef4444"} strokeWidth="8" fill="none" strokeDasharray="251.2" strokeDashoffset={251.2 * (1 - feedback.rating / 10)} strokeLinecap="round" />
                                            </svg>
                                            <div className="absolute inset-0 flex items-center justify-center flex-col">
                                                <span className="text-3xl font-bold text-white">{feedback.rating}</span>
                                                <span className="text-[10px] text-zinc-500 uppercase">Score</span>
                                            </div>
                                        </div>
                                        <div>
                                            <h2 className="text-2xl font-bold text-white mb-1">
                                                {feedback.rating >= 8 ? "Excellent Response" : feedback.rating >= 5 ? "Good Attempt" : "Needs Improvement"}
                                            </h2>
                                            <p className="text-zinc-400 text-sm">AI Analysis Complete</p>
                                        </div>
                                    </div>

                                    {/* Feedback Grid */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="bg-zinc-950 p-5 rounded-xl border border-zinc-800/50">
                                            <h4 className="flex items-center gap-2 text-sm font-bold text-zinc-400 mb-3">
                                                <Lightbulb size={16} className="text-yellow-500" /> Key Insights
                                            </h4>
                                            <p className="text-zinc-300 text-sm leading-relaxed">{feedback.feedback}</p>
                                        </div>
                                        <div className="bg-zinc-950 p-5 rounded-xl border border-zinc-800/50">
                                            <h4 className="flex items-center gap-2 text-sm font-bold text-zinc-400 mb-3">
                                                <Award size={16} className="text-emerald-500" /> Ideal Approach
                                            </h4>
                                            <p className="text-zinc-300 text-sm leading-relaxed">{feedback.ideal_answer}</p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Control Bar */}
                        <div className="p-6 bg-zinc-900 border-t border-zinc-800 flex justify-between items-center gap-6">
                            {!feedback ? (
                                <>
                                    <div className="flex-1">
                                        {isRecording && <p className="text-xs text-red-500 font-bold animate-pulse flex items-center gap-2 mb-2"><span className="w-2 h-2 rounded-full bg-red-500"></span> Recording Audio...</p>}
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <button
                                            onClick={toggleRecording}
                                            className={`h-14 w-14 rounded-full flex items-center justify-center transition-all ${isRecording ? 'bg-red-500 hover:bg-red-600 shadow-lg shadow-red-500/20 scale-100' : 'bg-zinc-100 hover:bg-white text-zinc-900 scale-100'}`}
                                        >
                                            {isRecording ? <StopCircle size={28} className="fill-white" /> : <Mic size={28} />}
                                        </button>
                                        <button
                                            onClick={submitAnswer}
                                            disabled={!transcript || processing || isRecording}
                                            className="h-14 px-8 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-indigo-500/20 flex items-center gap-2"
                                        >
                                            {processing ? (
                                                <>
                                                    <RefreshCw size={20} className="animate-spin" />
                                                    <span>Analyzing...</span>
                                                </>
                                            ) : (
                                                <>
                                                    <span>Submit Response</span>
                                                    <ArrowLeft size={20} className="rotate-180" />
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </>
                            ) : (
                                <div className="w-full flex justify-end">
                                    <button
                                        onClick={nextQuestion}
                                        className="h-14 px-8 rounded-full bg-white text-zinc-900 font-bold hover:bg-zinc-200 transition-all shadow-lg flex items-center gap-2"
                                    >
                                        Next Question <ChevronRight size={20} />
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default ActiveInterview;
