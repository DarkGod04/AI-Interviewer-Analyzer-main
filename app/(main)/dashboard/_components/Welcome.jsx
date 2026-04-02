"use client"
import React from 'react'
import { useUser } from "../../../provider"
import { Sparkles, TrendingUp, Zap } from 'lucide-react'

function Welcome() {
    const { user, loading } = useUser();

    if (loading || !user) {
        return (
            <div className="premium-card p-6 md:p-8 w-full flex justify-between items-center h-[120px]">
                <div className="flex-1 space-y-3">
                    <div className="h-8 bg-slate-100 rounded-xl w-56 shimmer" />
                    <div className="h-4 bg-slate-100 rounded-lg w-40 shimmer" />
                </div>
                <div className="w-16 h-16 bg-slate-100 rounded-full shimmer" />
            </div>
        );
    }

    const hour = new Date().getHours();
    const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

    return (
        <div className="relative w-full overflow-hidden rounded-2xl">
            {/* Animated background gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/8 via-violet-500/5 to-fuchsia-500/8 rounded-2xl" />
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-violet-400/10 to-transparent rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-primary/10 to-transparent rounded-full blur-2xl pointer-events-none" />

            {/* Shine sweep */}
            <div className="absolute inset-0 overflow-hidden rounded-2xl pointer-events-none">
                <div className="absolute top-0 w-[40%] h-full bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-[-20deg] animate-shine" style={{ left: '-100%' }} />
            </div>

            <div className="relative z-10 premium-card p-6 md:p-8 w-full flex items-center justify-between gap-4" style={{background: 'transparent', boxShadow: 'none'}}>
                <div className="flex flex-col justify-center">
                    {/* Greeting badge */}
                    <div className="inline-flex items-center gap-1.5 mb-3 px-3 py-1 bg-primary/10 border border-primary/20 rounded-full w-fit">
                        <Sparkles className="w-3 h-3 text-primary" />
                        <span className="text-xs font-semibold text-primary tracking-wide">{greeting}</span>
                    </div>

                    <h1 className="text-2xl md:text-3xl font-extrabold text-slate-800 tracking-tight flex items-center flex-wrap gap-2">
                        Welcome back,
                        <span className="font-caramel text-3xl md:text-4xl bg-clip-text text-transparent bg-gradient-to-r from-primary via-violet-500 to-fuchsia-500 pt-1">
                            {user?.name}
                        </span>
                        <span className="text-2xl">👋</span>
                    </h1>
                    <p className="text-sm text-slate-500 font-medium mt-1 uppercase tracking-widest">
                        AI-Driven Interviews · Hassle-Free Hiring
                    </p>
                </div>

                <div className="flex items-center gap-4 flex-shrink-0">
                    {/* Stats mini pill */}
                    <div className="hidden md:flex items-center gap-2 px-4 py-2.5 bg-white/80 border border-slate-200/80 rounded-2xl shadow-sm">
                        <TrendingUp className="w-4 h-4 text-emerald-500" />
                        <div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Platform</p>
                            <p className="text-xs font-extrabold text-slate-700">AI-Powered</p>
                        </div>
                    </div>

                    {/* Avatar with glow ring */}
                    <div className="relative flex-shrink-0">
                        <div className="absolute -inset-1.5 bg-gradient-to-r from-primary to-violet-500 rounded-full blur-sm opacity-40 animate-pulse" />
                        <img
                            className="relative rounded-full border-2 border-white shadow-xl object-cover ring-2 ring-primary/20"
                            src={user?.picture || "https://img.freepik.com/free-vector/businessman-character-avatar-isolated_24877-60111.jpg"}
                            alt="User Avatar"
                            width={64}
                            height={64}
                        />
                        <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-gradient-to-br from-emerald-400 to-emerald-500 rounded-full border-2 border-white flex items-center justify-center">
                            <Zap className="w-2.5 h-2.5 text-white" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Welcome