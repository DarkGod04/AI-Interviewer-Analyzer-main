'use client'
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, User, MapPin, Phone, Calendar, ArrowRight, Loader2, CheckCircle2 } from 'lucide-react';
import { useUser } from '../provider';
import { supabase } from '../../services/supabaseClient';
import { toast } from 'sonner';

export default function Onboarding() {
    const { user, setUser } = useUser();
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        dob: '',
        country: '',
        phone: '',
        sex: ''
    });

    // Calculate age in years from a DOB string
    const calcAge = (dob) => {
        if (!dob) return null;
        const birthDate = new Date(dob);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) age--;
        return age;
    };

    useEffect(() => {
        if (user) {
            setFormData(prev => ({
                ...prev,
                name: user?.name || ''
            }));
            if (user?.onboarding_completed) {
                router.push('/dashboard');
            }
        }
    }, [user, router]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!user) return;

        setLoading(true);

        const computedAge = calcAge(formData.dob);

        // Update Supabase
        const { error } = await supabase
            .from('Users')
            .update({
                name: formData.name,
                dob: formData.dob || null,
                age: computedAge,
                country: formData.country,
                phone: formData.phone,
                sex: formData.sex,
                onboarding_completed: true
            })
            .eq('email', user.email);

        setLoading(false);

        if (error) {
            console.error("Error updating profile:", error);
            toast.error("Failed to save profile details.");
            return;
        }

        setSuccess(true);

        // Update local context
        setUser({
            ...user,
            name: formData.name,
            dob: formData.dob,
            age: computedAge,
            country: formData.country,
            phone: formData.phone,
            sex: formData.sex,
            onboarding_completed: true
        });

        toast.success("Profile completed successfully!");
        
        setTimeout(() => {
            router.push('/dashboard');
        }, 1500);
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const inputClasses = "w-full bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm border border-slate-200/60 text-slate-800 placeholder-slate-400 text-sm rounded-xl focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-300 py-3 px-4 shadow-sm";
    const labelClasses = "block text-xs font-bold text-slate-600 uppercase tracking-widest mb-1.5 ml-1";

    return (
        <div className="min-h-screen relative overflow-hidden flex items-center justify-center p-4 bg-slate-50">
            {/* Animated Background Mesh */}
            <div className="absolute inset-0 animated-mesh-bg opacity-40 z-0"></div>
            
            {/* Floating CSS Blobs */}
            <div className="absolute top-[-10%] left-[-10%] w-[40vw] h-[40vw] bg-pink-400 rounded-full mix-blend-multiply filter blur-[120px] opacity-40 animate-blob"></div>
            <div className="absolute top-[20%] right-[-10%] w-[40vw] h-[40vw] bg-purple-400 rounded-full mix-blend-multiply filter blur-[120px] opacity-40 animate-blob animation-delay-2000"></div>
            <div className="absolute bottom-[-20%] left-[20%] w-[40vw] h-[40vw] bg-indigo-400 rounded-full mix-blend-multiply filter blur-[120px] opacity-40 animate-blob animation-delay-4000"></div>

            <motion.div 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease: "easeOut" }}
                className="relative z-10 w-full max-w-lg"
            >
                <div className="glass-card rounded-[2rem] p-8 md:p-10 shadow-2xl border border-white/80 w-full">
                    
                    <div className="flex flex-col items-center mb-8 text-center space-y-3">
                        <div className="w-14 h-14 bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-500/30 mb-2">
                            <Sparkles className="w-7 h-7 text-white" />
                        </div>
                        <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">Complete Your Profile</h1>
                        <p className="text-slate-500 text-sm px-4">Let's get to know you better. This helps us tailor your AI interviews perfectly.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        
                        {/* Name Input */}
                        <div className="space-y-1">
                            <label className={labelClasses}>Full Name</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                                    <User className="h-4 w-4 text-slate-400" />
                                </div>
                                <input 
                                    type="text" 
                                    name="name" 
                                    required
                                    value={formData.name} 
                                    onChange={handleChange} 
                                    className={`${inputClasses} pl-10`} 
                                    placeholder="John Doe" 
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-5">
                            {/* Date of Birth Input */}
                            <div className="space-y-1">
                                <label className={labelClasses}>Date of Birth</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                                        <Calendar className="h-4 w-4 text-slate-400" />
                                    </div>
                                    <input 
                                        type="date"
                                        name="dob"
                                        required
                                        max={new Date(new Date().setFullYear(new Date().getFullYear() - 16)).toISOString().split('T')[0]}
                                        value={formData.dob}
                                        onChange={handleChange}
                                        className={`${inputClasses} pl-10`}
                                    />
                                </div>
                                {/* Live age preview */}
                                {formData.dob && calcAge(formData.dob) !== null && (
                                    <p className="text-xs text-indigo-600 font-bold ml-1 mt-1">
                                        Age: {calcAge(formData.dob)} years
                                    </p>
                                )}
                            </div>

                            {/* Sex/Gender Input */}
                            <div className="space-y-1">
                                <label className={labelClasses}>Sex</label>
                                <select 
                                    name="sex" 
                                    required
                                    value={formData.sex} 
                                    onChange={handleChange} 
                                    className={`${inputClasses} appearance-none cursor-pointer`}
                                >
                                    <option value="" disabled>Select</option>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                    <option value="Other">Prefer not to say</option>
                                </select>
                            </div>
                        </div>

                        {/* Country Input */}
                        <div className="space-y-1">
                            <label className={labelClasses}>Country</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                                    <MapPin className="h-4 w-4 text-slate-400" />
                                </div>
                                <input 
                                    type="text" 
                                    name="country" 
                                    required
                                    value={formData.country} 
                                    onChange={handleChange} 
                                    className={`${inputClasses} pl-10`} 
                                    placeholder="e.g. United States" 
                                />
                            </div>
                        </div>

                        {/* Phone Input */}
                        <div className="space-y-1">
                            <label className={labelClasses}>Phone Number</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                                    <Phone className="h-4 w-4 text-slate-400" />
                                </div>
                                <input 
                                    type="tel" 
                                    name="phone" 
                                    required
                                    value={formData.phone} 
                                    onChange={handleChange} 
                                    className={`${inputClasses} pl-10`} 
                                    placeholder="+1 (555) 000-0000" 
                                />
                            </div>
                        </div>

                        <div className="pt-4">
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                disabled={loading || success}
                                type="submit"
                                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white font-bold py-3.5 px-6 rounded-xl shadow-xl shadow-purple-500/30 hover:shadow-purple-500/50 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                <AnimatePresence mode="wait">
                                    {loading ? (
                                        <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                        </motion.div>
                                    ) : success ? (
                                        <motion.div key="success" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-2">
                                            <CheckCircle2 className="w-5 h-5" /> Saved!
                                        </motion.div>
                                    ) : (
                                        <motion.div key="default" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-2">
                                            Continue to Dashboard <ArrowRight className="w-5 h-5" />
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.button>
                        </div>
                    </form>
                </div>
            </motion.div>
        </div>
    );
}
