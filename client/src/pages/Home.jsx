import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Monitor, Cpu, BarChart, ArrowRight, CheckCircle, Smartphone, Award, Users } from 'lucide-react';
import { Link } from 'react-router-dom';

const Home = () => {
    return (
        <div className="flex flex-col min-h-screen font-sans">
            <Header />

            <main className="flex-grow">
                {/* Hero Section */}
                <section className="relative min-h-screen flex items-center pt-20 overflow-hidden bg-slate-900">
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-slate-900 to-blue-900 opacity-90"></div>
                    {/* Abstract Shapes */}
                    <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl"></div>

                    <div className="relative container mx-auto px-6 grid md:grid-cols-2 gap-12 items-center z-10">
                        <div className="text-left space-y-6">
                            <div className="inline-block px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-400/20 text-blue-300 text-sm font-medium mb-4 animate-fade-in">
                                🚀 The Future of Campus Placements
                            </div>
                            <h1 className="text-5xl md:text-7xl font-bold text-white leading-tight tracking-tight">
                                Launch Your <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">Dream Career</span>
                            </h1>
                            <p className="text-lg md:text-xl text-slate-300 max-w-lg leading-relaxed">
                                Master your placements with an all-in-one AI ecosystem. From DSA practice and Mock Interviews to ATS-optimized resumes, we provide the ultimate edge.
                            </p>
                            <div className="flex flex-wrap gap-4 pt-4">
                                <Link to="/login/student" className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-bold shadow-lg shadow-blue-500/30 transition-all hover:scale-105 flex items-center gap-2">
                                    Get Started <ArrowRight size={20} />
                                </Link>
                                <a href="#features" className="px-8 py-4 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-full font-bold backdrop-blur-sm transition-all flex items-center gap-2">
                                    Learn More
                                </a>
                            </div>
                        </div>
                        {/* Hero Image/Graphic */}
                        <div className="relative hidden md:block group">
                            <div className="absolute inset-0 bg-blue-500/20 rounded-2xl transform rotate-6 border border-white/10 blur-sm group-hover:rotate-3 transition-transform duration-500"></div>
                            <img
                                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2671&auto=format&fit=crop"
                                alt="Students Collaborating"
                                className="relative rounded-2xl shadow-2xl border border-white/10 transform transition-transform duration-500 group-hover:-translate-y-2"
                            />
                            {/* Floating Card 1 */}
                            <div className="absolute -bottom-8 -left-8 bg-white/90 backdrop-blur-md p-4 rounded-xl shadow-xl flex items-center gap-4 animate-float">
                                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                                    <CheckCircle size={24} />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 font-medium">Placements</p>
                                    <p className="text-lg font-bold text-gray-800">98% Success</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Features Section - Glassmorphism Cards */}
                <section id="features" className="py-24 bg-gray-50 relative">
                    <div className="container mx-auto px-6">
                        <div className="text-center mb-16 max-w-3xl mx-auto">
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Why Choose CareerConnect?</h2>
                            <p className="text-lg text-gray-600">We bridge the gap between talent and opportunity with state-of-the-art technology and intuitive design.</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 group">
                                <div className="w-14 h-14 bg-blue-50 rounded-xl flex items-center justify-center mb-6 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                    <Cpu size={28} />
                                </div>
                                <h3 className="text-xl font-bold mb-3 text-gray-800">AI-Powered Ecosystem</h3>
                                <p className="text-gray-600 leading-relaxed">
                                    Prepare with specialized modules: AI Mock Interviews, a professional DSA Code Editor, and an English Communication Coach.
                                </p>
                            </div>

                            <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 group">
                                <div className="w-14 h-14 bg-purple-50 rounded-xl flex items-center justify-center mb-6 text-purple-600 group-hover:bg-purple-600 group-hover:text-white transition-colors">
                                    <Smartphone size={28} />
                                </div>
                                <h3 className="text-xl font-bold mb-3 text-gray-800">Resume Intelligence</h3>
                                <p className="text-gray-600 leading-relaxed">
                                    Build professional resumes and get instant feedback with our integrated ATS Scanner to beat the screening bots.
                                </p>
                            </div>

                            <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 group">
                                <div className="w-14 h-14 bg-indigo-50 rounded-xl flex items-center justify-center mb-6 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                                    <BarChart size={28} />
                                </div>
                                <h3 className="text-xl font-bold mb-3 text-gray-800">Direct Hiring Pipeline</h3>
                                <p className="text-gray-600 leading-relaxed">
                                    Connect directly with recruiters. Track your applications and placement status in real-time through unified dashboards.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Stats/About Section */}
                <section id="about" className="py-24 bg-white">
                    <div className="container mx-auto px-6">
                        <div className="flex flex-col md:flex-row items-center gap-16">
                            <div className="md:w-1/2 relative">
                                <div className="absolute -inset-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl opacity-20 blur-lg"></div>
                                <img src="/images/career.jpg" alt="Team" className="relative rounded-2xl shadow-2xl w-full object-cover h-[400px]" />
                            </div>
                            <div className="md:w-1/2 space-y-8">
                                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
                                    Empowering Students for <span className="text-blue-600">Global Success</span>
                                </h2>
                                <p className="text-gray-600 text-lg">
                                    CareerConnect is more than just a portal; it's a comprehensive training and placement ecosystem designed to prepare students for the rigorous demands of the modern tech industry.
                                </p>

                                <div className="grid grid-cols-2 gap-6">
                                    <div className="p-4 bg-gray-50 rounded-xl">
                                        <div className="text-3xl font-bold text-blue-600 mb-1">500+</div>
                                        <div className="text-sm text-gray-500 font-medium">Partner Companies</div>
                                    </div>
                                    <div className="p-4 bg-gray-50 rounded-xl">
                                        <div className="text-3xl font-bold text-purple-600 mb-1">10k+</div>
                                        <div className="text-sm text-gray-500 font-medium">Students Placed</div>
                                    </div>
                                    <div className="p-4 bg-gray-50 rounded-xl">
                                        <div className="text-3xl font-bold text-indigo-600 mb-1">50+</div>
                                        <div className="text-sm text-gray-500 font-medium">Colleges</div>
                                    </div>
                                    <div className="p-4 bg-gray-50 rounded-xl">
                                        <div className="text-3xl font-bold text-pink-600 mb-1">24/7</div>
                                        <div className="text-sm text-gray-500 font-medium">AI Support</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="py-20 bg-slate-900 text-white relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl"></div>

                    <div className="container mx-auto px-6 text-center relative z-10">
                        <h2 className="text-4xl font-bold mb-6">Ready to Start Your Journey?</h2>
                        <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">Create your profile today and unlock a world of opportunities. Your dream job is just a click away.</p>
                        <div className="flex flex-col md:flex-row justify-center gap-4">
                            <Link to="/login/student" className="px-8 py-4 bg-white text-blue-900 rounded-full font-bold shadow-lg hover:bg-gray-100 transition-all transform hover:-translate-y-1">
                                Register as Student
                            </Link>
                            <Link to="/login/company" className="px-8 py-4 bg-blue-600 text-white rounded-full font-bold shadow-lg hover:bg-blue-700 transition-all transform hover:-translate-y-1">
                                Hire Talent
                            </Link>
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
};

export default Home;
