import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { ServerOff, Terminal, ArrowLeft } from 'lucide-react';

const ModulePlaceholder = () => {
    const { moduleName } = useParams();
    const navigate = useNavigate();

    const modules = {
        dsa: { title: "DSA Practice", port: 8502, color: "text-purple-600", bg: "bg-purple-100" },
        interview: { title: "Mock Interviews", port: 8503, color: "text-green-600", bg: "bg-green-100" },
        ats: { title: "Resume ATS", port: 8504, color: "text-yellow-600", bg: "bg-yellow-100" }
    };

    const currentModule = modules[moduleName] || { title: "Module", port: 8000, color: "text-blue-600", bg: "bg-blue-100" };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
            <Header />

            <main className="flex-grow flex items-center justify-center p-6">
                <div className="bg-white rounded-3xl shadow-xl max-w-2xl w-full p-8 md:p-12 text-center border border-slate-100 animate-slide-up">
                    <div className={`w-20 h-20 ${currentModule.bg} ${currentModule.color} rounded-full flex items-center justify-center mx-auto mb-6`}>
                        <ServerOff size={40} />
                    </div>

                    <h1 className="text-3xl font-bold text-slate-800 mb-4">
                        {currentModule.title} <span className="opacity-50">Offline</span>
                    </h1>

                    <p className="text-lg text-slate-500 mb-8 leading-relaxed">
                        This AI-powered module requires the Python backend services to be running.
                        <br className="hidden md:block" />
                        Please start the backend services to access this feature.
                    </p>

                    <div className="bg-slate-900 rounded-xl p-6 text-left mb-8 font-mono text-sm relative group">
                        <div className="absolute top-3 right-3 flex gap-1.5">
                            <div className="w-2.5 h-2.5 rounded-full bg-red-500"></div>
                            <div className="w-2.5 h-2.5 rounded-full bg-yellow-500"></div>
                            <div className="w-2.5 h-2.5 rounded-full bg-green-500"></div>
                        </div>
                        <p className="text-slate-400 mb-2 border-b border-slate-700 pb-2"># Run this command in your project root terminal:</p>
                        <div className="flex items-center gap-2 text-green-400">
                            <Terminal size={16} />
                            <span>./start_project.ps1</span>
                        </div>
                    </div>

                    <div className="flex flex-col md:flex-row gap-4 justify-center">
                        <button
                            onClick={() => navigate('/dashboard/student')}
                            className="px-6 py-3 rounded-xl border border-slate-200 text-slate-600 font-bold hover:bg-slate-50 transition flex items-center justify-center gap-2"
                        >
                            <ArrowLeft size={18} /> Back to Dashboard
                        </button>
                        <a
                            href={`http://localhost:${currentModule.port}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`px-6 py-3 rounded-xl text-white font-bold transition shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2 ${currentModule.color.replace('text', 'bg').replace('600', '600')} hover:opacity-90`}
                        >
                            Retry Connection ({currentModule.port})
                        </a>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default ModulePlaceholder;
