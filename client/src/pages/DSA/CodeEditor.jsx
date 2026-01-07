import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import Editor from '@monaco-editor/react';
import { Play, ArrowLeft, CheckCircle, XCircle, Loader, Save, Code, FileCode, Terminal, Settings, ChevronDown, BookOpen, Send } from 'lucide-react';

const CodeEditor = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation(); // For accessing state passed from dashboard
    const [problem, setProblem] = useState(null);
    const [code, setCode] = useState("// Loading template...");
    const [language, setLanguage] = useState('python');
    const [output, setOutput] = useState('');
    const [running, setRunning] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    // Templates
    const templates = {
        python: `def solve():\n    # Write your code here\n    print("Hello World")\n\nif __name__ == "__main__":\n    solve()`,
        cpp: `#include <iostream>\nusing namespace std;\n\nint main() {\n    // Write your code here\n    cout << "Hello World";\n    return 0;\n}`,
        c: `#include <stdio.h>\n\nint main() {\n    // Write your code here\n    printf("Hello World");\n    return 0;\n}`,
        java: `public class Main {\n    public static void main(String[] args) {\n        // Write your code here\n        System.out.println("Hello World");\n    }\n}`
    };

    useEffect(() => {
        fetchProblem();
        setCode(templates[language]);
    }, [id]);

    const fetchProblem = async () => {
        try {
            const res = await axios.get(`http://localhost:3000/api/dsa/questions?qid=${id}`);
            setProblem(res.data);
        } catch (err) {
            console.error("Error loading problem", err);
        }
    };

    const handleLanguageChange = (e) => {
        const newLang = e.target.value;
        setLanguage(newLang);
        setCode(templates[newLang]);
    };

    const runCode = async () => {
        setRunning(true);
        setOutput("Running...");
        try {
            const res = await axios.post('http://localhost:3000/api/dsa/run', {
                language,
                code,
                input: ""
            });

            if (res.data.error) {
                setOutput(`Error:\n${res.data.output}`);
            } else {
                setOutput(res.data.output);
            }
        } catch (err) {
            setOutput("Execution failed. Server might be offline.");
        }
        setRunning(false);
        return { error: false, output: "Mock Output" }; // Return for submit handler
    };

    const handleSubmit = async () => {
        setSubmitting(true);
        // 1. Run Code First (Mocking run result usage here as true run is async on state)
        // In real app, we'd wait for runCode result. 
        // For now, we'll re-run logic or just assumes 'Run' was clicked and we trust the user?
        // Better: Execute run logic here.
        setRunning(true);
        setOutput("Evaluating...");

        try {
            const runRes = await axios.post('http://localhost:3000/api/dsa/run', {
                language, code, input: ""
            });

            const isError = runRes.data.error;
            setOutput(isError ? `Error:\n${runRes.data.output}` : runRes.data.output);
            setRunning(false);

            // 2. Submit Result
            const user = JSON.parse(localStorage.getItem('user'));
            if (user) {
                await axios.post('http://localhost:3000/api/dsa/submit', {
                    username: user.username,
                    qid: problem.QID,
                    title: problem.title,
                    difficulty: problem.difficulty,
                    status: isError ? 'Failed' : 'Solved'
                });
                if (!isError) alert("Solution Submitted Successfully!");
            }
        } catch (err) {
            console.error(err);
            setOutput("Execution Error");
        }
        setSubmitting(false);
        setRunning(false);
    };

    if (!problem) return (
        <div className="h-screen bg-gray-50 flex items-center justify-center text-slate-500 font-sans">
            <Loader className="animate-spin text-indigo-600 mr-3" /> Loading Workspace...
        </div>
    );

    return (
        <div className="h-screen bg-gray-50 flex flex-col font-sans text-slate-900 overflow-hidden">

            {/* Top Toolbar - Matches Student Dashboard Header */}
            <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 shrink-0 shadow-sm z-20">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate('/dsa')}
                        className="p-2 hover:bg-gray-100 rounded-xl text-slate-500 hover:text-indigo-600 transition-colors group border border-transparent hover:border-gray-200"
                        title="Back to Questions"
                    >
                        <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                    </button>

                    <div>
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-indigo-50 text-indigo-600 rounded-lg flex items-center justify-center hidden md:flex">
                                <Code size={18} />
                            </div>
                            <div>
                                <h2 className="font-bold text-gray-900 text-lg truncate max-w-md leading-tight">
                                    {problem.title}
                                </h2>
                                <p className="text-xs text-slate-500 font-medium">Problem #{id}</p>
                            </div>
                        </div>
                    </div>

                    <span className={`ml-4 text-[10px] uppercase font-bold px-3 py-1 rounded-full tracking-wider border
                        ${problem.difficulty === 'Easy' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                            problem.difficulty === 'Medium' ? 'bg-amber-50 text-amber-600 border-amber-100' :
                                'bg-red-50 text-red-600 border-red-100'}`}>
                        {problem.difficulty}
                    </span>

                    {/* Show Solved Status if passed from Dashboard */}
                    {location.state?.isSolved && (
                        <span className="ml-2 flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-100 px-3 py-1 rounded-full border border-emerald-200">
                            <CheckCircle size={12} className="fill-current" /> SOLVED
                        </span>
                    )}
                </div>

                <div className="flex items-center gap-4">
                    {/* Language Selector */}
                    <div className="relative group">
                        <Code size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                        <select
                            value={language}
                            onChange={handleLanguageChange}
                            className="bg-white border border-gray-200 text-slate-700 pl-9 pr-8 py-2 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 hover:border-gray-300 transition-all appearance-none cursor-pointer text-sm font-bold shadow-sm"
                        >
                            <option value="python">Python 3</option>
                            <option value="cpp">C++</option>
                            <option value="c">C</option>
                            <option value="java">Java 17</option>
                        </select>
                        <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                    </div>

                    <div className="h-8 w-px bg-gray-200 mx-1"></div>

                    <button
                        onClick={runCode}
                        disabled={running}
                        className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white px-5 py-2 rounded-xl font-bold text-sm transition-all shadow-lg shadow-indigo-500/30 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
                    >
                        {running ? <Loader size={18} className="animate-spin" /> : <Play size={18} className="fill-current" />}
                        Run Code
                    </button>

                    <button
                        onClick={handleSubmit}
                        disabled={running || submitting}
                        className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2 rounded-xl font-bold text-sm transition-all shadow-lg shadow-emerald-500/30 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {submitting ? <Loader size={18} className="animate-spin" /> : <Send size={18} />}
                        Submit
                    </button>
                </div>
            </header>

            {/* Main Workspace - Hybrid Layout */}
            <div className="flex-grow flex overflow-hidden p-6 gap-6">

                {/* Left: Problem Description - Card Style */}
                <div className="w-5/12 bg-white rounded-2xl shadow-sm border border-gray-200 flex flex-col overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
                        <div className="flex items-center gap-2 text-slate-700 font-bold">
                            <BookOpen size={18} className="text-indigo-500" />
                            Description
                        </div>
                    </div>

                    <div className="flex-grow overflow-y-auto px-6 py-6 custom-scrollbar">
                        <div className="prose prose-slate prose-sm max-w-none text-slate-600 leading-relaxed font-medium">
                            {/* Problem Body */}
                            <div dangerouslySetInnerHTML={{ __html: problem.Body }} />
                        </div>

                        {/* Example Block - Light Theme */}
                        <div className="mt-8 p-4 bg-slate-50 rounded-xl border border-slate-100">
                            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Example Case</h4>
                            <div className="space-y-3">
                                <div>
                                    <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Input</span>
                                    <div className="bg-white p-2 rounded-lg border border-slate-200 text-xs font-mono text-slate-600 shadow-sm">stdin example...</div>
                                </div>
                                <div>
                                    <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Output</span>
                                    <div className="bg-white p-2 rounded-lg border border-slate-200 text-xs font-mono text-slate-600 shadow-sm">stdout result...</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right: Code Editor & Output - Dark Mode Inside Card */}
                <div className="w-7/12 flex flex-col gap-4">

                    {/* Editor Card */}
                    <div className="flex-grow bg-[#1e1e1e] rounded-2xl shadow-xl overflow-hidden border border-slate-800 flex flex-col relative group">
                        <div className="h-10 bg-[#252526] border-b border-[#333] flex items-center justify-between px-4 shrink-0">
                            <div className="flex items-center gap-2">
                                <Code size={14} className="text-blue-400" />
                                <span className="text-xs font-bold text-slate-400 group-hover:text-slate-200 transition-colors">main.{language === 'python' ? 'py' : language === 'cpp' ? 'cpp' : language}</span>
                            </div>
                            <span className="text-[10px] text-slate-500">Auto-saved</span>
                        </div>

                        <div className="flex-grow relative">
                            <Editor
                                height="100%"
                                language={language === 'c' || language === 'cpp' ? 'cpp' : language}
                                theme="vs-dark"
                                value={code}
                                onChange={(value) => setCode(value)}
                                options={{
                                    minimap: { enabled: false },
                                    fontSize: 14,
                                    fontFamily: "'JetBrains Mono', 'Fira Code', Consolas, monospace",
                                    scrollBeyondLastLine: false,
                                    automaticLayout: true,
                                    padding: { top: 16, bottom: 16 },
                                    tabSize: 4
                                }}
                            />
                        </div>
                    </div>

                    {/* Output Console - Dark Card */}
                    <div className="h-1/3 bg-[#1e1e1e] rounded-2xl shadow-xl overflow-hidden border border-slate-800 flex flex-col">
                        <div className="px-4 py-2 bg-[#252526] border-b border-[#333] flex justify-between items-center">
                            <div className="flex items-center gap-2">
                                <Terminal size={14} className="text-emerald-400" />
                                <span className="text-xs font-bold text-slate-300 uppercase tracking-wide">Terminal</span>
                            </div>
                            {running && (
                                <span className="text-[10px] text-amber-400 animate-pulse font-bold flex items-center gap-1">
                                    <Loader size={10} className="animate-spin" /> RUNNING
                                </span>
                            )}
                        </div>

                        <div className="flex-grow p-4 font-mono text-xs overflow-y-auto custom-scrollbar bg-[#1e1e1e] text-slate-300">
                            {output ? (
                                <pre className={`whitespace-pre-wrap leading-relaxed ${output.startsWith('Error') ? 'text-red-400' : 'text-emerald-400'}`}>
                                    {output}
                                </pre>
                            ) : (
                                <div className="h-full flex flex-col items-center justify-center text-slate-600 opacity-50">
                                    <div className="text-center">
                                        <Terminal size={24} className="mx-auto mb-2 opacity-50" />
                                        <p>Ready to execute</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CodeEditor;
