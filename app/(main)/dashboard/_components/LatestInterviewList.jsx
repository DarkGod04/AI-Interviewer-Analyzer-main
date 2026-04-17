"use client"
import React, { useState, useEffect } from 'react'
import { Video, Loader2, Plus, Search } from 'lucide-react';
import Link from 'next/link';
import { supabase } from '@/services/supabaseClient';
import { useUser } from '@/app/provider'
import InterviewCard from "./InterviewCard"

function LatestInterviewList() {
    const [interviewList, setInterviewList] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user, loading: userLoading } = useUser();

    useEffect(() => {
        if (userLoading) return; // Wait for auth to resolve
        if (user?.email) {
            GetinterviewList();
        } else {
            setLoading(false); // Not logged in
        }
    }, [user?.email, userLoading])

    const GetinterviewList = async () => {
        setLoading(true);
        try {
            let { data: Interviews, error } = await supabase
                .from('Interviews')
                .select('*')
                .eq('userEmail', user?.email)
                .order('id', { ascending: false })
                .limit(6);
            if (error) throw error;
            setInterviewList(Interviews || []);
        } catch (err) {
            console.error('Error fetching interviews:', err);
            setInterviewList([]);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="mt-8">
            {/* Section header */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="w-1 h-6 rounded-full bg-gradient-to-b from-yellow-400 to-red-500" />
                    <h2 className="font-extrabold text-2xl tracking-tight text-white">
                        Recent Interviews
                    </h2>
                </div>
                {interviewList.length > 0 && (
                    <Link href="/all-interview">
                        <button className="flex items-center gap-1.5 text-sm font-semibold text-primary hover:text-violet-600 transition-colors duration-200">
                            View All <Search className="w-3.5 h-3.5" />
                        </button>
                    </Link>
                )}
            </div>

            {/* Loading skeleton */}
            {loading && (
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-5">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="rounded-2xl overflow-hidden h-52 shimmer border border-yellow-500/20" />
                    ))}
                </div>
            )}

            {/* Empty state */}
            {!loading && interviewList.length === 0 && (
                <div className="glass-card relative overflow-hidden rounded-3xl p-10 flex flex-col items-center gap-4 text-center border border-dashed border-yellow-500/30 bg-gradient-to-br from-yellow-500/5 to-black">
                    <div className="w-20 h-20 rounded-[2rem] flex items-center justify-center bg-yellow-500/10 border border-yellow-500/20 shadow-md animate-float">
                        <Video className="h-9 w-9 text-yellow-400" />
                    </div>
                    <div>
                        <h3 className="font-extrabold text-xl text-white mb-1">No interviews yet</h3>
                        <p className="text-slate-400 text-sm">Create your first AI-powered interview and start evaluating candidates today.</p>
                    </div>
                    <Link href="/dashboard/create-interview">
                        <button className="btn-glow flex items-center gap-2 text-sm">
                            <Plus className="w-4 h-4" /> Create New Interview
                        </button>
                    </Link>
                </div>
            )}

            {/* Interview cards grid */}
            {!loading && interviewList.length > 0 && (
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-5">
                    {interviewList.map((interview, index) => (
                        <InterviewCard Interviews={interview} key={index} />
                    ))}
                </div>
            )}
        </div>
    )
}

export default LatestInterviewList