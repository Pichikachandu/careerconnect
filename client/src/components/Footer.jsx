import React from 'react';
import { Link } from 'react-router-dom';
import { Github, Twitter, Linkedin, Instagram, MapPin, Mail, Phone, ArrowRight, Heart } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="bg-[#0F172A] text-slate-300 font-sans border-t border-slate-800 relative overflow-hidden">
            {/* Background Glows */}
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl pointer-events-none"></div>
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl pointer-events-none"></div>

            <div className="container mx-auto px-6 pt-20 pb-12 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-16">
                    {/* Brand Section (4 cols) */}
                    <div className="lg:col-span-4 space-y-6">
                        <Link to="/" className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 inline-block">
                            CareerConnect
                        </Link>
                        <p className="text-slate-400 leading-relaxed text-lg max-w-sm">
                            Bridging the gap between ambition and opportunity. The smartest way to manage campus placements.
                        </p>
                        <div className="flex gap-4 pt-4">
                            <SocialLink href="#" icon={Github} />
                            <SocialLink href="#" icon={Linkedin} />
                            <SocialLink href="#" icon={Twitter} />
                            <SocialLink href="#" icon={Instagram} />
                        </div>
                    </div>

                    {/* Links Sections (2 cols each) */}
                    <div className="lg:col-span-2">
                        <h4 className="text-white font-bold text-lg mb-6">Platform</h4>
                        <ul className="space-y-4">
                            <li><FooterLink to="/">Home</FooterLink></li>
                            <li><FooterLink to="/#features">Features</FooterLink></li>
                            <li><FooterLink to="/#about">About Us</FooterLink></li>
                            <li><FooterLink to="/contact">Contact Support</FooterLink></li>
                        </ul>
                    </div>

                    <div className="lg:col-span-2">
                        <h4 className="text-white font-bold text-lg mb-6">Portals</h4>
                        <ul className="space-y-4">
                            <li><FooterLink to="/login/student">Student Login</FooterLink></li>
                            <li><FooterLink to="/login/company">Recruiters</FooterLink></li>
                            <li><FooterLink to="/login/admin">Administration</FooterLink></li>
                            <li><FooterLink to="/resume">Resume Builder</FooterLink></li>
                        </ul>
                    </div>

                    {/* Newsletter / Contact (4 cols) */}
                    <div className="lg:col-span-4 space-y-6">
                        <h4 className="text-white font-bold text-lg mb-2">Stay Updated</h4>
                        <p className="text-slate-400 text-sm">Subscribe to our newsletter for the latest placement trends and tips.</p>

                        <div className="relative group">
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className="w-full bg-slate-800/50 border border-slate-700 text-white rounded-xl py-4 px-5 pr-14 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder:text-slate-600"
                            />
                            <button className="absolute right-2 top-2 p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition-colors shadow-lg shadow-blue-500/20">
                                <ArrowRight size={20} />
                            </button>
                        </div>

                        <div className="pt-6 border-t border-slate-800/50 flex flex-col gap-3">
                            <div className="flex items-center gap-3 text-slate-400 hover:text-blue-400 transition-colors cursor-pointer">
                                <Mail size={18} />
                                <span>placement.cell@somaiya.edu</span>
                            </div>
                            <div className="flex items-center gap-3 text-slate-400 hover:text-green-400 transition-colors cursor-pointer">
                                <Phone size={18} />
                                <span>+91 22 1234 5678</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-6">
                    <p className="text-slate-500 text-sm">
                        &copy; {new Date().getFullYear()} CareerConnect. All rights reserved.
                    </p>
                    <div className="flex items-center gap-2 text-sm text-slate-500">
                        <span>Made with</span>
                        <Heart size={14} className="text-red-500 fill-red-500 animate-pulse" />
                        <span>for Students</span>
                    </div>
                    <div className="flex gap-8 text-sm text-slate-500 font-medium">
                        <a href="#" className="hover:text-white transition-colors">Privacy</a>
                        <a href="#" className="hover:text-white transition-colors">Terms</a>
                        <a href="#" className="hover:text-white transition-colors">Cookies</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

const SocialLink = ({ href, icon: Icon }) => (
    <a href={href} className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-800/50 border border-slate-700 text-slate-400 hover:bg-blue-600 hover:border-blue-500 hover:text-white transition-all duration-300 transform hover:-translate-y-1">
        <Icon size={20} />
    </a>
);

const FooterLink = ({ to, children }) => (
    <Link to={to} className="text-slate-400 hover:text-blue-400 hover:translate-x-1 transition-all duration-300 inline-block">
        {children}
    </Link>
);

export default Footer;
