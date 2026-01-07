import React, { useState, useRef } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import StudentLayout from '../components/StudentLayout';
import {
    Plus, Trash2, Download, ChevronRight, ChevronLeft, User, Briefcase,
    GraduationCap, FileText, Check, Award, Globe, Mail, Phone, MapPin,
    Linkedin, X as LucideX, LayoutTemplate, Palette, Eye, Printer, Wand2
} from 'lucide-react';

const InputGroup = ({ label, name, value, onChange, placeholder, type = "text", className, icon: Icon }) => (
    <div className={`space-y-1.5 ${className}`}>
        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">{label}</label>
        <div className="relative group">
            {Icon && <Icon size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />}
            <input
                type={type}
                name={name}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className={`w-full ${Icon ? 'pl-10' : 'pl-4'} pr-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all font-medium text-slate-700 shadow-sm group-hover:border-slate-300`}
            />
        </div>
    </div>
);

const TextAreaGroup = ({ label, value, onChange, placeholder, rows = 3 }) => (
    <div className="space-y-1.5">
        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">{label}</label>
        <div className="relative group">
            <textarea
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                rows={rows}
                className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all font-medium text-slate-700 shadow-sm resize-none group-hover:border-slate-300"
            />
        </div>
    </div>
);

const ResumeBuilder = () => {
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const pdfRef = useRef();

    const [formData, setFormData] = useState({
        personal: {
            firstName: '', lastName: '', email: '', phone: '', address: '',
            country: '', state: '', city: '', zip: '', gender: 'Male', dob: '',
            linkedin: '', website: ''
        },
        education: [],
        work: [],
        projects: [],
        certifications: [],
        skills: [],
        interests: [],
        languages: [],
        achievements: '',
        profileSummary: ''
    });

    // --- Handlers ---
    const handlePersonalChange = (e) => {
        setFormData({ ...formData, personal: { ...formData.personal, [e.target.name]: e.target.value } });
    };

    const handleArrayChange = (section, index, field, value) => {
        const newArr = [...formData[section]];
        if (typeof newArr[index] === 'object') {
            newArr[index][field] = value;
        } else {
            newArr[index] = value;
        }
        setFormData({ ...formData, [section]: newArr });
    };

    const addItem = (section, item) => {
        setFormData({ ...formData, [section]: [...formData[section], item] });
    };

    const removeItem = (section, index) => {
        const newArr = [...formData[section]];
        newArr.splice(index, 1);
        setFormData({ ...formData, [section]: newArr });
    };

    const generatePDF = async () => {
        setLoading(true);
        const input = pdfRef.current;
        try {
            const canvas = await html2canvas(input, { scale: 2, useCORS: true, scrollY: -window.scrollY });
            const imgData = canvas.toDataURL('image/png');

            // Calculate dimensions
            const pdfWidth = 210; // A4 width in mm
            const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

            // Create PDF with custom height matching the content
            const pdf = new jsPDF('p', 'mm', [pdfWidth, pdfHeight]);

            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
            pdf.save(`${formData.personal.firstName || 'Resume'}_CV.pdf`);
        } catch (error) {
            console.error(error);
            alert("Error generating PDF");
        }
        setLoading(false);
    };

    const renderStep1 = () => (
        <div className="space-y-8 animate-slide-up">
            <div className="flex items-center gap-4 border-b border-indigo-100 pb-6">
                <div className="p-3 bg-indigo-100 text-indigo-600 rounded-xl shadow-inner"><User size={28} /></div>
                <div>
                    <h2 className="text-2xl font-bold text-slate-800">Personal Information</h2>
                    <p className="text-slate-500 font-medium">Start with the basics. Recruiters need to know who you are.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputGroup label="First Name" name="firstName" value={formData.personal.firstName} onChange={handlePersonalChange} placeholder="e.g. John" icon={User} />
                <InputGroup label="Last Name" name="lastName" value={formData.personal.lastName} onChange={handlePersonalChange} placeholder="e.g. Doe" icon={User} />
                <InputGroup label="Email Address" name="email" value={formData.personal.email} onChange={handlePersonalChange} placeholder="john@example.com" type="email" icon={Mail} />
                <InputGroup label="Phone Number" name="phone" value={formData.personal.phone} onChange={handlePersonalChange} placeholder="+1 234 567 890" type="tel" icon={Phone} />
                <InputGroup label="Address" name="address" value={formData.personal.address} onChange={handlePersonalChange} placeholder="123 Main St" className="md:col-span-2" icon={MapPin} />
                <InputGroup label="City" name="city" value={formData.personal.city} onChange={handlePersonalChange} placeholder="New York" />
                <InputGroup label="State" name="state" value={formData.personal.state} onChange={handlePersonalChange} placeholder="NY" />
                <InputGroup label="Country" name="country" value={formData.personal.country} onChange={handlePersonalChange} placeholder="USA" />
                <InputGroup label="Zip Code" name="zip" value={formData.personal.zip} onChange={handlePersonalChange} placeholder="10001" />
                <InputGroup label="LinkedIn Profile" name="linkedin" value={formData.personal.linkedin} onChange={handlePersonalChange} placeholder="linkedin.com/in/johndoe" className="md:col-span-2" icon={Linkedin} />
                <InputGroup label="Portfolio / Website" name="website" value={formData.personal.website || ''} onChange={handlePersonalChange} placeholder="mysite.com" className="md:col-span-2" icon={Globe} />
            </div>

            <div className="flex justify-end pt-6 border-t border-slate-100 mt-8">
                <button onClick={() => setStep(2)} className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-indigo-500/30 transition-all transform hover:-translate-y-0.5 active:scale-95">
                    Next Step <ChevronRight size={20} />
                </button>
            </div>
        </div>
    );

    const renderStep2 = () => (
        <div className="space-y-8 animate-slide-up">
            <div className="flex items-center gap-4 border-b border-purple-100 pb-6">
                <div className="p-3 bg-purple-100 text-purple-600 rounded-xl shadow-inner"><Briefcase size={28} /></div>
                <div>
                    <h2 className="text-2xl font-bold text-slate-800">Experience & Skills</h2>
                    <p className="text-slate-500 font-medium">Showcase your career journey and expertise.</p>
                </div>
            </div>

            {/* Profile Summary */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                <TextAreaGroup
                    label="Professional Summary"
                    value={formData.profileSummary}
                    onChange={(e) => setFormData({ ...formData, profileSummary: e.target.value })}
                    placeholder="Briefly describe your professional background and key achievements..."
                    rows={4}
                />
            </div>

            {/* Education */}
            <div className="space-y-4">
                <div className="flex justify-between items-center">
                    <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2"><GraduationCap size={20} className="text-indigo-500" /> Education</h3>
                    <button onClick={() => addItem('education', { degree: '', school: '', start: '', end: '' })} className="text-indigo-600 hover:bg-indigo-50 px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-all border border-transparent hover:border-indigo-100"><Plus size={16} /> Add Education</button>
                </div>
                {formData.education.map((edu, idx) => (
                    <div key={idx} className="p-6 bg-slate-50 rounded-2xl border border-slate-200 relative group transition-all hover:bg-white hover:shadow-md hover:border-indigo-100">
                        <button onClick={() => removeItem('education', idx)} className="absolute top-4 right-4 text-slate-300 hover:text-red-500 transition-colors"><Trash2 size={18} /></button>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <input placeholder="Degree / Major" value={edu.degree} onChange={(e) => handleArrayChange('education', idx, 'degree', e.target.value)} className="bg-transparent border-b-2 border-slate-200 focus:border-indigo-500 outline-none pb-2 text-base font-bold text-slate-800 w-full placeholder-slate-400 transition-colors" />
                            <input placeholder="School / University" value={edu.school} onChange={(e) => handleArrayChange('education', idx, 'school', e.target.value)} className="bg-transparent border-b-2 border-slate-200 focus:border-indigo-500 outline-none pb-2 text-base font-medium text-slate-800 w-full placeholder-slate-400 transition-colors" />
                            <div className="flex gap-4">
                                <input placeholder="Start Year" value={edu.start} onChange={(e) => handleArrayChange('education', idx, 'start', e.target.value)} className="bg-transparent border-b-2 border-slate-200 focus:border-indigo-500 outline-none pb-2 text-sm font-medium w-full" />
                                <input placeholder="End Year" value={edu.end} onChange={(e) => handleArrayChange('education', idx, 'end', e.target.value)} className="bg-transparent border-b-2 border-slate-200 focus:border-indigo-500 outline-none pb-2 text-sm font-medium w-full" />
                            </div>
                        </div>
                    </div>
                ))}
                {formData.education.length === 0 && (
                    <div className="text-center py-8 border-2 border-dashed border-slate-200 rounded-2xl text-slate-400 text-sm">No education added yet. Click "Add Education" to start.</div>
                )}
            </div>

            {/* Work */}
            <div className="space-y-4 pt-4 border-t border-slate-100">
                <div className="flex justify-between items-center">
                    <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2"><Briefcase size={20} className="text-purple-500" /> Work Experience</h3>
                    <button onClick={() => addItem('work', { title: '', company: '', start: '', end: '', description: '' })} className="text-purple-600 hover:bg-purple-50 px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-all border border-transparent hover:border-purple-100"><Plus size={16} /> Add Position</button>
                </div>
                {formData.work.map((job, idx) => (
                    <div key={idx} className="p-6 bg-slate-50 rounded-2xl border border-slate-200 relative group transition-all hover:bg-white hover:shadow-md hover:border-purple-100 space-y-4">
                        <button onClick={() => removeItem('work', idx)} className="absolute top-4 right-4 text-slate-300 hover:text-red-500 transition-colors"><Trash2 size={18} /></button>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <input placeholder="Job Title" value={job.title} onChange={(e) => handleArrayChange('work', idx, 'title', e.target.value)} className="bg-transparent border-b-2 border-slate-200 focus:border-purple-500 outline-none pb-2 text-lg font-bold text-slate-800 w-full placeholder-slate-400" />
                            <input placeholder="Company Name" value={job.company} onChange={(e) => handleArrayChange('work', idx, 'company', e.target.value)} className="bg-transparent border-b-2 border-slate-200 focus:border-purple-500 outline-none pb-2 text-base font-medium text-slate-700 w-full placeholder-slate-400" />
                            <div className="flex gap-4">
                                <input placeholder="Start Date" value={job.start} onChange={(e) => handleArrayChange('work', idx, 'start', e.target.value)} className="bg-transparent border-b-2 border-slate-200 focus:border-purple-500 outline-none pb-2 text-sm w-full" />
                                <input placeholder="End Date" value={job.end} onChange={(e) => handleArrayChange('work', idx, 'end', e.target.value)} className="bg-transparent border-b-2 border-slate-200 focus:border-purple-500 outline-none pb-2 text-sm w-full" />
                            </div>
                        </div>
                        <textarea placeholder="Job Description / Responsibilities" value={job.description} onChange={(e) => handleArrayChange('work', idx, 'description', e.target.value)} className="w-full bg-white p-3 border border-slate-200 rounded-xl text-sm focus:border-purple-500 focus:ring-2 focus:ring-purple-500/10 outline-none resize-none transition-all placeholder-slate-400" rows="3" />
                    </div>
                ))}
            </div>

            {/* Skills */}
            <div className="space-y-4 pt-4 border-t border-slate-100">
                <div className="flex justify-between items-center">
                    <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2"><Award size={20} className="text-orange-500" /> Skills</h3>
                    <button onClick={() => addItem('skills', '')} className="text-orange-600 hover:bg-orange-50 px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-all border border-transparent hover:border-orange-100"><Plus size={16} /> Add Skill</button>
                </div>
                <div className="flex flex-wrap gap-3">
                    {formData.skills.map((skill, idx) => (
                        <div key={idx} className="flex items-center gap-2 bg-white border border-slate-200 rounded-full px-4 py-2 shadow-sm focus-within:border-orange-500 focus-within:ring-2 focus-within:ring-orange-500/20 transition-all">
                            <input
                                value={skill}
                                onChange={(e) => {
                                    const newSkills = [...formData.skills];
                                    newSkills[idx] = e.target.value;
                                    setFormData({ ...formData, skills: newSkills });
                                }}
                                className="bg-transparent outline-none text-sm font-bold text-slate-700 w-24 placeholder-slate-300"
                                placeholder="Skill"
                            />
                            <button onClick={() => removeItem('skills', idx)} className="text-slate-300 hover:text-red-500"><LucideX size={14} /></button>
                        </div>
                    ))}
                    {formData.skills.length === 0 && <p className="text-sm text-slate-400 italic">No skills added yet.</p>}
                </div>
            </div>

            <div className="flex justify-between pt-6 border-t border-slate-100 mt-8">
                <button onClick={() => setStep(1)} className="text-slate-600 hover:bg-slate-100 px-6 py-3 rounded-full font-bold flex items-center gap-2 transition-colors">
                    <ChevronLeft size={20} /> Back
                </button>
                <button onClick={() => setStep(3)} className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-indigo-500/30 transition-all transform hover:-translate-y-0.5 active:scale-95">
                    Next Step <ChevronRight size={20} />
                </button>
            </div>
        </div>
    );

    const renderStep3 = () => (
        <div className="space-y-8 animate-slide-up">
            <div className="flex items-center gap-4 border-b border-teal-100 pb-6">
                <div className="p-3 bg-teal-100 text-teal-600 rounded-xl shadow-inner"><Award size={28} /></div>
                <div>
                    <h2 className="text-2xl font-bold text-slate-800">Projects & Achievements</h2>
                    <p className="text-slate-500 font-medium">Highlight your key projects and certifications.</p>
                </div>
            </div>

            {/* Projects */}
            <div className="space-y-4">
                <div className="flex justify-between items-center">
                    <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2"><Globe size={20} className="text-indigo-500" /> Projects</h3>
                    <button onClick={() => addItem('projects', { title: '', link: '', description: '', tech: '' })} className="text-indigo-600 hover:bg-indigo-50 px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-all border border-transparent hover:border-indigo-100"><Plus size={16} /> Add Project</button>
                </div>
                {formData.projects.map((proj, idx) => (
                    <div key={idx} className="p-6 bg-slate-50 rounded-2xl border border-slate-200 relative group transition-all hover:bg-white hover:shadow-md hover:border-indigo-100 space-y-4">
                        <button onClick={() => removeItem('projects', idx)} className="absolute top-4 right-4 text-slate-300 hover:text-red-500 transition-colors"><Trash2 size={18} /></button>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <input placeholder="Project Title" value={proj.title} onChange={(e) => handleArrayChange('projects', idx, 'title', e.target.value)} className="bg-transparent border-b-2 border-slate-200 focus:border-indigo-500 outline-none pb-2 text-lg font-bold text-slate-800 w-full placeholder-slate-400" />
                            <input placeholder="Project Link (GitHub/Demo)" value={proj.link} onChange={(e) => handleArrayChange('projects', idx, 'link', e.target.value)} className="bg-transparent border-b-2 border-slate-200 focus:border-indigo-500 outline-none pb-2 text-sm font-medium text-indigo-600 w-full placeholder-slate-400" />
                        </div>
                        <input placeholder="Tech Stack (e.g. React, Node.js)" value={proj.tech} onChange={(e) => handleArrayChange('projects', idx, 'tech', e.target.value)} className="bg-transparent border-b-2 border-slate-200 focus:border-indigo-500 outline-none pb-2 text-sm font-semibold text-slate-600 w-full placeholder-slate-400" />
                        <textarea placeholder="Project Description" value={proj.description} onChange={(e) => handleArrayChange('projects', idx, 'description', e.target.value)} className="w-full bg-white p-3 border border-slate-200 rounded-xl text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 outline-none resize-none transition-all placeholder-slate-400" rows="3" />
                    </div>
                ))}
            </div>

            {/* Certifications */}
            <div className="space-y-4 pt-4 border-t border-slate-100">
                <div className="flex justify-between items-center">
                    <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2"><Check size={20} className="text-teal-500" /> Certifications</h3>
                    <button onClick={() => addItem('certifications', { name: '', issuer: '', year: '' })} className="text-teal-600 hover:bg-teal-50 px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-all border border-transparent hover:border-teal-100"><Plus size={16} /> Add Cert</button>
                </div>
                {formData.certifications.map((cert, idx) => (
                    <div key={idx} className="p-6 bg-slate-50 rounded-2xl border border-slate-200 relative group transition-all hover:bg-white hover:shadow-md hover:border-teal-100">
                        <button onClick={() => removeItem('certifications', idx)} className="absolute top-4 right-4 text-slate-300 hover:text-red-500 transition-colors"><Trash2 size={18} /></button>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                            <input placeholder="Certification Name" value={cert.name} onChange={(e) => handleArrayChange('certifications', idx, 'name', e.target.value)} className="bg-transparent border-b-2 border-slate-200 focus:border-teal-500 outline-none pb-2 text-base font-bold text-slate-800 w-full placeholder-slate-400" />
                            <input placeholder="Issuer (e.g. Coursera)" value={cert.issuer} onChange={(e) => handleArrayChange('certifications', idx, 'issuer', e.target.value)} className="bg-transparent border-b-2 border-slate-200 focus:border-teal-500 outline-none pb-2 text-sm font-medium text-slate-700 w-full placeholder-slate-400" />
                            <input placeholder="Year" value={cert.year} onChange={(e) => handleArrayChange('certifications', idx, 'year', e.target.value)} className="bg-transparent border-b-2 border-slate-200 focus:border-teal-500 outline-none pb-2 text-sm font-medium text-slate-700 w-full placeholder-slate-400" />
                        </div>
                    </div>
                ))}
            </div>

            {/* Languages & Achievements */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-100">
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                    <div className="flex justify-between items-center">
                        <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2"><Globe size={20} className="text-indigo-500" /> Languages</h3>
                        <button onClick={() => addItem('languages', '')} className="text-indigo-600 hover:bg-indigo-50 px-3 py-1.5 rounded-lg text-sm font-bold flex items-center gap-1 transition-colors"><Plus size={16} /> Add</button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {formData.languages.map((lang, idx) => (
                            <div key={idx} className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-full px-4 py-2 shadow-sm focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/20 transition-all">
                                <input
                                    value={lang}
                                    onChange={(e) => {
                                        const newLangs = [...formData.languages];
                                        newLangs[idx] = e.target.value;
                                        setFormData({ ...formData, languages: newLangs });
                                    }}
                                    className="bg-transparent outline-none text-sm font-bold text-slate-700 w-20 placeholder-slate-300"
                                    placeholder="Lang"
                                />
                                <button onClick={() => removeItem('languages', idx)} className="text-slate-300 hover:text-red-500"><LucideX size={14} /></button>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                    <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2"><Award size={20} className="text-yellow-500" /> Key Achievements</h3>
                    <TextAreaGroup
                        value={formData.achievements}
                        onChange={(e) => setFormData({ ...formData, achievements: e.target.value })}
                        placeholder="List your key awards or achievements..."
                        rows={4}
                    />
                </div>
            </div>

            <div className="flex justify-between pt-6 border-t border-slate-100 mt-8">
                <button onClick={() => setStep(2)} className="text-slate-600 hover:bg-slate-100 px-6 py-3 rounded-full font-bold flex items-center gap-2 transition-colors">
                    <ChevronLeft size={20} /> Back
                </button>
                <button onClick={() => setStep(4)} className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-indigo-500/30 transition-all transform hover:-translate-y-0.5 active:scale-95">
                    Preview Resume <ChevronRight size={20} />
                </button>
            </div>
        </div>
    );


    const renderStep4 = () => (
        <div className="flex flex-col items-center animate-fade-in space-y-8">
            <div className="w-full flex justify-between items-center bg-indigo-50 p-6 rounded-2xl border border-indigo-100">
                <div>
                    <h2 className="text-2xl font-bold text-indigo-900">Review & Download</h2>
                    <p className="text-indigo-600 font-medium">Verify your details before exporting your CV.</p>
                </div>
                <div className="flex gap-4">
                    <button onClick={() => setStep(3)} className="text-slate-600 hover:bg-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-colors border border-transparent hover:border-slate-200">
                        <ChevronLeft size={18} /> Edit
                    </button>
                    <button onClick={generatePDF} className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-emerald-500/30 transition-all transform hover:-translate-y-0.5 active:scale-95">
                        {loading ? 'Generating...' : <><Download size={20} /> Download PDF</>}
                    </button>
                </div>
            </div>

            <div className="shadow-2xl shadow-slate-300/50 border border-slate-200 overflow-hidden rounded-sm transition-transform hover:scale-[1.005] duration-500">
                {renderTemplatePreview()}
            </div>
        </div>
    );

    const renderTemplatePreview = () => (
        <div className="bg-white mx-auto relative print:w-full" style={{ width: '210mm', minHeight: '297mm' }} ref={pdfRef}>
            {/* Header Stripe */}
            <div className="h-6 bg-slate-900 w-full absolute top-0 left-0"></div>

            <div className="p-12 pt-20 h-full flex flex-col font-sans text-slate-800">
                {/* Header */}
                <div className="border-b-2 border-slate-900 pb-8 mb-10 flex justify-between items-start">
                    <div>
                        <h1 className="text-5xl font-extrabold text-slate-900 tracking-tight uppercase leading-tight font-serif">
                            {formData.personal.firstName} <span className="text-indigo-700">{formData.personal.lastName}</span>
                        </h1>
                        <p className="text-xl text-slate-500 mt-2 font-medium tracking-wide uppercase">
                            {formData.work[0]?.title || 'Professional'}
                        </p>
                    </div>
                    <div className="text-right space-y-2 text-sm font-medium text-slate-600">
                        {formData.personal.email && <div className="flex items-center justify-end gap-2 hover:text-indigo-600 transition-colors"><Mail size={16} className="text-indigo-600" />{formData.personal.email}</div>}
                        {formData.personal.phone && <div className="flex items-center justify-end gap-2 hover:text-indigo-600 transition-colors"><Phone size={16} className="text-indigo-600" />{formData.personal.phone}</div>}
                        {(formData.personal.city || formData.personal.country) && <div className="flex items-center justify-end gap-2 hover:text-indigo-600 transition-colors"><MapPin size={16} className="text-indigo-600" />{formData.personal.city}, {formData.personal.country}</div>}
                        {formData.personal.linkedin && <div className="flex items-center justify-end gap-2 hover:text-indigo-600 transition-colors"><Linkedin size={16} className="text-indigo-600" />{formData.personal.linkedin}</div>}
                        {formData.personal.website && <div className="flex items-center justify-end gap-2 hover:text-indigo-600 transition-colors"><Globe size={16} className="text-indigo-600" />{formData.personal.website}</div>}
                    </div>
                </div>

                <div className="grid grid-cols-12 gap-10 flex-grow">
                    {/* Main Content (Left) */}
                    <div className="col-span-8 space-y-10 pr-6">
                        {formData.profileSummary && (
                            <section>
                                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-3 border-b border-slate-200 pb-2">
                                    <div className="p-1 bg-slate-900 rounded-sm"></div> Profile
                                </h3>
                                <p className="text-slate-700 text-sm leading-7 text-justify font-normal">{formData.profileSummary}</p>
                            </section>
                        )}

                        {formData.work.length > 0 && (
                            <section>
                                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-6 flex items-center gap-3 border-b border-slate-200 pb-2">
                                    <div className="p-1 bg-slate-900 rounded-sm"></div> Work Experience
                                </h3>
                                <div className="space-y-8">
                                    {formData.work.map((job, idx) => (
                                        <div key={idx} className="relative pl-6 border-l-2 border-indigo-100">
                                            <div className="absolute -left-[5px] top-2 w-2.5 h-2.5 bg-indigo-600 rounded-full ring-4 ring-white"></div>
                                            <div className="flex justify-between items-baseline mb-1">
                                                <h4 className="font-bold text-slate-800 text-lg">{job.title}</h4>
                                                <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-2 py-1 rounded-md">{job.start} - {job.end || 'Present'}</span>
                                            </div>
                                            <p className="text-sm font-bold text-indigo-600 mb-3">{job.company}</p>
                                            <p className="text-sm text-slate-600 leading-relaxed text-justify whitespace-pre-wrap">{job.description}</p>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {formData.projects.length > 0 && (
                            <section>
                                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-6 flex items-center gap-3 border-b border-slate-200 pb-2">
                                    <div className="p-1 bg-slate-900 rounded-sm"></div> Projects
                                </h3>
                                <div className="space-y-6">
                                    {formData.projects.map((proj, idx) => (
                                        <div key={idx} className="relative pl-6 border-l-2 border-indigo-100">
                                            <div className="absolute -left-[5px] top-2 w-2.5 h-2.5 bg-indigo-600 rounded-full ring-4 ring-white"></div>
                                            <div className="flex justify-between items-baseline mb-1">
                                                <h4 className="font-bold text-slate-800 text-base">{proj.title} {proj.link && <a href={proj.link} target="_blank" className="text-indigo-500 text-xs font-normal ml-2 hover:underline decoration-indigo-300">(View Project)</a>}</h4>
                                            </div>
                                            <p className="text-xs font-bold text-slate-500 mb-2 uppercase tracking-wide">{proj.tech}</p>
                                            <p className="text-sm text-slate-600 leading-relaxed text-justify">{proj.description}</p>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {formData.education.length > 0 && (
                            <section>
                                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-6 flex items-center gap-3 border-b border-slate-200 pb-2">
                                    <div className="p-1 bg-slate-900 rounded-sm"></div> Education
                                </h3>
                                <div className="grid grid-cols-1 gap-5">
                                    {formData.education.map((edu, idx) => (
                                        <div key={idx} className="bg-slate-50 p-5 rounded-lg border border-slate-100">
                                            <h4 className="font-bold text-slate-900 text-base">{edu.degree}</h4>
                                            <p className="text-sm font-medium text-indigo-700 mt-1">{edu.school}</p>
                                            <div className="flex justify-between items-center mt-2 border-t border-slate-200 pt-2">
                                                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{edu.start} - {edu.end || 'Present'}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}
                        {formData.achievements && (
                            <section>
                                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-3 border-b border-slate-200 pb-2">
                                    <div className="p-1 bg-slate-900 rounded-sm"></div> Achievements
                                </h3>
                                <p className="text-slate-700 text-sm leading-relaxed text-justify whitespace-pre-wrap">{formData.achievements}</p>
                            </section>
                        )}
                    </div>

                    {/* Sidebar (Right) */}
                    <div className="col-span-4 space-y-10 border-l border-slate-200 pl-8">
                        {formData.skills.length > 0 && (
                            <section>
                                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 border-b border-slate-200 pb-2">Skills</h3>
                                <div className="flex flex-wrap gap-2">
                                    {formData.skills.filter(s => s).map((s, i) => (
                                        <span key={i} className="bg-slate-100 text-slate-700 text-xs font-bold px-3 py-1.5 rounded-md border border-slate-200">{s}</span>
                                    ))}
                                </div>
                            </section>
                        )}

                        {formData.certifications.length > 0 && (
                            <section>
                                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 border-b border-slate-200 pb-2">Certifications</h3>
                                <div className="space-y-4">
                                    {formData.certifications.map((cert, idx) => (
                                        <div key={idx} className="text-sm bg-slate-50 p-3 rounded-lg border border-slate-100">
                                            <p className="font-bold text-slate-800 leading-tight">{cert.name}</p>
                                            <p className="text-slate-500 text-xs mt-1 font-medium">{cert.issuer} {cert.year && <span className="text-indigo-500">• {cert.year}</span>}</p>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {formData.languages.length > 0 && (
                            <section>
                                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 border-b border-slate-200 pb-2">Languages</h3>
                                <ul className="space-y-3 text-sm text-slate-600">
                                    {formData.languages.filter(l => l).map((lang, idx) => (
                                        <li key={idx} className="flex items-center gap-3 font-medium"><div className="w-2 h-2 bg-indigo-500 rounded-full"></div> {lang}</li>
                                    ))}
                                </ul>
                            </section>
                        )}
                    </div>
                </div>
            </div>
            <div className="h-4 bg-slate-900 w-full absolute bottom-0 left-0"></div>
        </div>
    );

    const renderStepper = () => {
        const items = [
            { id: 1, label: 'Personal', icon: User },
            { id: 2, label: 'Experience', icon: Briefcase },
            { id: 3, label: 'Projects', icon: Globe },
            { id: 4, label: 'Download', icon: FileText },
        ];
        return (
            <div className="mb-12 relative px-4">
                <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-full h-1 bg-slate-200 -z-10 rounded-full"></div>
                <div className="absolute left-0 top-1/2 transform -translate-y-1/2 h-1 bg-indigo-600 -z-10 transition-all duration-700 ease-out rounded-full" style={{ width: `${((step - 1) / (items.length - 1)) * 100}%` }}></div>

                <div className="flex justify-between w-full max-w-3xl mx-auto">
                    {items.map((item, idx) => (
                        <div key={item.id} className="flex flex-col items-center cursor-pointer group" onClick={() => step > item.id && setStep(item.id)}>
                            <div className={`w-14 h-14 rounded-full flex items-center justify-center border-4 transition-all duration-500 z-10 
                                ${step >= item.id
                                    ? 'bg-indigo-600 border-indigo-100 text-white shadow-xl shadow-indigo-500/40 scale-110'
                                    : 'bg-white border-slate-200 text-slate-400 group-hover:border-indigo-200'}`}>
                                {step > item.id ? <Check size={24} strokeWidth={3} /> : <item.icon size={22} />}
                            </div>
                            <span className={`mt-3 text-sm font-bold tracking-wide transition-all duration-300 ${step >= item.id ? 'text-indigo-700 translate-y-0' : 'text-slate-400 translate-y-1'}`}>{item.label}</span>
                        </div>
                    ))}
                </div>
            </div>
        )
    }

    return (
        <StudentLayout>
            <div className="font-sans text-slate-900 h-full bg-slate-50 pb-20">
                <div className="container mx-auto px-4 py-8 max-w-6xl">

                    {/* Hero Section - Matching Test/DSA Style */}
                    <div className="bg-gradient-to-r from-indigo-600 to-violet-800 rounded-3xl p-8 mb-10 text-white shadow-xl relative overflow-hidden">
                        <div className="relative z-10">
                            <div className="flex items-center gap-2 mb-2 text-indigo-200 font-bold text-xs uppercase tracking-wider">
                                <Award size={14} className="text-yellow-400" /> Career Advancement
                            </div>
                            <h1 className="text-3xl font-bold mb-3">Build Your Professional Resume</h1>
                            <p className="text-indigo-100 max-w-xl text-lg leading-relaxed">
                                Create a standout CV in minutes with our enterprise-grade builder. Simply fill in your details and export a perfect PDF to showcase your potential.
                            </p>
                        </div>
                        <div className="absolute right-0 bottom-0 opacity-10 transform translate-x-10 translate-y-10">
                            <FileText size={200} />
                        </div>
                    </div>

                    <div className="max-w-5xl mx-auto">
                        {renderStepper()}

                        <div className="bg-white rounded-3xl shadow-2xl shadow-slate-200/50 p-8 md:p-12 min-h-[600px] border border-white/50 relative backdrop-blur-sm">
                            {step === 1 && renderStep1()}
                            {step === 2 && renderStep2()}
                            {step === 3 && renderStep3()}
                            {step === 4 && renderStep4()}
                        </div>
                    </div>
                </div>
            </div>
        </StudentLayout>
    );
};

export default ResumeBuilder;
