import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Mail,
    Phone,
    MapPin,
    Send,
    MessageSquare,
    Clock,
    ChevronDown,
    HelpCircle,
    ArrowRight,
    Globe,
    Twitter,
    Linkedin,
    Instagram,
    CheckCircle2
} from 'lucide-react';

const Contact = () => {
    // Scroll to top on mount
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });
    const [activeFaq, setActiveFaq] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        await new Promise(resolve => setTimeout(resolve, 1500));
        setSubmitting(false);
        setSubmitted(true);
        setFormData({ name: '', email: '', subject: '', message: '' });
    };

    const faqs = [
        {
            question: "How do I register as a student?",
            answer: "Click on the 'Login' dropdown in the navigation bar, select 'Student Portal', and then click on 'Create Account'. Fill in your academic details to get started."
        },
        {
            question: "Can companies post jobs directly?",
            answer: "Yes, registered recruiters can post job openings directly from their dashboard. These are instantly visible to eligible students."
        },
        {
            question: "Is the aptitude test mandatory?",
            answer: "While not mandatory for registration, a high aptitude score significantly improves your visibility to top-tier recruiters."
        }
    ];

    return (
        <div className="flex flex-col min-h-screen bg-[#fafbff] font-sans selection:bg-blue-100 selection:text-blue-900">
            <Header />

            <main className="flex-grow">
                {/* Immersive Hero Section - Flows behind Header */}
                <section className="relative min-h-[70vh] flex items-center pt-20 overflow-hidden bg-slate-950">
                    <div className="absolute inset-0">
                        {/* Mesh Gradient Background */}
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(30,58,138,0.3)_0%,_transparent_50%)] animate-pulse"></div>
                        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-indigo-950 via-slate-950 to-blue-950"></div>
                        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/20 rounded-full blur-[120px] animate-blob"></div>
                        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-600/20 rounded-full blur-[120px] animate-blob animation-delay-2000"></div>
                    </div>

                    <div className="relative container mx-auto px-6 z-10">
                        <div className="max-w-4xl">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md text-blue-300 text-sm font-bold mb-8"
                            >
                                <div className="w-2 h-2 rounded-full bg-blue-500 animate-ping" />
                                24/7 Global Support Ready
                            </motion.div>

                            <motion.h1
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, ease: "easeOut" }}
                                className="text-5xl md:text-7xl font-black text-white mb-8 tracking-tighter leading-[1.1]"
                            >
                                Let's Connect <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400">
                                    to Build the Future.
                                </span>
                            </motion.h1>

                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2, duration: 0.8 }}
                                className="text-xl text-slate-400 max-w-2xl font-medium leading-relaxed"
                            >
                                Whether you're a student looking for guidance or a company ready to hire top talent, our team is standing by to assist you.
                            </motion.p>
                        </div>
                    </div>

                    {/* Decorative Scroll Indicator */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1 }}
                        className="absolute bottom-10 left-1/2 -translate-x-1/2 hidden md:block"
                    >
                        <div className="w-6 h-10 border-2 border-white/20 rounded-full flex justify-center p-1">
                            <motion.div
                                animate={{ y: [0, 12, 0] }}
                                transition={{ repeat: Infinity, duration: 2 }}
                                className="w-1 h-2 bg-blue-400 rounded-full"
                            />
                        </div>
                    </motion.div>
                </section>

                <section className="py-24 relative z-20">
                    <div className="container mx-auto px-6">
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">

                            {/* Left Column: Premium Contact Cards */}
                            <div className="lg:col-span-4 space-y-8">
                                <motion.div
                                    initial={{ opacity: 0, x: -30 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    className="p-1 w-full rounded-[2.5rem] bg-gradient-to-b from-slate-200 to-transparent shadow-2xl shadow-slate-200/50"
                                >
                                    <div className="bg-white p-10 rounded-[2.3rem] h-full">
                                        <h3 className="text-2xl font-black text-slate-900 mb-10 tracking-tight">Direct Access</h3>
                                        <div className="space-y-10">
                                            <ContactDetail
                                                icon={Mail}
                                                title="Email Us"
                                                content="hello@careerconnect.io"
                                                link="mailto:hello@careerconnect.io"
                                                color="text-blue-600"
                                                bg="bg-blue-50"
                                            />
                                            <ContactDetail
                                                icon={Phone}
                                                title="Call Center"
                                                content="+91 (22) 6644 9191"
                                                link="tel:+912266449191"
                                                color="text-indigo-600"
                                                bg="bg-indigo-50"
                                            />
                                            <ContactDetail
                                                icon={MapPin}
                                                title="HQ Address"
                                                content="Vidyavihar, Mumbai 400077"
                                                color="text-slate-600"
                                                bg="bg-slate-100"
                                            />
                                        </div>
                                    </div>
                                </motion.div>

                                <motion.div
                                    initial={{ opacity: 0, x: -30 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: 0.2 }}
                                    className="bg-slate-900 p-10 rounded-[2.5rem] shadow-2xl text-white relative overflow-hidden group border border-white/5"
                                >
                                    <div className="absolute -top-24 -right-24 w-64 h-64 bg-blue-600/20 rounded-full blur-3xl group-hover:bg-blue-600/40 transition-all duration-700" />
                                    <h3 className="text-2xl font-black mb-6 relative z-10 tracking-tight">Stay Updated</h3>
                                    <p className="text-slate-400 mb-8 text-sm font-medium relative z-10 leading-relaxed">
                                        Join 50k+ professionals on our networks for the latest placement alerts.
                                    </p>
                                    <div className="flex gap-4 relative z-10">
                                        <SocialIcon icon={Linkedin} />
                                        <SocialIcon icon={Twitter} />
                                        <SocialIcon icon={Instagram} />
                                    </div>
                                </motion.div>
                            </div>

                            {/* Right Column: Modern Contact Form */}
                            <motion.div
                                initial={{ opacity: 0, y: 40 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.8 }}
                                className="lg:col-span-8"
                            >
                                <div className="bg-white rounded-[3rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.08)] border border-slate-100 overflow-hidden outline outline-4 outline-slate-50">
                                    <div className="p-10 md:p-16">
                                        <div className="mb-14">
                                            <h2 className="text-4xl font-black text-slate-900 mb-4 tracking-tight">Drop us a Line</h2>
                                            <p className="text-slate-500 font-medium text-lg leading-relaxed max-w-md">
                                                Expected response time: <span className="text-blue-600 font-bold">~2 hours</span>
                                            </p>
                                        </div>

                                        <AnimatePresence mode="wait">
                                            {submitted ? (
                                                <motion.div
                                                    initial={{ opacity: 0, scale: 0.9 }}
                                                    animate={{ opacity: 1, scale: 1 }}
                                                    exit={{ opacity: 0, scale: 0.9 }}
                                                    className="py-20 text-center"
                                                >
                                                    <div className="w-24 h-24 bg-blue-50 text-blue-600 rounded-3xl flex items-center justify-center mx-auto mb-8 rotate-12">
                                                        <CheckCircle2 size={48} />
                                                    </div>
                                                    <h3 className="text-4xl font-black text-slate-900 mb-4 tracking-tight">Mission Success!</h3>
                                                    <p className="text-slate-500 font-medium max-w-xs mx-auto mb-10 text-lg">
                                                        Our bots have delivered your message to the support team.
                                                    </p>
                                                    <button
                                                        onClick={() => setSubmitted(false)}
                                                        className="px-8 py-4 bg-slate-900 text-white font-bold rounded-2xl hover:bg-blue-600 transition-all shadow-xl active:scale-95"
                                                    >
                                                        Send Another One
                                                    </button>
                                                </motion.div>
                                            ) : (
                                                <form onSubmit={handleSubmit} className="space-y-10">
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                                        <FloatingInput label="Full Name" name="name" value={formData.name} onChange={handleChange} />
                                                        <FloatingInput label="Professional Email" name="email" type="email" value={formData.email} onChange={handleChange} />
                                                    </div>
                                                    <FloatingInput label="Topic of Interest" name="subject" value={formData.subject} onChange={handleChange} />

                                                    <div className="relative group">
                                                        <textarea
                                                            name="message"
                                                            value={formData.message}
                                                            onChange={handleChange}
                                                            rows="5"
                                                            className="w-full px-8 py-6 bg-slate-50 border-2 border-slate-100 rounded-[2rem] focus:outline-none focus:border-blue-500 focus:bg-white transition-all peer resize-none font-medium placeholder:opacity-0 focus:placeholder:opacity-100"
                                                            placeholder="Type your message here..."
                                                            required
                                                        />
                                                        <label className="absolute left-8 top-6 text-slate-400 font-bold transition-all pointer-events-none peer-focus:-top-4 peer-focus:left-6 peer-focus:text-blue-600 peer-focus:text-xs peer-focus:bg-white peer-focus:px-3 peer-[:not(:placeholder-shown)]:-top-4 peer-[:not(:placeholder-shown)]:left-6 peer-[:not(:placeholder-shown)]:text-blue-600 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:bg-white peer-[:not(:placeholder-shown)]:px-3">
                                                            Your Message
                                                        </label>
                                                    </div>

                                                    <button
                                                        type="submit"
                                                        disabled={submitting}
                                                        className="w-full py-6 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white font-black text-lg rounded-[2rem] shadow-2xl shadow-blue-500/30 hover:shadow-blue-500/50 hover:-translate-y-1 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-4 transition-all active:scale-95"
                                                    >
                                                        {submitting ? (
                                                            <>
                                                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                                Transmitting...
                                                            </>
                                                        ) : (
                                                            <>
                                                                <Send size={22} className="-rotate-12" />
                                                                Send Message Now
                                                            </>
                                                        )}
                                                    </button>
                                                </form>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </section>

                {/* FAQ Section with Premium Styling */}
                <section className="py-32 bg-slate-900 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-[#fafbff] to-transparent" />
                    <div className="container mx-auto px-6 relative z-10">
                        <div className="text-center mb-20">
                            <h2 className="text-4xl md:text-5xl font-black text-white mb-6 tracking-tight leading-tight">
                                Frequency Asked <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">Questions</span>
                            </h2>
                            <p className="text-slate-400 font-medium text-lg">Can't find what you're looking for?</p>
                        </div>
                        <div className="max-w-4xl mx-auto space-y-6">
                            {faqs.map((faq, index) => (
                                <FaqItem
                                    key={index}
                                    faq={faq}
                                    isOpen={activeFaq === index}
                                    toggle={() => setActiveFaq(activeFaq === index ? null : index)}
                                />
                            ))}
                        </div>
                    </div>
                </section>

                {/* Integration Map Area */}
                <section className="h-[600px] relative border-t border-slate-200">
                    <iframe
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3770.817452636599!2d72.89721757505193!3d19.07174628213197!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7c627a20baf93%3A0xeb2f304551d65b5!2sK.%20J.%20Somaiya%20College%20of%20Engineering!5e0!3m2!1sen!2sin!4v1714856037148!5m2!1sen!2sin"
                        width="100%"
                        height="100%"
                        style={{ border: 0 }}
                        allowFullScreen=""
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        title="Campus Location"
                        className="grayscale contrast-125 opacity-80 hover:grayscale-0 hover:opacity-100 transition-all duration-1000"
                    />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            whileInView={{ scale: 1, opacity: 1 }}
                            className="bg-white/80 backdrop-blur-2xl p-8 rounded-[2rem] border border-white shadow-2xl max-w-sm text-center"
                        >
                            <div className="w-12 h-12 bg-blue-600 text-white rounded-2xl flex items-center justify-center mx-auto mb-4 animate-bounce">
                                <MapPin size={24} />
                            </div>
                            <h4 className="text-xl font-black text-slate-900 mb-2">Visit our Campus</h4>
                            <p className="text-sm text-slate-600 font-medium leading-relaxed">
                                K.J. Somaiya College of Engineering, <br />Vidyavihar East, Mumbai 400077
                            </p>
                        </motion.div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
};

// Internal Components
const ContactDetail = ({ icon: Icon, title, content, link, color, bg }) => (
    <div className="flex items-start gap-6 group">
        <div className={`w-14 h-14 rounded-2xl ${bg} ${color} flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300`}>
            <Icon size={24} />
        </div>
        <div>
            <p className="text-[10px] uppercase font-black tracking-[0.2em] text-slate-400 mb-2 leading-none">{title}</p>
            {link ? (
                <a href={link} className="text-lg font-bold text-slate-800 hover:text-blue-600 transition-colors block leading-tight">{content}</a>
            ) : (
                <p className="text-lg font-bold text-slate-800 leading-tight">{content}</p>
            )}
        </div>
    </div>
);

const SocialIcon = ({ icon: Icon }) => (
    <button className="w-12 h-12 rounded-2xl border border-white/20 flex items-center justify-center hover:bg-white hover:text-slate-950 hover:scale-110 active:scale-95 transition-all duration-300">
        <Icon size={20} />
    </button>
);

const FloatingInput = ({ label, name, type = "text", value, onChange }) => (
    <div className="relative group">
        <input
            type={type}
            name={name}
            value={value}
            onChange={onChange}
            className="w-full px-8 py-6 bg-slate-50 border-2 border-slate-100 rounded-[2rem] focus:outline-none focus:border-blue-500 focus:bg-white transition-all peer font-medium placeholder:opacity-0 focus:placeholder:opacity-100"
            placeholder={label}
            required
        />
        <label className="absolute left-8 top-1/2 -translate-y-1/2 text-slate-400 font-bold transition-all pointer-events-none peer-focus:-top-4 peer-focus:left-6 peer-focus:text-blue-600 peer-focus:text-xs peer-focus:bg-white peer-focus:px-3 peer-[:not(:placeholder-shown)]:-top-4 peer-[:not(:placeholder-shown)]:left-6 peer-[:not(:placeholder-shown)]:text-blue-600 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:bg-white peer-[:not(:placeholder-shown)]:px-3">
            {label}
        </label>
    </div>
);

const FaqItem = ({ faq, isOpen, toggle }) => (
    <div className={`rounded-[2rem] transition-all duration-500 border ${isOpen ? 'bg-white border-blue-500/30' : 'bg-white/5 border-white/10 hover:bg-white/10'}`}>
        <button
            onClick={toggle}
            className="w-full flex items-center justify-between p-8 text-left font-black text-lg transition-colors"
        >
            <span className={isOpen ? 'text-slate-900' : 'text-white'}>{faq.question}</span>
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-500 ${isOpen ? 'bg-blue-600 text-white rotate-180' : 'bg-white/10 text-slate-400'}`}>
                <ChevronDown size={20} />
            </div>
        </button>
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.4, ease: [0.04, 0.62, 0.23, 0.98] }}
                >
                    <div className="px-8 pb-8 pt-0 text-slate-500 font-medium leading-relaxed text-lg italic">
                        "{faq.answer}"
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    </div>
);

export default Contact;
