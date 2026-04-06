"use client"
import React, { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { supabase } from '@/services/supabaseClient'
import { 
  ArrowLeft, Brain, MessageSquare, Target, Briefcase, 
  Smile, ShieldCheck, ShieldAlert, Award, ChevronRight, FileText, Activity
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import moment from 'moment'

export default function FeedbackPage() {
  const { interview_id } = useParams()
  const router = useRouter()
  
  const [feedbackRecord, setFeedbackRecord] = useState(null)
  const [interviewRecord, setInterviewRecord] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (interview_id) {
      GetFeedbackDetails()
    }
  }, [interview_id])

  const GetFeedbackDetails = async () => {
    setLoading(true)
    try {
      // Fetch Feedback
      const { data: feedbackData, error: feedbackError } = await supabase
        .from('interview-feedback')
        .select('*')
        .eq('interview_id', interview_id)

      if (feedbackError) throw feedbackError

      // Fetch Interview details
      const { data: interviewData, error: interviewError } = await supabase
        .from('Interviews')
        .select('*')
        .eq('interview_id', interview_id)

      if (interviewError) throw interviewError

      if (feedbackData?.length > 0) {
        setFeedbackRecord(feedbackData[0])
      }
      if (interviewData?.length > 0) {
        setInterviewRecord(interviewData[0])
      }

    } catch (err) {
      console.error(err)
      toast.error('Failed to load feedback details')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="h-[80vh] flex flex-col items-center justify-center space-y-4">
        <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
        <p className="text-slate-500 font-medium animate-pulse">Analyzing AI Feedback...</p>
      </div>
    )
  }

  if (!feedbackRecord) {
    return (
      <div className="h-[80vh] flex flex-col items-center justify-center p-6 text-center space-y-6">
        <div className="w-24 h-24 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center">
          <ShieldAlert className="w-12 h-12 text-slate-400" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-2">No Feedback Found</h2>
          <p className="text-slate-500 max-w-md mx-auto">
            {"It looks like there's no feedback generated for this interview yet. The candidate might not have completed the session."}
          </p>
        </div>
        <Button onClick={() => router.back()} className="mt-4 gap-2">
          <ArrowLeft className="w-4 h-4" /> Go Back
        </Button>
      </div>
    )
  }

  // Parse feedback logic gracefully
  const parsed = feedbackRecord.feedback || {}
  const feedbackObj = parsed.feedback || parsed
  const ratings = feedbackObj.rating || {}
  
  const techScore = ratings.technicalSkills || 0
  const commScore = ratings.communication || 0
  const probScore = ratings.problemSolving || 0
  const expScore = ratings.experience || 0
  const toneScore = ratings.tone || 0
  
  const isRecommended = feedbackObj.Recommendation?.toLowerCase().includes("yes") || false

  const metricCards = [
    { label: "Technical Skills", score: techScore, icon: Brain, color: "from-blue-500 to-cyan-500", bg: "bg-blue-50 dark:bg-blue-900/20" },
    { label: "Communication", score: commScore, icon: MessageSquare, color: "from-violet-500 to-purple-500", bg: "bg-violet-50 dark:bg-violet-900/20" },
    { label: "Problem Solving", score: probScore, icon: Target, color: "from-amber-500 to-orange-500", bg: "bg-amber-50 dark:bg-amber-900/20" },
    { label: "Experience Match", score: expScore, icon: Briefcase, color: "from-emerald-500 to-teal-500", bg: "bg-emerald-50 dark:bg-emerald-900/20" },
    { label: "Professional Tone", score: toneScore, icon: Smile, color: "from-pink-500 to-rose-500", bg: "bg-pink-50 dark:bg-pink-900/20" },
  ]

  // Calculate Average
  const averageScore = ((techScore + commScore + probScore + expScore + toneScore) / 5).toFixed(1)

  return (
    <div className="min-h-screen p-4 md:p-8 space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
      
      {/* Background Orbs */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-violet-500/10 dark:bg-violet-500/5 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-blue-500/10 dark:bg-blue-500/5 blur-[120px]" />
      </div>

      {/* Header / Nav */}
      <div className="flex items-center gap-4">
        <button 
          onClick={() => router.back()} 
          className="p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition shadow-sm"
        >
          <ArrowLeft className="w-5 h-5 text-slate-600 dark:text-slate-300" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Interview Evaluation Details</h1>
          <p className="text-sm text-slate-500 font-medium flex items-center gap-2">
            Dashboard <ChevronRight className="w-3 h-3" /> Feedback
          </p>
        </div>
      </div>

      {/* Hero Card */}
      <div className="relative overflow-hidden bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-2xl shadow-indigo-500/5">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-[80px]" />
        
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-sm font-bold border border-indigo-100 dark:border-indigo-500/20">
              <Award className="w-4 h-4" /> Final Assessment
            </div>
            
            <div>
              <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-2">
                {feedbackRecord.userName || "Candidate"}
              </h2>
              <div className="flex flex-wrap items-center gap-4 text-slate-500 dark:text-slate-400 font-medium text-sm">
                <span className="flex items-center gap-1.5"><Briefcase className="w-4 h-4" /> {interviewRecord?.jobPosition || "N/A"}</span>
                <span className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-600" />
                <span className="flex items-center gap-1.5"><FileText className="w-4 h-4" /> {interviewRecord?.type || "General"}</span>
                <span className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-600" />
                <span>{moment(feedbackRecord.created_at).format("MMMM Do YYYY")}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center md:items-end gap-3">
            <div className={`flex items-center gap-2 px-6 py-3 rounded-2xl border-2 font-bold text-lg shadow-lg ${isRecommended ? 'bg-emerald-50 border-emerald-200 text-emerald-700 shadow-emerald-500/20 dark:bg-emerald-500/10 dark:border-emerald-500/30 dark:text-emerald-400' : 'bg-red-50 border-red-200 text-red-700 shadow-red-500/20 dark:bg-red-500/10 dark:border-red-500/30 dark:text-red-400'} animate-in zoom-in-95 duration-500 delay-200`}>
              {isRecommended ? <ShieldCheck className="w-6 h-6" /> : <ShieldAlert className="w-6 h-6" />}
              {isRecommended ? 'Recommended to Hire' : 'Not Recommended'}
            </div>
            
            <div className="flex items-end gap-1">
              <span className="text-3xl font-black text-slate-900 dark:text-white">{averageScore}</span>
              <span className="text-slate-500 font-medium mb-1">/ 10 Overall Score</span>
            </div>
          </div>
        </div>
      </div>

      {/* Grid Architecture */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Metrics Metrics */}
        <div className="lg:col-span-1 space-y-6">
          <h3 className="text-xl font-bold flex items-center gap-2 text-slate-800 dark:text-slate-100">
            <Activity className="w-5 h-5 text-indigo-500" /> Scoring Metrics
          </h3>
          
          <div className="flex flex-col gap-4">
            {metricCards.map((metric, idx) => (
              <div key={idx} className={`p-5 rounded-2xl border border-slate-100 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-md shadow-sm hover:shadow-md transition-all duration-300 group`}>
                <div className="flex justify-between items-center mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-xl ${metric.bg}`}>
                      <metric.icon className={`w-5 h-5 text-transparent bg-clip-text bg-gradient-to-br ${metric.color}`} style={{ color: idx === 0 ? '#3b82f6' : idx === 1 ? '#8b5cf6' : idx === 2 ? '#f59e0b' : idx === 3 ? '#10b981' : '#ec4899' }} />
                    </div>
                    <span className="font-semibold text-slate-700 dark:text-slate-200">{metric.label}</span>
                  </div>
                  <span className="font-bold text-slate-900 dark:text-white">{metric.score} <span className="text-slate-400 text-sm">/ 10</span></span>
                </div>
                
                {/* Custom Progress Ring/Bar */}
                <div className="h-2.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div 
                    className={`h-full bg-gradient-to-r ${metric.color} rounded-full transition-all duration-1000 ease-out`}
                    style={{ width: `${(metric.score / 10) * 100}%`, transformOrigin: 'left' }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: AI Analysis */}
        <div className="lg:col-span-2 space-y-6">
          <h3 className="text-xl font-bold flex items-center gap-2 text-slate-800 dark:text-slate-100">
            <Brain className="w-5 h-5 text-violet-500" /> AI Insights & Analysis
          </h3>
          
          <div className="space-y-6">
            {/* Tone Analysis Card */}
            <div className="premium-card relative bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-xl shadow-slate-200/40 dark:shadow-none transition-all duration-300 hover:-translate-y-1">
              <div className="absolute right-0 top-0 w-32 h-32 bg-amber-500/10 dark:bg-amber-500/5 rounded-bl-full pointer-events-none" />
              <h4 className="text-sm font-bold text-amber-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                <Smile className="w-4 h-4" /> Tone & Behavior
              </h4>
              <p className="text-lg md:text-xl font-medium text-slate-800 dark:text-slate-200 leading-relaxed mb-4">
                "{feedbackObj.toneAnalysis || 'No tone detected.'}"
              </p>
            </div>

            {/* Summary Card */}
            <div className="premium-card relative bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-xl shadow-slate-200/40 dark:shadow-none transition-all duration-300 hover:-translate-y-1">
              <div className="absolute right-0 bottom-0 w-40 h-40 bg-blue-500/10 dark:bg-blue-500/5 rounded-tl-full pointer-events-none" />
              <h4 className="text-sm font-bold text-blue-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                <FileText className="w-4 h-4" /> Executive Summary
              </h4>
              <p className="text-base text-slate-600 dark:text-slate-300 leading-relaxed space-y-4 whitespace-pre-line">
                {feedbackObj.summary || 'Summary not available.'}
              </p>
              
              {/* Divider */}
              <hr className="my-6 border-slate-200 dark:border-slate-800" />
              
              <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-5 border border-slate-100 dark:border-slate-800">
                <h4 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-2">
                  Recommendation Message
                </h4>
                <p className="text-slate-800 dark:text-slate-200 font-medium">
                  {feedbackObj.RecommendationMsg || 'No recommendation message provided.'}
                </p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
