"use client"
import React from 'react';
import { motion } from 'framer-motion';
import { Settings2, User, Bell, Palette, Shield, CreditCard } from 'lucide-react';
import { useUser } from '@/app/provider';

function page() {
  const { user } = useUser();

  const settingsOptions = [
    {
      title: "Profile Preferences",
      description: "Manage your personal information, display name, and avatar settings.",
      icon: User,
      color: "text-blue-600",
      bg: "bg-blue-50 border-blue-100"
    },
    {
      title: "Appearance & Theme",
      description: "Customize the platform's look, feel, and color schemes.",
      icon: Palette,
      color: "text-purple-600",
      bg: "bg-purple-50 border-purple-100"
    },
    {
      title: "Notifications",
      description: "Control alerts, email preferences, and SMS notifications.",
      icon: Bell,
      color: "text-amber-600",
      bg: "bg-amber-50 border-amber-100"
    },
    {
      title: "Account Security",
      description: "Update passwords, manage two-factor authentication and sessions.",
      icon: Shield,
      color: "text-emerald-600",
      bg: "bg-emerald-50 border-emerald-100"
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
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold mb-6 tag-pill bg-white border border-slate-200 text-slate-600 shadow-sm">
            <Settings2 className="h-4 w-4 text-primary" />
            Preferences
          </motion.div>
          <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 mb-6 tracking-tight">
            Account <span className="gradient-text font-caramel pb-2 pr-2">Settings</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-500 max-w-2xl mx-auto font-medium">
            Manage your account preferences, configurations, and tailor the platform to your needs. This feature is currently in preview.
          </p>
        </div>

        {/* Profile Info Card */}
        <div className="premium-card bg-white/70 border border-slate-100 p-8 mb-12 mx-auto max-w-4xl shadow-lg ring-1 ring-slate-900/5 text-center md:text-left flex flex-col md:flex-row items-center gap-6 backdrop-blur-xl">
          <div className="h-20 w-20 rounded-full bg-gradient-to-br from-primary to-violet-600 flex items-center justify-center text-white text-3xl font-extrabold shadow-md ring-4 ring-white">
            {user?.email ? user.email.charAt(0).toUpperCase() : 'U'}
          </div>
          <div>
            <h3 className="text-2xl font-extrabold text-slate-900 mb-1">Global Account</h3>
            <p className="text-slate-500 font-semibold">{user?.email || 'Loading your profile...'}</p>
          </div>
          <div className="md:ml-auto mt-4 md:mt-0">
             <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold bg-slate-50 border border-slate-200 text-slate-700 shadow-sm hover:bg-slate-100 transition-colors cursor-pointer">
                Manage Profile
             </div>
          </div>
        </div>

        {/* Settings Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 max-w-4xl mx-auto mb-16">
          {settingsOptions.map((option, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="premium-card p-6 bg-white/60 backdrop-blur-xl hover:shadow-2xl transition-all duration-300 border border-slate-100 group cursor-pointer hover:-translate-y-1 glow-border"
            >
              <div className="flex items-start gap-5">
                <div className={`p-4 rounded-2xl border flex-shrink-0 transition-transform group-hover:scale-110 duration-300 ${option.bg}`}>
                  <option.icon className={`h-6 w-6 ${option.color}`} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-800 mb-2 group-hover:text-primary transition-colors">{option.title}</h3>
                  <p className="text-slate-500 font-medium text-sm leading-relaxed">{option.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </div>
  );
}

export default page;
