import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import StudentLayout from '../../components/StudentLayout';
import { Video, Mic, BrainCircuit, Play, Info, X, ChevronDown, Check } from 'lucide-react';

const InterviewDashboard = () => {
    const navigate = useNavigate();
    const [config, setConfig] = useState({
        jobRole: '',
        techStack: '',
        experience: 0,
        scenarioBased: false,
        topic: ''
    });

    const getRoleBasedTopics = () => {
        const { jobRole = '', techStack = '' } = config;
        const role = jobRole.toLowerCase();
        const stack = techStack.toLowerCase();
        
        // Base topics that are always relevant
        const baseTopics = [
            'System Design',
            'Error Handling',
            'Performance Optimization',
            'Code Review Scenarios',
            'Team Collaboration',
            'Technical Debt Management'
        ];

        // Role-specific topics
        const roleTopics = [];
        if (role.includes('front') || role.includes('react') || role.includes('angular') || role.includes('vue')) {
            roleTopics.push(
                'Component Architecture',
                'State Management',
                'UI/UX Implementation',
                'Cross-browser Compatibility',
                'Frontend Performance'
            );
        }
        
        if (role.includes('back') || role.includes('node') || role.includes('java') || role.includes('python') || role.includes('.net')) {
            roleTopics.push(
                'API Design',
                'Database Optimization',
                'Authentication & Authorization',
                'Caching Strategies',
                'Microservices Architecture'
            );
        }

        if (role.includes('devops') || role.includes('sre')) {
            roleTopics.push(
                'CI/CD Pipelines',
                'Infrastructure as Code',
                'Container Orchestration',
                'Monitoring & Logging',
                'Disaster Recovery'
            );
        }

        // Stack-specific topics
        const stackTopics = [];
        if (stack.includes('react')) {
            stackTopics.push('React Hooks', 'Context API', 'Server Components');
        }
        if (stack.includes('node')) {
            stackTopics.push('Async Programming', 'Event Loop', 'Stream Processing');
        }
        if (stack.includes('aws') || stack.includes('azure') || stack.includes('gcp')) {
            stackTopics.push('Cloud Architecture', 'Serverless Computing', 'Cloud Security');
        }
        if (stack.includes('sql') || stack.includes('postgres') || stack.includes('mysql')) {
            stackTopics.push('Query Optimization', 'Database Indexing', 'Transaction Management');
        }
        if (stack.includes('nosql') || stack.includes('mongo') || stack.includes('dynamo')) {
            stackTopics.push('Data Modeling', 'Sharding', 'CAP Theorem');
        }

        // Combine and dedupe
        return [...new Set([...baseTopics, ...roleTopics, ...stackTopics])];
    };

    const [showTopicSuggestions, setShowTopicSuggestions] = useState(false);
    const [topicSearch, setTopicSearch] = useState('');
    const [showInfo, setShowInfo] = useState(false);

    const filteredTopics = useMemo(() => {
        const topics = getRoleBasedTopics();
        if (!topicSearch) return topics;
        return topics.filter(topic => 
            topic.toLowerCase().includes(topicSearch.toLowerCase())
        );
    }, [topicSearch, config.jobRole, config.techStack]);

    const toggleScenarioBased = () => {
        setConfig(prev => ({
            ...prev,
            scenarioBased: !prev.scenarioBased,
            topic: !prev.scenarioBased ? '' : prev.topic
        }));
        setShowTopicSuggestions(false);
    };

    const selectTopic = (topic) => {
        setConfig(prev => ({ ...prev, topic }));
        setTopicSearch('');
        setShowTopicSuggestions(false);
    };

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

                            {/* Scenario-based Toggle */}
                            <div className="md:col-span-2">
                                <div className="flex items-center gap-3 mb-2">
                                    <button
                                        type="button"
                                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 ${config.scenarioBased ? 'bg-emerald-600' : 'bg-slate-200'}`}
                                        onClick={toggleScenarioBased}
                                    >
                                        <span
                                            className={`${config.scenarioBased ? 'translate-x-6' : 'translate-x-1'} inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                                        />
                                    </button>
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm font-medium text-slate-700">Scenario-based Questions</span>
                                        <button 
                                            type="button" 
                                            className="text-slate-400 hover:text-slate-600"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setShowInfo(!showInfo);
                                            }}
                                        >
                                            <Info size={16} />
                                        </button>
                                    </div>
                                </div>

                                {showInfo && (
                                    <div className="mb-4 p-4 bg-blue-50 border border-blue-100 rounded-lg text-sm text-blue-700">
                                        <div className="flex justify-between items-start mb-2">
                                            <h4 className="font-bold">About Scenario-based Questions</h4>
                                            <button 
                                                onClick={() => setShowInfo(false)}
                                                className="text-blue-500 hover:text-blue-700"
                                            >
                                                <X size={16} />
                                            </button>
                                        </div>
                                        <p className="mb-2">Scenario-based questions present real-world situations to test your problem-solving skills in context.</p>
                                        <p className="font-medium">Example Topics:</p>
                                        <ul className="list-disc pl-5 space-y-1 mt-1">
                                            <li>System Design: Design a URL shortening service</li>
                                            <li>Error Handling: Debug a production API issue</li>
                                            <li>Performance: Optimize a slow database query</li>
                                        </ul>
                                    </div>
                                )}

                                {config.scenarioBased && (
                                    <div className="mt-2 relative">
                                        <div className="flex justify-between items-center mb-2">
                                            <label className="block text-sm font-medium text-slate-700">
                                                Scenario Topic
                                            </label>
                                            <button 
                                                type="button"
                                                onClick={() => setShowTopicSuggestions(!showTopicSuggestions)}
                                                className="text-xs text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
                                            >
                                                {showTopicSuggestions ? 'Hide suggestions' : 'Show suggestions'}
                                                <ChevronDown size={14} className={`transition-transform ${showTopicSuggestions ? 'rotate-180' : ''}`} />
                                            </button>
                                        </div>
                                        
                                        {showTopicSuggestions && (
                                            <div className="absolute z-10 w-full mt-1 bg-white border border-slate-200 rounded-lg shadow-lg overflow-hidden">
                                                <div className="p-2 border-b border-slate-100">
                                                    <input
                                                        type="text"
                                                        placeholder="Search topics..."
                                                        className="w-full p-2 text-sm border border-slate-200 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                                                        value={topicSearch}
                                                        onChange={(e) => setTopicSearch(e.target.value)}
                                                        onClick={(e) => e.stopPropagation()}
                                                    />
                                                </div>
                                                <div className="max-h-48 overflow-y-auto">
                                                    {filteredTopics.map((topic) => (
                                                        <button
                                                            key={topic}
                                                            type="button"
                                                            className="w-full text-left px-4 py-2 text-sm hover:bg-slate-50 flex items-center justify-between"
                                                            onClick={() => selectTopic(topic)}
                                                        >
                                                            {topic}
                                                            {config.topic === topic && <Check size={16} className="text-emerald-500" />}
                                                        </button>
                                                    ))}
                                                    {filteredTopics.length === 0 && (
                                                        <div className="p-4 text-sm text-slate-500 text-center">
                                                            No matching topics found
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        )}

                                        <input
                                            type="text"
                                            placeholder="e.g. System Design, Error Handling, Performance Optimization"
                                            className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 outline-none focus:ring-2 focus:ring-emerald-500"
                                            value={config.topic}
                                            onChange={(e) => setConfig({ ...config, topic: e.target.value })}
                                            onClick={() => setShowTopicSuggestions(false)}
                                            required={config.scenarioBased}
                                        />
                                        <div className="mt-2">
                                            <p className="text-xs text-slate-400 mb-1">
                                                {!config.topic 
                                                    ? 'Enter or select a topic for scenario-based questions' 
                                                    : `You'll get realistic scenarios about: ${config.topic}`}
                                            </p>
                                            {config.scenarioBased && config.techStack && (
                                                <p className="text-xs text-slate-500 italic">
                                                    Suggestions based on: {config.jobRole || 'your role'} {config.techStack && `and ${config.techStack}`}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="mt-8 flex justify-end">
                            <button
                                onClick={startInterview}
                                disabled={!config.jobRole || !config.techStack || (config.scenarioBased && !config.topic)}
                                className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg shadow-emerald-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
                                title={config.scenarioBased && !config.topic ? 'Please enter a topic for scenario-based questions' : ''}
                            >
                                <Play size={20} />
                                Start {config.scenarioBased ? 'Scenario ' : ''}Interview
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
