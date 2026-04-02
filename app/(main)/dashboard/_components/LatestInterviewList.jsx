"use client"
import React, { useState, useEffect } from 'react'
import { Video, Loader2, Plus, Search } from 'lucide-react';
import Link from 'next/link';
import { supabase } from '@/services/supabaseClient';
import { useUser } from '@/app/provider'
import InterviewCard from "./InterviewCard"

function LatestInterviewList() {
    const [interviewList, setInterviewList] = useState([]);
    const [loading, setLoading] = useState(false);
    const { user } = useUser();

    useEffect(() => {
        if (user?.email) {
            GetinterviewList();
        }
    }, [user?.email])

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
                    <div className="w-1 h-6 rounded-full bg-gradient-to-b from-primary to-violet-500" />
                    <h2 className="font-extrabold text-2xl tracking-tight text-slate-800">
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
                        <div key={i} className="rounded-2xl overflow-hidden h-52 shimmer bg-slate-100/80" />
                    ))}
                </div>
            )}

            {/* Empty state */}
            {!loading && interviewList.length === 0 && (
                <div className="glass-card relative overflow-hidden rounded-3xl p-10 flex flex-col items-center gap-4 text-center border-2 border-dashed border-primary/20 bg-gradient-to-br from-primary/5 to-violet-500/5">
                    <div className="w-20 h-20 rounded-full flex items-center justify-center bg-white shadow-md animate-float">
                        <Video className="h-9 w-9 text-primary" />
                    </div>
                    <div>
                        <h3 className="font-extrabold text-xl text-slate-700 mb-1">No interviews yet</h3>
                        <p className="text-slate-500 text-sm">Create your first AI-powered interview and start evaluating candidates today.</p>
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