"use client"
import React, { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { supabase } from '@/services/supabaseClient'
import { ArrowLeft, Users, ChevronRight, Calendar, Clock, ShieldAlert, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import moment from 'moment'

export default function CandidatesListPage() {
  const { interview_id } = useParams()
  const router = useRouter()
  
  const [attempts, setAttempts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (interview_id) {
      GetAttempts()
    }
  }, [interview_id])

  const GetAttempts = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('InterviewAttempts')
        .select('*')
        .eq('interview_id', interview_id)
        .order('created_at', { ascending: false })

      if (error) throw error
      setAttempts(data || [])
    } catch (err) {
      console.error("Error loading candidates:", err)
      toast.error('Failed to load candidate attempts')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="h-[80vh] flex flex-col items-center justify-center space-y-6">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 border-4 border-pink-500/20 border-t-pink-500 rounded-full animate-spin" />
          <div className="absolute inset-2 border-4 border-fuchsia-500/20 border-b-fuchsia-500 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '0.8s' }} />
        </div>
        <p className="text-slate-400 font-medium">Loading candidate responses...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-4 md:p-8">
      {/* Header */}
      <div className="mb-8 flex items-center gap-4">
        <button
          onClick={() => router.push('/dashboard')}
          className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700 hover:bg-slate-700 hover:border-pink-500/40 transition-all duration-200 shadow-sm"
        >
          <ArrowLeft className="w-5 h-5 text-slate-300" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-white">Candidate Submissions</h1>
          <p className="text-sm text-slate-500 font-medium flex items-center gap-2">
            Dashboard <ChevronRight className="w-3 h-3" /> Submissions
          </p>
        </div>
      </div>

      {attempts.length === 0 ? (
        <div className="h-[50vh] flex flex-col items-center justify-center p-6 text-center">
          <div className="w-24 h-24 bg-slate-800 rounded-full flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(236,72,153,0.1)]">
            <ShieldAlert className="w-12 h-12 text-slate-600" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">No Responses Yet</h2>
          <p className="text-slate-500 max-w-md mx-auto">
            Share the interview link with candidates. Their AI-evaluated responses will appear here instantly.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {attempts.map((attempt) => {
             const feedbackData = attempt.feedback?.feedback || attempt.feedback || {};
             const ratings = feedbackData.rating || {};
             const avgScore = ((ratings.technicalSkills || 0) + (ratings.communication || 0) + (ratings.problemSolving || 0) + (ratings.experience || 0) + (ratings.tone || 0)) / 5;
             const isRecommended = feedbackData.Recommendation?.toLowerCase().includes("yes");

             return (
              <div key={attempt.id} className="glass-card group relative rounded-[1.5rem] overflow-hidden p-6 flex flex-col h-full hover:-translate-y-1 transition-all duration-300">
                {/* Top accent on hover */}
                <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-pink-500 via-fuchsia-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {/* Candidate avatar + info */}
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-[0_0_15px_rgba(236,72,153,0.3)]"
                    style={{ background: 'linear-gradient(135deg, #ec4899, #d946ef)' }}>
                    {attempt.candidatename?.charAt(0)?.toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-bold text-white">{attempt.candidatename}</h3>
                    <p className="text-xs text-slate-500">{attempt.candidateemail}</p>
                  </div>
                </div>

                {/* Score + status row */}
                <div className="flex items-center justify-between mb-6 px-4 py-3 bg-slate-800/60 border border-slate-700 rounded-xl">
                  <div className="flex flex-col">
                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-widest">Score</span>
                    <span className="font-black text-xl text-white">
                      {avgScore > 0 ? avgScore.toFixed(1) : 'N/A'}
                      <span className="text-sm text-slate-500 font-medium">/10</span>
                    </span>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-1">Status</span>
                    {isRecommended ? (
                      <span className="text-xs font-bold px-3 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-lg">✓ Hire</span>
                    ) : (
                      <span className="text-xs font-bold px-3 py-1 bg-red-500/10 text-red-400 border border-red-500/20 rounded-lg">✗ Reject</span>
                    )}
                  </div>
                </div>

                {/* Date */}
                <div className="flex items-center gap-2 mt-auto pt-4 border-t border-slate-800 mb-4">
                  <Calendar className="w-4 h-4 text-slate-600" />
                  <span className="text-xs text-slate-500 font-medium">{moment(attempt.created_at).format('MMM Do, YYYY - h:mm A')}</span>
                </div>

                <Button
                  onClick={() => router.push(`/dashboard/interview/${interview_id}/feedback/${attempt.id}`)}
                  className="w-full rounded-xl font-bold py-6 flex items-center gap-2 text-white border-0 transition-all duration-300"
                  style={{
                    background: 'linear-gradient(135deg, #ec4899, #d946ef)',
                    boxShadow: '0 4px 15px rgba(236,72,153,0.3)',
                  }}
                >
                  View Full Report <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
