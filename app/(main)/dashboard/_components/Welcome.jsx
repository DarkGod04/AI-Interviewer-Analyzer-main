"use client"
import React from 'react'
import { useUser } from "../../../provider"
import { Sparkles, Zap, Terminal, Cpu } from 'lucide-react'
import Link from 'next/link'

function Welcome() {
    const { user, loading } = useUser();

    // Animated skeleton while auth resolves
    if (loading) {
        return (
            <div className="relative w-full overflow-hidden rounded-[1.5rem] mt-4 mb-6 border border-yellow-500/20 bg-black"
                style={{ minHeight: '130px' }}>
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#111_1px,transparent_1px),linear-gradient(to_bottom,#111_1px,transparent_1px)] bg-[size:32px_32px] opacity-40" />
                <div className="relative z-10 p-6 md:p-8 flex justify-between items-center gap-4 animate-pulse">
                    <div className="flex-1 space-y-3">
                        <div className="h-5 bg-yellow-500/10 border border-yellow-500/20 rounded w-32" />
                        <div className="h-9 bg-yellow-500/10 border border-yellow-500/20 rounded-lg w-72" />
                        <div className="h-3 bg-zinc-800 rounded w-52" />
                    </div>
                    <div className="w-20 h-20 bg-yellow-500/10 border border-yellow-500/20 rounded-full flex-shrink-0" />
                </div>
            </div>
        );
    }

    // Not logged in — prompt to sign in
    if (!user) {
        return (
            <div className="relative w-full overflow-hidden rounded-[1.5rem] mt-4 mb-6 border border-yellow-500/30 bg-black"
                style={{ minHeight: '100px' }}>
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#111_1px,transparent_1px),linear-gradient(to_bottom,#111_1px,transparent_1px)] bg-[size:32px_32px] opacity-30" />
                <div className="relative z-10 p-6 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <Terminal className="w-5 h-5 text-yellow-400" />
                        <span className="text-yellow-400 font-mono text-sm font-bold tracking-widest uppercase">
                            {'>'} AUTHENTICATION REQUIRED
                        </span>
                    </div>
                    <Link href="/auth"
                        className="px-5 py-2 bg-yellow-400 text-black font-black text-sm rounded-lg hover:bg-yellow-300 transition-all duration-200 tracking-widest uppercase">
                        Sign In
                    </Link>
                </div>
            </div>
        );
    }

    const hour = new Date().getHours();
    const greeting = hour < 12 ? "MORNING" : hour < 18 ? "AFTERNOON" : "EVENING";

    return (
        <div className="relative w-full overflow-hidden rounded-[1.5rem] mt-4 mb-6 border border-yellow-500/40"
            style={{ background: '#000', minHeight: '130px' }}>

            {/* Cyberpunk grid background */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#1a1a00_1px,transparent_1px),linear-gradient(to_bottom,#1a1a00_1px,transparent_1px)] bg-[size:40px_40px] opacity-60" />

            {/* Yellow top scan line */}
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-yellow-400 to-transparent opacity-80" />

            {/* Blue bottom accent */}
            <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-60" />

            {/* Red corner accent top-right */}
            <div className="absolute top-0 right-0 w-24 h-24 bg-red-500/10 rounded-bl-full" />

            {/* Blurry yellow orb */}
            <div className="absolute top-[-40%] left-[20%] w-72 h-32 bg-yellow-500/8 blur-[80px] rounded-full pointer-events-none" />
            <div className="absolute bottom-[-40%] right-[10%] w-48 h-32 bg-blue-500/10 blur-[60px] rounded-full pointer-events-none" />

            <div className="relative z-10 p-6 md:p-8 w-full flex items-center justify-between gap-4">
                <div className="flex flex-col justify-center">

                    {/* GOOD [MORNING/AFTERNOON/EVENING] badge */}
                    <div className="inline-flex items-center gap-2 mb-3 px-3 py-1 border border-yellow-500/40 bg-yellow-500/5 rounded w-fit">
                        <span className="w-1.5 h-1.5 rounded-full bg-yellow-400 animate-pulse" />
                        <span className="text-[10px] font-black text-yellow-400 uppercase tracking-[0.3em] font-mono">
                            GOOD {greeting}
                        </span>
                    </div>

                    {/* Name display — cyberpunk style */}
                    <h1 className="text-3xl md:text-4xl font-black tracking-tight flex items-center flex-wrap gap-3">
                        <span className="text-white font-mono">WELCOME,</span>
                        <span
                            className="font-black font-mono uppercase"
                            style={{
                                background: 'linear-gradient(90deg, #FBBF24 0%, #EF4444 50%, #3B82F6 100%)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                backgroundClip: 'text',
                                textShadow: 'none',
                                filter: 'drop-shadow(0 0 12px rgba(251,191,36,0.5))',
                            }}
                        >
                            {user?.name?.toUpperCase() || 'USER'}
                        </span>
                        <span className="text-2xl" style={{ filter: 'drop-shadow(0 0 8px #FBBF24)' }}>⚡</span>
                    </h1>

                    <p className="text-[11px] text-zinc-600 font-mono mt-2 uppercase tracking-[0.25em]">
                        {'>'} AI-POWERED INTERVIEWS · INTELLIGENT INSIGHTS
                    </p>
                </div>

                <div className="flex items-center gap-4 flex-shrink-0">
                    {/* Cyberpunk stat chip */}
                    <div className="hidden md:flex items-center gap-2.5 px-4 py-2.5 border border-blue-500/30 bg-blue-500/5 rounded-xl">
                        <Cpu className="w-4 h-4 text-blue-400" />
                        <div>
                            <p className="text-[9px] font-black text-blue-500/70 uppercase tracking-widest font-mono">SYSTEM</p>
                            <p className="text-xs font-black text-blue-300 tracking-tight font-mono">ONLINE</p>
                        </div>
                    </div>

                    {/* Avatar with cyberpunk glow ring */}
                    <div className="relative flex-shrink-0 group">
                        {/* Animated glow border */}
                        <div className="absolute -inset-[3px] rounded-full opacity-80 group-hover:opacity-100 transition-opacity duration-300"
                            style={{
                                background: 'linear-gradient(135deg, #FBBF24, #EF4444, #3B82F6)',
                                animation: 'spin 4s linear infinite',
                            }} />
                        <img
                            className="relative rounded-full border-2 border-black object-cover bg-zinc-900"
                            src={user?.picture || "https://img.freepik.com/free-vector/businessman-character-avatar-isolated_24877-60111.jpg"}
                            alt={user?.name || "User Avatar"}
                            width={72}
                            height={72}
                            style={{ position: 'relative', zIndex: 1 }}
                        />
                        {/* Online dot */}
                        <div className="absolute bottom-0.5 right-0.5 w-4 h-4 bg-yellow-400 rounded-full border-2 border-black z-10 flex items-center justify-center">
                            <Zap className="w-2 h-2 text-black" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Spinning keyframe for avatar border */}
            <style>{`
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
}

export default Welcome