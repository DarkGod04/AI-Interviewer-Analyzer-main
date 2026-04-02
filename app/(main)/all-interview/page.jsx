"use client"
import React, { useState, useEffect } from 'react'
import { Video, Loader2, Plus, SlidersHorizontal, LayoutGrid, List } from 'lucide-react';
import Link from 'next/link';
import { supabase } from '@/services/supabaseClient';
import { useUser } from '@/app/provider'
import InterviewCard from './../dashboard/_components/InterviewCard';

function Page() {
    const [interviewList, setInterviewList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'
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
                .order('id', { ascending: false });
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
        <div className="space-y-6">
            {/* ── Page Header ── */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-1 h-7 rounded-full bg-gradient-to-b from-primary to-violet-500" />
                    <div>
                        <h1 className="font-extrabold text-2xl tracking-tight text-slate-800">All Interviews</h1>
                        <p className="text-sm text-slate-500 font-medium mt-0.5">
                            {interviewList.length > 0 ? `${interviewList.length} interview${interviewList.length !== 1 ? 's' : ''} created` : 'Your interview history'}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    {/* View mode toggle */}
                    <div className="flex items-center gap-1 p-1 bg-white border border-slate-200 rounded-xl shadow-sm">
                        <button
                            onClick={() => setViewMode('grid')}
                            className={`p-2 rounded-lg transition-all duration-200 ${viewMode === 'grid' ? 'bg-primary text-white shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                        >
                            <LayoutGrid className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => setViewMode('list')}
                            className={`p-2 rounded-lg transition-all duration-200 ${viewMode === 'list' ? 'bg-primary text-white shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                        >
                            <List className="w-4 h-4" />
                        </button>
                    </div>

                    <Link href="/dashboard/create-interview">
                        <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold text-white transition-all duration-300 hover:shadow-lg hover:shadow-primary/30 hover:-translate-y-0.5"
                            style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', boxShadow: '0 4px 12px rgba(99,102,241,0.25)' }}
                        >
                            <Plus className="w-4 h-4" /> New Interview
                        </button>
                    </Link>
                </div>
            </div>

            {/* ── Loading Skeletons ── */}
            {loading && (
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-5">
                    {[1, 2, 3, 4, 5, 6].map(i => (
                        <div key={i} className="rounded-2xl h-52 shimmer" style={{ background: '#f1f5f9' }} />
                    ))}
                </div>
            )}

            {/* ── Empty State ── */}
            {!loading && interviewList.length === 0 && (
                <div className="relative overflow-hidden rounded-2xl p-14 flex flex-col items-center gap-5 text-center"
                    style={{
                        background: 'linear-gradient(135deg, #eef2ff 0%, #f5f3ff 100%)',
                        border: '1.5px dashed rgba(99,102,241,0.3)',
                    }}
                >
                    <div className="w-24 h-24 rounded-full flex items-center justify-center bg-white shadow-lg animate-float">
                        <Video className="h-10 w-10 text-primary" />
                    </div>
                    <div>
                        <h3 className="font-extrabold text-2xl text-slate-700 mb-2">No interviews yet</h3>
                        <p className="text-slate-500 text-base max-w-md">
                            Create your first AI-powered interview and start evaluating candidates effortlessly.
                        </p>
                    </div>
                    <Link href="/dashboard/create-interview">
                        <button className="flex items-center gap-2 px-7 py-3 rounded-xl text-sm font-bold text-white transition-all duration-300 hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5"
                            style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', boxShadow: '0 4px 16px rgba(99,102,241,0.3)' }}
                        >
                            <Plus className="w-4 h-4" /> Create New Interview
                        </button>
                    </Link>
                </div>
            )}

            {/* ── Interview Grid ── */}
            {!loading && interviewList.length > 0 && (
                <div className={viewMode === 'grid'
                    ? "grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-5"
                    : "flex flex-col gap-4"
                }>
                    {interviewList.map((interview, index) => (
                        <InterviewCard Interviews={interview} key={index} />
                    ))}
                </div>
            )}
        </div>
    )
}

export default Page