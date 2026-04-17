"use client"
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Settings2, User, Bell, Palette, Shield, Save } from 'lucide-react';
import { useUser } from '@/app/provider';
import { supabase } from '@/services/supabaseClient';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

function SettingsPage() {
  const { user, setUser } = useUser();
  const [loading, setLoading] = useState(false);
  const [profileName, setProfileName] = useState('');

  // Sync state when user context is ready
  useEffect(() => {
    if (user?.name) setProfileName(user.name);
  }, [user]);

  const handleUpdateProfile = async () => {
    if (!user?.email) return;
    setLoading(true);
    try {
      const { error } = await supabase
        .from('Users')
        .update({ name: profileName })
        .eq('email', user.email);

      if (error) throw error;
      
      // Update global context
      setUser({ ...user, name: profileName });
      toast.success("Profile updated successfully!");
    } catch (error) {
      toast.error("Failed to update profile.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const DemoFeatures = () => (
    <div className="space-y-4 py-6">
      <div className="p-6 bg-slate-50/80 border border-slate-200 rounded-2xl text-center shadow-inner">
        <p className="text-slate-600 font-bold text-base">Feature in Preview</p>
        <p className="text-sm text-slate-500 mt-2">These advanced configuration options will be fully unlocked in our next major platform update!</p>
      </div>
    </div>
  );

  const ProfileForm = () => (
    <div className="space-y-5 py-4">
      <div className="space-y-2.5">
        <label className="text-sm font-bold text-slate-700">Display Name</label>
        <Input 
          value={profileName} 
          onChange={(e) => setProfileName(e.target.value)} 
          placeholder="First Last" 
          className="rounded-xl border-slate-300 focus-visible:ring-primary shadow-sm"
        />
      </div>
      <div className="space-y-2.5">
        <label className="text-sm font-bold text-slate-700">Email Address (Read-Only)</label>
        <Input disabled value={user?.email || ''} className="bg-slate-100/70 text-slate-500 rounded-xl cursor-not-allowed" />
      </div>
      <Button disabled={loading} onClick={handleUpdateProfile} className="w-full mt-4 bg-primary hover:bg-violet-600 rounded-xl h-11 text-sm font-bold shadow-md hover:shadow-lg transition-all">
        {loading ? "Re-configuring..." : "Save Preferences"}
      </Button>
    </div>
  );

  const settingsOptions = [
    {
      title: "Profile Preferences",
      description: "Manage your personal information, display name, and avatar settings.",
      icon: User,
      color: "text-blue-600",
      bg: "bg-blue-50 border-blue-100",
      content: <ProfileForm />
    },
    {
      title: "Appearance & Theme",
      description: "Customize the platform's look, feel, and color schemes.",
      icon: Palette,
      color: "text-purple-600",
      bg: "bg-purple-50 border-purple-100",
      content: <DemoFeatures />
    },
    {
      title: "Notifications",
      description: "Control alerts, email preferences, and SMS notifications.",
      icon: Bell,
      color: "text-amber-600",
      bg: "bg-amber-50 border-amber-100",
      content: <DemoFeatures />
    },
    {
      title: "Account Security",
      description: "Update passwords, manage two-factor authentication and sessions.",
      icon: Shield,
      color: "text-emerald-600",
      bg: "bg-emerald-50 border-emerald-100",
      content: <DemoFeatures />
    },
  ];

  return (
    <div className="min-h-screen relative mt-5 rounded-2xl border-none pt-24 p-5 glass-card overflow-hidden">
      {/* Decorative background Elements */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl -z-10 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-violet-500/5 rounded-full blur-3xl -z-10 pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 z-10 relative">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold mb-6 bg-pink-500/10 border border-pink-500/20 text-pink-400">
            <Settings2 className="h-4 w-4 text-pink-400" />
            Preferences
          </motion.div>
          <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6 tracking-tight">
            Account <span className="gradient-text font-caramel pb-2 pr-2">Settings</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-500 max-w-2xl mx-auto font-medium">
            Manage your account preferences, configurations, and tailor the platform to your needs. This feature is currently in preview.
          </p>
        </div>

        {/* Profile Info Card */}
        <div className="glass-card p-8 mb-12 mx-auto max-w-4xl text-center md:text-left flex flex-col md:flex-row items-center gap-6">
          <div className="h-20 w-20 rounded-full flex items-center justify-center text-white text-3xl font-extrabold shadow-[0_0_20px_rgba(236,72,153,0.4)] ring-4 ring-pink-500/20 shrink-0"
            style={{ background: 'linear-gradient(135deg, #ec4899, #d946ef)' }}>
            {user?.name ? user.name.charAt(0).toUpperCase() : (user?.email ? user.email.charAt(0).toUpperCase() : 'U')}
          </div>
          <div className="overflow-hidden w-full">
            <h3 className="text-2xl font-extrabold text-white mb-1 line-clamp-1">{user?.name || "Global Account"}</h3>
            <p className="text-slate-400 font-semibold line-clamp-1">{user?.email || 'Loading your profile...'}</p>
          </div>
          <div className="md:ml-auto mt-4 md:mt-0 flex-shrink-0">
             <Dialog>
               <DialogTrigger asChild>
                 <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold bg-slate-800 border border-slate-700 text-slate-200 hover:bg-slate-700 hover:border-pink-500/30 transition-colors cursor-pointer active:scale-95 duration-200">
                    Manage Profile
                 </div>
               </DialogTrigger>
               <DialogContent className="sm:max-w-md rounded-[2rem]">
                 <DialogHeader>
                   <DialogTitle className="text-2xl font-extrabold">Edit Profile</DialogTitle>
                 </DialogHeader>
                 <ProfileForm />
               </DialogContent>
             </Dialog>
          </div>
        </div>

        {/* Settings Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 max-w-4xl mx-auto mb-16">
          {settingsOptions.map((option, index) => (
            <Dialog key={index}>
              <DialogTrigger asChild>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="glass-card p-6 hover:shadow-2xl transition-all duration-300 group cursor-pointer hover:-translate-y-1 text-left h-full"
                >
                  <div className="flex items-start gap-5">
                    <div className={`p-4 rounded-2xl border flex-shrink-0 transition-transform group-hover:scale-110 duration-300 ${option.bg}`}>
                      <option.icon className={`h-6 w-6 ${option.color}`} />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white mb-2 group-hover:text-pink-400 transition-colors">{option.title}</h3>
                      <p className="text-slate-500 font-medium text-sm leading-relaxed">{option.description}</p>
                    </div>
                  </div>
                </motion.div>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md rounded-[1.5rem]">
                 <DialogHeader>
                   <div className="flex items-center gap-3 mb-2">
                     <div className={`p-2 rounded-lg bg-opacity-10 ${option.bg.split(' ')[0]}`}>
                        <option.icon className={`h-5 w-5 ${option.color}`} />
                     </div>
                     <DialogTitle className="text-2xl font-extrabold">{option.title}</DialogTitle>
                   </div>
                 </DialogHeader>
                 {option.content}
               </DialogContent>
            </Dialog>
          ))}
        </div>

      </div>
    </div>
  );
}

export default SettingsPage;
