"use client"
import React, { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { supabase } from '@/services/supabaseClient'
import { 
  ArrowLeft, Brain, MessageSquare, Target, Briefcase, 
  Smile, ShieldCheck, ShieldAlert, Award, ChevronRight, FileText, Activity, CheckCircle2, XCircle, TrendingUp
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import moment from 'moment'

export default function CandidateFeedbackPage() {
  const { interview_id, attempt_id } = useParams()
  const router = useRouter()
  
  const [feedbackRecord, setFeedbackRecord] = useState(null)
  const [interviewRecord, setInterviewRecord] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (attempt_id && interview_id) {
      GetFeedbackDetails()
    }
  }, [attempt_id, interview_id])

  const GetFeedbackDetails = async () => {
    setLoading(true)
    try {
      // Fetch the base interview details for context (job role etc.)
      const { data: interviewData, error: interviewError } = await supabase
        .from('Interviews')
        .select('*')
        .eq('interview_id', interview_id)

      if (interviewError) throw interviewError
      if (interviewData?.length > 0) {
        setInterviewRecord(interviewData[0])
      }

      // Fetch the specific candidate attempt
      const { data: attemptData, error: attemptError } = await supabase
        .from('InterviewAttempts')
        .select('*')
        .eq('id', attempt_id)

      if (attemptError) throw attemptError
      
      if (attemptData?.length > 0) {
        setFeedbackRecord(attemptData[0])
      }
    } catch (err) {
      console.error("Error loading feedback:", err)
      toast.error('Failed to load feedback details')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="h-[80vh] flex flex-col items-center justify-center space-y-6">
        <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
        <p className="text-slate-500 font-medium">Analyzing AI Feedback...</p>
      </div>
    )
  }

  if (!feedbackRecord) {
    return (
      <div className="h-[80vh] flex flex-col items-center justify-center p-6 text-center space-y-6">
        <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center">
          <ShieldAlert className="w-12 h-12 text-slate-400" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">No Feedback Found</h2>
          <p className="text-slate-500 max-w-md mx-auto">This candidate attempt does not exist or has been deleted.</p>
        </div>
        <Button onClick={() => router.back()} className="mt-4 gap-2">
          <ArrowLeft className="w-4 h-4" /> Go Back
        </Button>
      </div>
    )
  }

  const parsed = feedbackRecord.feedback || {}
  const feedbackObj = parsed.feedback || parsed
  const ratings = feedbackObj.rating || {}
  
  const techScore = ratings.technicalSkills || 0
  const commScore = ratings.communication || 0
  const probScore = ratings.problemSolving || 0
  const expScore = ratings.experience || 0
  const toneScore = ratings.tone || 0
  
  const isRecommended = feedbackObj.Recommendation?.toLowerCase().includes("yes") || false
  const strengths = feedbackObj.strengths || []
  const weaknesses = feedbackObj.weaknesses || []
  const improvements = feedbackObj.improvements || []

  const metricCards = [
    { label: "Technical Skills", score: techScore, icon: Brain, color: "from-blue-500 to-cyan-500", bg: "bg-blue-50" },
    { label: "Communication", score: commScore, icon: MessageSquare, color: "from-violet-500 to-purple-500", bg: "bg-violet-50" },
    { label: "Problem Solving", score: probScore, icon: Target, color: "from-amber-500 to-orange-500", bg: "bg-amber-50" },
    { label: "Experience Match", score: expScore, icon: Briefcase, color: "from-emerald-500 to-teal-500", bg: "bg-emerald-50" },
    { label: "Professional Tone", score: toneScore, icon: Smile, color: "from-pink-500 to-rose-500", bg: "bg-pink-50" },
  ]

  const averageScore = ((techScore + commScore + probScore + expScore + toneScore) / 5).toFixed(1)

  return (
    <div className="min-h-screen p-4 md:p-8 space-y-8">
      {/* Background Orbs */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-violet-500/10 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-blue-500/10 blur-[120px]" />
      </div>

      {/* Header / Nav */}
      <div className="flex items-center gap-4">
        <button 
          onClick={() => router.back()} 
          className="p-2.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 transition shadow-sm"
        >
          <ArrowLeft className="w-5 h-5 text-slate-600" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Candidate Evaluation</h1>
          <p className="text-sm text-slate-500 font-medium flex items-center gap-2">
            Candidates <ChevronRight className="w-3 h-3" /> Report
          </p>
        </div>
      </div>

      {/* Hero Card */}
      <div className="relative overflow-hidden bg-white/80 backdrop-blur-xl border border-slate-200 rounded-[2rem] p-8 shadow-2xl shadow-indigo-500/5">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-[80px]" />
        
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-600 text-sm font-bold border border-indigo-100">
              <Award className="w-4 h-4" /> Final Assessment
            </div>
            
            <div>
              <h2 className="text-3xl font-extrabold text-slate-900 mb-2">
                {feedbackRecord.candidateName || "Candidate"}
                <span className="ml-3 text-lg font-normal text-slate-500">({feedbackRecord.candidateEmail})</span>
              </h2>
              <div className="flex flex-wrap items-center gap-4 text-slate-500 font-medium text-sm">
                <span className="flex items-center gap-1.5"><Briefcase className="w-4 h-4" /> {interviewRecord?.jobPosition || "N/A"}</span>
                <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                <span className="flex items-center gap-1.5"><FileText className="w-4 h-4" /> {interviewRecord?.type || "General"}</span>
                <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                <span>{moment(feedbackRecord.created_at).format("MMMM Do, YYYY")}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center md:items-end gap-3">
            <div className={`flex items-center gap-2 px-6 py-3 rounded-2xl border-2 font-bold text-lg shadow-lg ${isRecommended ? 'bg-emerald-50 border-emerald-200 text-emerald-700 shadow-emerald-500/20' : 'bg-red-50 border-red-200 text-red-700 shadow-red-500/20'}`}>
              {isRecommended ? <ShieldCheck className="w-6 h-6" /> : <ShieldAlert className="w-6 h-6" />}
              {isRecommended ? 'Recommended to Hire' : 'Not Recommended'}
            </div>
            
            <div className="flex items-end gap-1">
              <span className="text-4xl font-black bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600">{averageScore}</span>
              <span className="text-slate-500 font-medium mb-1">/ 10 Overall Score</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Metrics Metrics */}
        <div className="lg:col-span-1 space-y-6">
          <h3 className="text-xl font-bold flex items-center gap-2 text-slate-800">
            <Activity className="w-5 h-5 text-indigo-500" /> Scoring Metrics
          </h3>
          
          <div className="flex flex-col gap-4">
            {metricCards.map((metric, idx) => (
              <div key={idx} className={`p-5 rounded-2xl border border-slate-100 bg-white/60 backdrop-blur-md shadow-sm transition-all duration-300`}>
                <div className="flex justify-between items-center mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-xl ${metric.bg}`}>
                      <metric.icon className={`w-5 h-5 text-transparent bg-clip-text bg-gradient-to-br ${metric.color}`} />
                    </div>
                    <span className="font-semibold text-slate-700">{metric.label}</span>
                  </div>
                  <span className="font-bold text-slate-900">{metric.score} <span className="text-slate-400 text-sm">/ 10</span></span>
                </div>
                
                <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    style={{ width: `${(metric.score / 10) * 100}%` }}
                    className={`h-full bg-gradient-to-r ${metric.color} rounded-full`}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: AI Analysis */}
        <div className="lg:col-span-2 space-y-6">
          <h3 className="text-xl font-bold flex items-center gap-2 text-slate-800">
            <Brain className="w-5 h-5 text-violet-500" /> Executive Analysis
          </h3>
          
          <div className="relative bg-white/70 backdrop-blur-xl border border-slate-200 rounded-3xl p-8 shadow-xl shadow-slate-200/40">
            <div className="absolute right-0 bottom-0 w-40 h-40 bg-blue-500/10 rounded-tl-full pointer-events-none" />
            <p className="text-lg text-slate-700 leading-relaxed font-medium">
              "{feedbackObj.summary || 'Summary not available.'}"
            </p>
            <div className="mt-6 bg-slate-50 rounded-2xl p-5 border border-slate-100 flex items-start gap-3">
              {isRecommended ? <ShieldCheck className="w-5 h-5 text-emerald-500 mt-0.5" /> : <ShieldAlert className="w-5 h-5 text-red-500 mt-0.5" />}
              <div>
                <h4 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-1">
                  Final Recommendation Notes
                </h4>
                <p className="text-slate-800 font-medium text-sm">
                  {feedbackObj.RecommendationMsg || 'No recommendation message provided.'}
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-emerald-50/50 border border-emerald-100 rounded-3xl p-6">
              <h4 className="text-emerald-600 font-bold mb-4 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5" /> Key Strengths
              </h4>
              <ul className="space-y-3">
                {strengths.map((s, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
                    <span className="text-emerald-500 mt-0.5">•</span><span>{s}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-rose-50/50 border border-rose-100 rounded-3xl p-6">
              <h4 className="text-rose-600 font-bold mb-4 flex items-center gap-2">
                <XCircle className="w-5 h-5" /> Areas for Improvement
              </h4>
              <ul className="space-y-3">
                {weaknesses.map((w, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
                    <span className="text-rose-500 mt-0.5">•</span><span>{w}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {improvements.length > 0 && (
            <div className="bg-blue-50/50 border border-blue-100 rounded-3xl p-6">
              <h4 className="text-blue-600 font-bold mb-4 flex items-center gap-2 relative z-10">
                <TrendingUp className="w-5 h-5" /> Growth Action Plan
              </h4>
              <div className="space-y-4">
                {improvements.map((imp, i) => (
                  <div key={i} className="flex gap-4 items-center bg-white rounded-xl p-4 shadow-sm border border-slate-100">
                    <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm shrink-0">
                      {i + 1}
                    </div>
                    <p className="text-sm text-slate-700 font-medium">{imp}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}
