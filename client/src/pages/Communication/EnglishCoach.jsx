import React, { useState, useEffect, useRef } from 'react';
import StudentLayout from '../../components/StudentLayout';
import { Mic, MessageSquare, Video, Sparkles, Play, ArrowLeft, ArrowRight, Send, Volume2, StopCircle, User, Bot, RefreshCw } from 'lucide-react';
import axios from 'axios';

const EnglishCoach = () => {
    const [activeMode, setActiveMode] = useState(null); // 'voice', 'chat', 'scenario'
    const [messages, setMessages] = useState([]);
    const [inputText, setInputText] = useState('');
    const [isRecording, setIsRecording] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [scenario, setScenario] = useState(null);

    const messagesEndRef = useRef(null);
    const recognitionRef = useRef(null);
    const synthRef = useRef(window.speechSynthesis);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Speech Recognition Setup
    useEffect(() => {
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            const recognition = new SpeechRecognition();
            recognition.continuous = false; // Stop after one sentence for interaction
            recognition.interimResults = false;
            recognition.lang = 'en-US';

            recognition.onresult = (event) => {
                const transcript = event.results[0][0].transcript;
                setInputText(transcript);
                handleSendMessage(transcript); // Auto-send on voice stop
            };

            recognition.onend = () => {
                setIsRecording(false);
            };

            recognitionRef.current = recognition;
        }
    }, [activeMode]);

    const handleStartMode = async (mode, selectedScenario = null) => {
        setActiveMode(mode);
        setMessages([]);
        setInputText('');
        setScenario(selectedScenario);

        // Initial Greeting
        let initialMessage = "Hello! I'm your AI English Coach. How can I help you improve today?";

        if (mode === 'voice') {
            initialMessage = "Hi there! I'm listening. Let's have a conversation. What's on your mind?";
            speak(initialMessage);
        } else if (mode === 'scenario' && selectedScenario) {
            setIsLoading(true);
            try {
                const res = await axios.post('http://localhost:3000/api/communication/scenario-start', { scenario: selectedScenario });
                initialMessage = res.data.reply;
            } catch (err) {
                console.error(err);
                initialMessage = `Starting ${selectedScenario} roleplay. You go first!`;
            }
            setIsLoading(false);
        }

        setMessages([{ role: 'assistant', content: initialMessage }]);
    };

    const handleSendMessage = async (text = inputText) => {
        if (!text.trim()) return;

        const userMsg = { role: 'user', content: text };
        setMessages(prev => [...prev, userMsg]);
        setInputText('');
        setIsLoading(true);

        try {
            // Context history (last 10 messages)
            const history = messages.slice(-10).map(m => ({ role: m.role, content: m.content }));

            const res = await axios.post('http://localhost:3000/api/communication/chat', {
                message: text,
                mode: activeMode,
                history: history
            });

            const botReply = res.data.reply;
            setMessages(prev => [...prev, { role: 'assistant', content: botReply }]);

            if (activeMode === 'voice') {
                speak(botReply);
            }

        } catch (err) {
            console.error(err);
            const errorMessage = err.response?.data?.error || err.response?.data?.message || "Sorry, I'm having trouble connecting. Please try again.";
            setMessages(prev => [...prev, { role: 'assistant', content: errorMessage }]);
        } finally {
            setIsLoading(false);
        }
    };

    const toggleRecording = () => {
        if (isRecording) {
            recognitionRef.current?.stop();
        } else {
            setIsRecording(true);
            recognitionRef.current?.start();
        }
    };

    const speak = (text) => {
        if (synthRef.current) {
            synthRef.current.cancel(); // Stop previous
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = 'en-US';
            utterance.rate = 1;

            // Prioritize strict user request for 'Samantha', then fallbacks
            const voices = synthRef.current.getVoices();
            const preferredVoice =
                voices.find(v => v.name.includes('Samantha')) ||
                voices.find(v => v.name.includes('Google US English')) ||
                voices.find(v => v.name.includes('Zira')) ||
                voices.find(v => v.name.includes('Female'));

            if (preferredVoice) {
                utterance.voice = preferredVoice;
            }

            synthRef.current.speak(utterance);
        }
    };

    const handleBack = () => {
        setActiveMode(null);
        setScenario(null);
        synthRef.current?.cancel();
    };

    return (
        <StudentLayout>
            <div className={`font-sans text-slate-900 min-h-screen flex flex-col ${activeMode ? 'bg-slate-900' : 'bg-slate-50'}`}>

                {/* Hero / Header */}
                {!activeMode ? (
                    <div className="flex-grow flex flex-col pb-20">
                        <div className="container mx-auto px-4 py-8 max-w-6xl">
                            <div className="bg-gradient-to-r from-blue-900 to-indigo-900 rounded-3xl p-8 md:p-12 mb-10 text-white shadow-xl relative overflow-hidden">
                                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                                <div className="absolute right-0 top-0 w-96 h-96 bg-indigo-500/20 rounded-full blur-[100px] -mr-20 -mt-20"></div>

                                <div className="relative z-10 max-w-3xl">
                                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/20 text-blue-200 text-xs font-bold uppercase tracking-wider mb-6">
                                        <Sparkles size={14} className="text-yellow-400" /> Professional Development
                                    </div>
                                    <h1 className="text-4xl md:text-5xl font-extrabold mb-6 tracking-tight leading-tight">
                                        AI-Powered <span className="text-indigo-400">Communication</span> Excellence
                                    </h1>
                                    <p className="text-lg text-blue-100 max-w-2xl font-medium leading-relaxed">
                                        Elevate your professional presence with real-time coaching. Master fluency, grammar, and scenario-based interactions.
                                    </p>
                                </div>
                            </div>

                            <div className="max-w-6xl mx-auto relative z-20">
                                <div className="grid md:grid-cols-3 gap-8">
                                    <ModeCard
                                        icon={Mic} color="indigo" title="Voice Conversation"
                                        desc="Speak naturally with our AI coach. Practice pronunciation, fluency, and spontaneous speaking."
                                        onClick={() => handleStartMode('voice')}
                                    />
                                    <ModeCard
                                        icon={MessageSquare} color="purple" title="Grammar Coach"
                                        desc="Text-based practice with instant grammar corrections, vocabulary suggestions, and style improvements."
                                        onClick={() => handleStartMode('chat')}
                                    />
                                    <ModeCard
                                        icon={Video} color="pink" title="Mock Scenarios"
                                        desc="Roleplay specific situations like 'Job Interview' or 'Business Meeting' to build confidence."
                                        onClick={() => handleStartMode('scenario', 'Job Interview')}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    /* Active Session Interface - Enterprise Premium Dark Mode */
                    <div className="flex-grow flex flex-col pb-10 bg-slate-900 h-[calc(100vh-2rem)] relative overflow-hidden">
                        {/* Immersive Background */}
                        <div className="absolute inset-0 z-0">
                            {/* Dynamic Gradient Base */}
                            <div className={`absolute inset-0 opacity-40 bg-gradient-to-br 
                                ${activeMode === 'voice' ? 'from-indigo-900 via-slate-900 to-slate-900' :
                                    activeMode === 'chat' ? 'from-purple-900 via-slate-900 to-slate-900' :
                                        'from-pink-900 via-slate-900 to-slate-900'}`}></div>

                            {/* Tech Grid Pattern */}
                            <div className="absolute inset-0 opacity-30"
                                style={{
                                    backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.3) 1px, transparent 1px)',
                                    backgroundSize: '40px 40px'
                                }}>
                            </div>

                            {/* Glowing Orb */}
                            <div className={`absolute -top-[20%] -right-[10%] w-[600px] h-[600px] rounded-full blur-[120px] opacity-20 pointer-events-none
                                ${activeMode === 'voice' ? 'bg-indigo-500' : activeMode === 'chat' ? 'bg-purple-500' : 'bg-pink-500'}`}></div>
                        </div>

                        <div className="container mx-auto px-4 py-8 max-w-5xl h-full flex flex-col relative z-10">
                            {/* Session Header - Glassmorphic */}
                            <div className={`rounded-t-3xl border-b border-white/10 p-6 flex items-center justify-between shadow-2xl relative overflow-hidden shrink-0 z-20
                                ${activeMode === 'voice' ? 'bg-indigo-900/95' : activeMode === 'chat' ? 'bg-purple-900/95' : 'bg-pink-900/95'}`}>
                                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>

                                <button onClick={handleBack} className="p-2.5 bg-white/10 hover:bg-white/20 rounded-xl transition-all text-white/80 hover:text-white backdrop-blur-sm relative z-10 group">
                                    <ArrowLeft size={20} className="group-hover:-translate-x-0.5 transition-transform" />
                                </button>

                                <div className="text-center relative z-10">
                                    <h2 className="font-extrabold text-white text-xl flex items-center justify-center gap-3 tracking-tight">
                                        {activeMode === 'voice' && <span className="p-2 bg-indigo-500/20 ring-1 ring-white/20 text-indigo-100 rounded-lg shadow-inner"><Mic size={20} /></span>}
                                        {activeMode === 'chat' && <span className="p-2 bg-purple-500/20 ring-1 ring-white/20 text-purple-100 rounded-lg shadow-inner"><MessageSquare size={20} /></span>}
                                        {activeMode === 'scenario' && <span className="p-2 bg-pink-500/20 ring-1 ring-white/20 text-pink-100 rounded-lg shadow-inner"><Video size={20} /></span>}
                                        <span className="drop-shadow-md">
                                            {activeMode === 'voice' ? 'Voice Session' : activeMode === 'chat' ? 'Grammar Coach' : `Scenario: ${scenario}`}
                                        </span>
                                    </h2>
                                    <p className="text-[10px] uppercase tracking-widest text-white/60 font-bold mt-1.5 flex items-center justify-center gap-1.5">
                                        <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.8)]"></span> AI Connected
                                    </p>
                                </div>
                                <div className="w-10"></div> {/* Spacer */}
                            </div>

                            {/* Chat Area - Fully Transparent/Immersive */}
                            <div className="flex-grow bg-slate-800/20 rounded-b-3xl border-x border-b border-white/5 shadow-2xl overflow-hidden flex flex-col relative h-full backdrop-blur-sm">
                                {/* Ambient Background */}
                                <div className={`absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] opacity-20 pointer-events-none 
                                    ${activeMode === 'voice' ? 'from-indigo-900 via-slate-900 to-slate-900' :
                                        activeMode === 'chat' ? 'from-purple-900 via-slate-900 to-slate-900' :
                                            'from-pink-900 via-slate-900 to-slate-900'}`}></div>

                                <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>

                                <div className="flex-grow overflow-y-auto p-6 space-y-6 custom-scrollbar relative z-10">
                                    {messages.map((msg, idx) => (
                                        <div key={idx} className={`flex gap-5 animate-slide-up ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-lg border-t border-white/10
                                                ${msg.role === 'user'
                                                    ? 'bg-gradient-to-br from-indigo-500 to-indigo-700 text-white shadow-indigo-500/30'
                                                    : 'bg-gradient-to-br from-slate-700 to-slate-800 text-indigo-300 border-slate-600'}`}>
                                                {msg.role === 'user' ? <User size={20} /> : <Bot size={20} />}
                                            </div>

                                            <div className={`max-w-[75%] rounded-3xl p-6 shadow-md text-sm leading-7 relative group border border-white/5
                                                ${msg.role === 'user'
                                                    ? 'bg-indigo-600 text-white rounded-tr-none shadow-xl shadow-indigo-900/10'
                                                    : 'bg-slate-800/90 text-slate-100 rounded-tl-none backdrop-blur-md shadow-lg shadow-black/20'}`}>

                                                {/* Content */}
                                                <div className="markdown-body whitespace-pre-wrap font-medium tracking-wide">
                                                    {msg.content}
                                                </div>

                                                {/* Timestamp (Hover) */}
                                                <div className={`text-[10px] mt-2 opacity-0 group-hover:opacity-100 transition-opacity absolute bottom-1.5 font-bold uppercase tracking-wider
                                                    ${msg.role === 'user' ? 'left-6 text-indigo-300' : 'right-6 text-slate-500'}`}>
                                                    Just now
                                                </div>
                                            </div>
                                        </div>
                                    ))}

                                    {isLoading && (
                                        <div className="flex gap-5 animate-pulse">
                                            <div className="w-12 h-12 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center shrink-0 shadow-sm text-indigo-400">
                                                <Bot size={20} />
                                            </div>
                                            <div className="bg-slate-800/60 px-6 py-5 rounded-3xl rounded-tl-none border border-slate-700/50 shadow-sm flex items-center gap-2">
                                                <span className="text-xs font-bold text-slate-500 mr-2 uppercase tracking-wider">AI is thinking</span>
                                                <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce"></div>
                                                <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce delay-100"></div>
                                                <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce delay-200"></div>
                                            </div>
                                        </div>
                                    )}
                                    <div ref={messagesEndRef} />
                                </div>

                                {/* Input Area - Floating Glass */}
                                <div className="p-6 pt-2 bg-gradient-to-t from-slate-900 via-slate-900/80 to-transparent z-20">
                                    <div className="bg-slate-800/60 p-2.5 rounded-[2rem] border border-white/10 flex items-center gap-3 shadow-2xl focus-within:ring-2 focus-within:ring-indigo-500/50 transition-all backdrop-blur-xl">
                                        <button
                                            onClick={toggleRecording}
                                            className={`w-12 h-12 rounded-full transition-all duration-300 flex items-center justify-center shrink-0
                                            ${isRecording
                                                    ? 'bg-red-500 text-white shadow-lg shadow-red-500/40 animate-pulse scale-105 ring-4 ring-red-500/20'
                                                    : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 hover:scale-105 shadow-md border border-white/5'}`}
                                            title="Toggle Voice Input"
                                        >
                                            {isRecording ? <div className="w-3 h-3 bg-white rounded-sm"></div> : <Mic size={22} />}
                                        </button>

                                        <input
                                            type="text"
                                            value={inputText}
                                            onChange={(e) => setInputText(e.target.value)}
                                            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                                            placeholder={isRecording ? "Listening..." : "Type your message..."}
                                            className="flex-grow bg-transparent border-none px-2 focus:ring-0 text-slate-100 placeholder-slate-500 font-medium text-lg"
                                            disabled={isRecording}
                                        />

                                        <button
                                            onClick={() => handleSendMessage()}
                                            disabled={!inputText.trim() || isLoading}
                                            className="w-12 h-12 bg-indigo-600 text-white rounded-full hover:shadow-lg hover:shadow-indigo-500/40 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none bg-gradient-to-r from-indigo-500 to-indigo-700 flex items-center justify-center"
                                        >
                                            {isLoading ? <RefreshCw size={22} className="animate-spin" /> : <Send size={22} className="ml-0.5" />}
                                        </button>
                                    </div>
                                    <div className="text-center mt-3">
                                        <p className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider opacity-60">AI can make mistakes. Verify important info.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </StudentLayout>
    );
};

const ModeCard = ({ icon: Icon, color, title, desc, onClick }) => {
    // Professional color mapping (subtle accents)
    const accents = {
        indigo: 'hover:border-indigo-500/30 hover:shadow-indigo-500/10',
        purple: 'hover:border-purple-500/30 hover:shadow-purple-500/10',
        pink: 'hover:border-pink-500/30 hover:shadow-pink-500/10',
    };

    // Icon colors (muted professional tones)
    const iconColors = {
        indigo: 'text-indigo-600 bg-indigo-50 group-hover:bg-indigo-600 group-hover:text-white',
        purple: 'text-purple-600 bg-purple-50 group-hover:bg-purple-600 group-hover:text-white',
        pink: 'text-pink-600 bg-pink-50 group-hover:bg-pink-600 group-hover:text-white',
    };

    return (
        <div onClick={onClick} className={`bg-white rounded-2xl shadow-lg shadow-slate-200/50 border border-slate-100 p-8 flex flex-col items-start transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl cursor-pointer group ${accents[color]} relative overflow-hidden`}>
            <div className={`absolute top-0 right-0 w-32 h-32 rounded-full blur-[60px] opacity-0 group-hover:opacity-20 transition-opacity duration-500 pointer-events-none -mr-10 -mt-10 ${color === 'indigo' ? 'bg-indigo-500' : color === 'purple' ? 'bg-purple-500' : 'bg-pink-500'}`}></div>

            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 transition-all duration-300 transform group-hover:scale-110 group-hover:rotate-3 ${iconColors[color]} shadow-inner`}>
                <Icon size={32} strokeWidth={1.5} />
            </div>
            <h3 className="text-xl font-extrabold text-slate-800 mb-3 tracking-tight group-hover:text-indigo-900 transition-colors">{title}</h3>
            <p className="text-slate-500 mb-8 leading-relaxed text-sm font-medium">
                {desc}
            </p>
            <button className={`mt-auto text-sm font-extrabold flex items-center gap-2 transition-all uppercase tracking-wider ${color === 'indigo' ? 'text-indigo-600 group-hover:text-indigo-700' : color === 'purple' ? 'text-purple-600 group-hover:text-purple-700' : 'text-pink-600 group-hover:text-pink-700'}`}>
                Start Session <div className="bg-slate-50 p-1.5 rounded-full group-hover:bg-indigo-50 transition-colors"><ArrowRight size={14} strokeWidth={3} /></div>
            </button>
        </div>
    );
};

export default EnglishCoach;
