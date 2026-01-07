import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import StudentLayout from '../../components/StudentLayout';
import { Video, Mic, BrainCircuit, Play } from 'lucide-react';

const InterviewDashboard = () => {
    const navigate = useNavigate();
    const [config, setConfig] = useState({
        jobRole: '',
        techStack: '',
        experience: 0
    });

    const startInterview = () => {
        if (!config.jobRole || !config.techStack) return;
        navigate('/interview/active', { state: config });
    };

    return (
        <StudentLayout>
            <div className="font-sans text-slate-900 bg-slate-50 h-full">
                <div className="container mx-auto px-4 py-8 max-w-4xl">

                    {/* Hero */}
                    <div className="bg-gradient-to-r from-emerald-600 to-teal-800 rounded-3xl p-8 mb-10 text-white shadow-xl relative overflow-hidden">
                        <div className="relative z-10">
                            <h1 className="text-3xl font-bold mb-2">AI Mock Interiewer</h1>
                            <p className="text-emerald-100 max-w-xl">
                                Practice with our intelligent AI interviewer. It adapts to your role, asks relevant questions, and provides instant feedback on your answers.
                            </p>
                        </div>
                        <div className="absolute right-0 bottom-0 opacity-20 transform translate-x-10 translate-y-10">
                            <BrainCircuit size={180} />
                        </div>
                    </div>

                    {/* Setup Form */}
                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
                        <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                            <Video className="text-emerald-600" />
                            New Session Setup
                        </h2>

                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Target Job Role</label>
                                <input
                                    type="text"
                                    placeholder="e.g. Full Stack Developer"
                                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 outline-none focus:ring-2 focus:ring-emerald-500"
                                    value={config.jobRole}
                                    onChange={(e) => setConfig({ ...config, jobRole: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Years of Experience</label>
                                <input
                                    type="number"
                                    min="0"
                                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 outline-none focus:ring-2 focus:ring-emerald-500"
                                    value={config.experience}
                                    onChange={(e) => setConfig({ ...config, experience: e.target.value })}
                                />
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-slate-700 mb-2">Tech Stack / Skills</label>
                                <input
                                    type="text"
                                    placeholder="e.g. React, Node.js, MongoDB, TypeScript"
                                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 outline-none focus:ring-2 focus:ring-emerald-500"
                                    value={config.techStack}
                                    onChange={(e) => setConfig({ ...config, techStack: e.target.value })}
                                />
                                <p className="text-xs text-slate-400 mt-1">Separate skills with commas.</p>
                            </div>
                        </div>

                        <div className="mt-8 flex justify-end">
                            <button
                                onClick={startInterview}
                                disabled={!config.jobRole || !config.techStack}
                                className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg shadow-emerald-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <Play size={20} />
                                Start Interview
                            </button>
                        </div>
                    </div>

                    {/* Tips */}
                    <div className="grid md:grid-cols-3 gap-4 mt-8">
                        <div className="bg-blue-50 p-4 rounded-xl text-sm text-blue-800">
                            <strong>📹 Camera On:</strong> The AI uses vision to check your confidence and eye contact.
                        </div>
                        <div className="bg-purple-50 p-4 rounded-xl text-sm text-purple-800">
                            <strong>🎤 Speak Clearly:</strong> Answers are transcribed automatically.
                        </div>
                        <div className="bg-orange-50 p-4 rounded-xl text-sm text-orange-800">
                            <strong>🤖 Instant Feedback:</strong> Get rated on correctness and relevance after each question.
                        </div>
                    </div>

                </div>
            </div>
        </StudentLayout>
    );
};

export default InterviewDashboard;
