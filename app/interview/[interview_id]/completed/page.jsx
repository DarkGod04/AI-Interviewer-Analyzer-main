"use client"
import React, { useEffect } from 'react'
import Image from 'next/image';
import { Rocket, Sparkles, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

function InterviewComplete() {
    const router = useRouter();

    useEffect(() => {
        const timer = setTimeout(() => {
            router.push('/');
        }, 5000);
        return () => clearTimeout(timer);
    }, [router]);

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center relative overflow-hidden"
            style={{ background: 'radial-gradient(ellipse at 50% 10%, rgba(236,72,153,0.15) 0%, transparent 55%), radial-gradient(ellipse at 80% 80%, rgba(168,85,247,0.12) 0%, transparent 55%), #020617' }}>

            {/* Background orbs */}
            <div className="absolute top-1/4 right-1/3 w-72 h-72 bg-pink-600/8 rounded-full blur-[100px] pointer-events-none animate-pulse" />
            <div className="absolute bottom-1/4 left-1/3 w-56 h-56 bg-purple-600/8 rounded-full blur-[80px] pointer-events-none animate-pulse" style={{ animationDelay: '2s' }} />

            {/* Completion icon */}
            <div className="relative mb-6">
                <div className="absolute inset-0 bg-pink-500/20 rounded-full blur-2xl scale-150" />
                <div className="relative w-20 h-20 bg-gradient-to-br from-pink-500 to-fuchsia-600 rounded-full flex items-center justify-center shadow-[0_0_40px_rgba(236,72,153,0.4)]">
                    <CheckCircle2 className="w-10 h-10 text-white" />
                </div>
            </div>

            <div className="inline-flex items-center gap-1.5 mb-4 px-3 py-1.5 bg-pink-500/10 border border-pink-500/20 rounded-full">
                <Sparkles className="w-3.5 h-3.5 text-pink-400" />
                <span className="text-xs font-bold text-pink-300 uppercase tracking-widest">Session Complete</span>
            </div>

            <h2 className="text-4xl md:text-5xl font-extrabold mb-3">
                <span className="text-white">Interview </span>
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-pink-400 via-fuchsia-400 to-purple-400">Complete</span>
            </h2>
            <p className="text-slate-400 text-lg mb-8">Thank you for your participation!</p>

            {/* Illustration */}
            <div className="relative w-full max-w-lg mb-10">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-slate-950 z-10 pointer-events-none rounded-2xl" />
                <Image
                    src="/candidate.jpg"
                    alt="Interview completion"
                    width={800}
                    height={400}
                    className="w-full h-auto rounded-2xl opacity-40 shadow-2xl"
                    priority
                />
            </div>

            {/* What's Next */}
            <div className="glass-card w-full max-w-lg rounded-2xl p-8 mb-8 text-left">
                <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(236,72,153,0.3)]"
                        style={{ background: 'linear-gradient(135deg, #ec4899, #d946ef)' }}>
                        <Rocket className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-white">What&apos;s Next?</h3>
                </div>
                <p className="text-slate-400 leading-relaxed text-sm">
                    Our AI will review your responses and generate a comprehensive performance report.
                    You&apos;ll receive detailed feedback on your technical skills, communication, and problem-solving abilities shortly.
                </p>
                <div className="mt-4 flex items-center gap-2 text-xs text-slate-600">
                    <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                    Auto-redirecting to home in 5 seconds...
                </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/dashboard">
                    <Button
                        size="lg"
                        className="px-8 font-bold rounded-xl border-0 text-white shadow-[0_4px_20px_rgba(236,72,153,0.3)] hover:shadow-[0_6px_30px_rgba(236,72,153,0.5)] hover:-translate-y-0.5 transition-all"
                        style={{ background: 'linear-gradient(135deg, #ec4899, #d946ef)' }}
                    >
                        View Dashboard
                    </Button>
                </Link>
            </div>

            {/* Footer note */}
            <div className="mt-8 text-sm text-slate-600">
                <p>
                    Questions? Contact us at{" "}
                    <a href="mailto:support@veritasai.com" className="text-pink-500 hover:text-pink-400 transition-colors hover:underline">
                        support@veritasai.com
                    </a>
                </p>
            </div>
        </div>
    )
}

export default InterviewComplete;