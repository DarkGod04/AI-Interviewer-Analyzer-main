"use client"
import React, { useEffect, useState } from 'react'
import { useUser } from '@/app/provider'
import { supabase } from '@/services/supabaseClient'
import { Activity, Target, Brain, MessageSquare, Briefcase, Smile, Calendar, ExternalLink, ShieldAlert, Award, TrendingUp } from 'lucide-react'
import { motion } from 'framer-motion'
import moment from 'moment'
import Link from 'next/link'
import { toast } from 'sonner'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, AreaChart, Area, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts'

export default function PerformanceDashboard() {
  const { user } = useUser()
  const [attempts, setAttempts] = useState([])
  const [interviews, setInterviews] = useState({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user?.email) {
      GetMyPerformance()
    }
  }, [user])

  const GetMyPerformance = async () => {
    setLoading(true)
    try {
      const { data: myAttempts, error: attemptsError } = await supabase
        .from('InterviewAttempts')
        .select('*')
        .eq('candidateemail', user?.email)
        .order('created_at', { ascending: false })

      if (attemptsError) throw attemptsError

      if (myAttempts && myAttempts.length > 0) {
        setAttempts(myAttempts)
        const uniqueInterviewIds = [...new Set(myAttempts.map(a => a.interview_id))]

        const { data: relatedInterviews, error: interviewsError } = await supabase
          .from('Interviews')
          .select('interview_id, jobPosition, type')
          .in('interview_id', uniqueInterviewIds)

        if (!interviewsError && relatedInterviews) {
          const map = {}
          relatedInterviews.forEach(i => {
            map[i.interview_id] = i
          })
          setInterviews(map)
        }
      }
    } catch (err) {
      console.error("Failed to load performance:", err)
      toast?.error(err?.message || "Failed to load attempts")
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="h-[80vh] flex flex-col items-center justify-center space-y-6">
        <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
        <p className="text-slate-500 font-medium">Aggregating your elite metrics...</p>
      </div>
    )
  }

  if (attempts.length === 0) {
    return (
      <div className="min-h-screen p-6 md:p-10 relative mt-8">
        <div className="h-[50vh] flex flex-col items-center justify-center p-6 text-center glass-card rounded-[2rem] border border-slate-200">
          <div className="w-24 h-24 bg-indigo-50 rounded-full flex items-center justify-center mb-6">
            <ShieldAlert className="w-12 h-12 text-indigo-400" />
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">No Analytics Available</h2>
          <p className="text-slate-500 max-w-md mx-auto">
            When you complete an AI interview, your visual performance dashboard will generate heavily detailed metrics here.
          </p>
        </div>
      </div>
    )
  }

  // Calculate Aggregates
  let avgTotal = 0, avgTech = 0, avgComm = 0, avgProb = 0, avgExp = 0, avgTone = 0
  
  attempts.forEach(a => {
    const fb = a.feedback?.feedback || a.feedback || {}
    const r = fb.rating || {}
    const score = ((r.technicalSkills || 0) + (r.communication || 0) + (r.problemSolving || 0) + (r.experience || 0) + (r.tone || 0)) / 5
    avgTotal += score
    avgTech += (r.technicalSkills || 0)
    avgComm += (r.communication || 0)
    avgProb += (r.problemSolving || 0)
    avgExp += (r.experience || 0)
    avgTone += (r.tone || 0)
  })

  avgTotal = (avgTotal / attempts.length).toFixed(1)
  avgTech = (avgTech / attempts.length).toFixed(1)
  avgComm = (avgComm / attempts.length).toFixed(1)
  avgProb = (avgProb / attempts.length).toFixed(1)
  avgExp = (avgExp / attempts.length).toFixed(1)
  avgTone = (avgTone / attempts.length).toFixed(1)

  // Chart Data Preparation (Reverse for chronological order)
  const timelineData = [...attempts].reverse().map(a => {
    const fb = a.feedback?.feedback || a.feedback || {}
    const r = fb.rating || {}
    return {
      date: moment(a.created_at).format('MMM Do'),
      Overall: ((r.technicalSkills || 0) + (r.communication || 0) + (r.problemSolving || 0) + (r.experience || 0) + (r.tone || 0)) / 5,
      Technical: r.technicalSkills || 0,
      Communication: r.communication || 0
    }
  })

  const radarData = [
    { subject: 'Technical Depth', A: parseFloat(avgTech), fullMark: 10 },
    { subject: 'Communication', A: parseFloat(avgComm), fullMark: 10 },
    { subject: 'Problem Solving', A: parseFloat(avgProb), fullMark: 10 },
    { subject: 'Experience', A: parseFloat(avgExp), fullMark: 10 },
    { subject: 'Tone / Soft Skills', A: parseFloat(avgTone), fullMark: 10 }
  ]

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900 border border-slate-700/50 p-4 rounded-2xl shadow-xl text-white">
          <p className="text-sm font-semibold text-slate-300 mb-2">{label}</p>
          {payload.map((entry, index) => (
            <div key={index} className="flex items-center gap-2 text-sm font-bold mt-1">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
              <span className="text-slate-400">{entry.name}:</span>
              <span>{entry.value.toFixed(1)}</span>
            </div>
          ))}
        </div>
      )
    }
    return null
  }

  return (
    <div className="min-h-screen relative mt-8 pb-10">
      {/* Heavy God-Tier Backglow */}
      <div className="fixed top-0 right-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] pointer-events-none -z-10" />
      <div className="fixed bottom-0 left-0 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none -z-10" />

      {/* Header Container */}
      <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6 px-2">
        <div>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest mb-6 bg-gradient-to-r from-primary/10 to-violet-500/10 border border-primary/20 text-primary shadow-sm"
          >
            <TrendingUp className="h-4 w-4" /> Live Analytics
          </motion.div>
          <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tight leading-tight">
             Visual <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-indigo-600">Analytics</span>
          </h1>
          <p className="text-lg text-slate-500 font-medium mt-3">High-fidelity mapping of your neurological communication matrices.</p>
        </div>
        <div className="text-right">
           <div className="inline-flex items-center gap-3 px-6 py-4 rounded-[1.5rem] bg-slate-900 text-white shadow-2xl border border-slate-700">
               <Award className="w-8 h-8 text-amber-400" />
               <div className="text-left">
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Median Composite</p>
                  <p className="text-3xl font-black">{avgTotal} <span className="text-slate-500 text-lg">/ 10</span></p>
               </div>
           </div>
        </div>
      </div>

      <div className="space-y-8 px-2 md:px-0">
        
        {/* Prime Analytics Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Main Progression Line Chart */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="lg:col-span-2 premium-card bg-white/70 backdrop-blur-3xl border border-slate-200/60 rounded-[2rem] p-6 shadow-xl relative overflow-hidden">
             <div className="absolute top-0 right-0 p-8 w-1/2 h-full bg-gradient-to-l from-indigo-50/50 to-transparent pointer-events-none" />
             <div className="flex items-center justify-between mb-8">
                <div>
                   <h3 className="text-xl font-bold text-slate-800">Progression Trajectory</h3>
                   <p className="text-sm text-slate-500 font-medium">Timeline visualization of scoring matrices</p>
                </div>
             </div>
             
             <div className="h-[320px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={timelineData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorOverall" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorTech" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b', fontWeight: 600 }} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b', fontWeight: 600 }} domain={[0, 10]} />
                    <RechartsTooltip content={<CustomTooltip />} />
                    <Area type="monotone" dataKey="Overall" stroke="#6366f1" strokeWidth={4} fillOpacity={1} fill="url(#colorOverall)" activeDot={{ r: 8, strokeWidth: 0, fill: '#6366f1' }} />
                    <Area type="monotone" dataKey="Technical" stroke="#8b5cf6" strokeWidth={3} fillOpacity={1} fill="url(#colorTech)" />
                  </AreaChart>
                </ResponsiveContainer>
             </div>
          </motion.div>

          {/* Radar Skill Breakdown */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="premium-card bg-slate-900 border border-slate-800 rounded-[2rem] p-6 shadow-2xl relative overflow-hidden flex flex-col text-white">
             <div className="absolute top-0 right-0 w-64 h-64 bg-violet-600/20 blur-3xl rounded-full pointer-events-none" />
             <div className="mb-4 z-10">
                <h3 className="text-xl font-bold text-white">Skill Matrix Radar</h3>
                <p className="text-sm text-slate-400 font-medium">Competency volume distribution</p>
             </div>
             <div className="flex-1 min-h-[250px] z-10 w-full relative -ml-4">
                <ResponsiveContainer width="115%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                    <PolarGrid stroke="#334155" />
                    <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 700 }} />
                    <PolarRadiusAxis angle={30} domain={[0, 10]} tick={false} axisLine={false} />
                    <Radar name="Performance" dataKey="A" stroke="#8b5cf6" strokeWidth={3} fill="#8b5cf6" fillOpacity={0.4} />
                    <RechartsTooltip content={<CustomTooltip />} />
                  </RadarChart>
                </ResponsiveContainer>
             </div>
          </motion.div>
        </div>

        {/* Micro-Metrics Bar */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white/50 border border-emerald-200/50 rounded-2xl p-4 flex items-center justify-between shadow-sm">
                <div>
                   <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Problem Solving</p>
                   <p className="text-2xl font-black text-slate-800 mt-1">{avgProb}</p>
                </div>
                <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl"><Target className="w-5 h-5" /></div>
            </div>
            <div className="bg-white/50 border border-indigo-200/50 rounded-2xl p-4 flex items-center justify-between shadow-sm">
                <div>
                   <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Experience</p>
                   <p className="text-2xl font-black text-slate-800 mt-1">{avgExp}</p>
                </div>
                <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl"><Briefcase className="w-5 h-5" /></div>
            </div>
            <div className="bg-white/50 border border-amber-200/50 rounded-2xl p-4 flex items-center justify-between shadow-sm">
                <div>
                   <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Communication</p>
                   <p className="text-2xl font-black text-slate-800 mt-1">{avgComm}</p>
                </div>
                <div className="p-3 bg-amber-50 text-amber-600 rounded-xl"><MessageSquare className="w-5 h-5" /></div>
            </div>
            <div className="bg-white/50 border border-pink-200/50 rounded-2xl p-4 flex items-center justify-between shadow-sm">
                <div>
                   <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Tonal Delivery</p>
                   <p className="text-2xl font-black text-slate-800 mt-1">{avgTone}</p>
                </div>
                <div className="p-3 bg-pink-50 text-pink-600 rounded-xl"><Smile className="w-5 h-5" /></div>
            </div>
        </div>

        {/* Dense Raw History Block */}
        <div className="pt-6">
           <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Interview Ledger</h2>
           </div>
           
           <div className="space-y-4">
              {attempts.map((attempt) => {
                 const jobInfo = interviews[attempt.interview_id] || { jobPosition: "Architecture", type: "Unknown" }
                 const feedbackData = attempt.feedback?.feedback || attempt.feedback || {}
                 const isRecommended = feedbackData.Recommendation?.toLowerCase().includes("yes")
                 const ratings = feedbackData.rating || {}
                 const attemptScore = ((ratings.technicalSkills || 0) + (ratings.communication || 0) + (ratings.problemSolving || 0) + (ratings.experience || 0) + (ratings.tone || 0)) / 5

                 return (
                   <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} key={attempt.id} 
                    className="group flex flex-col md:flex-row items-center justify-between p-5 bg-white border border-slate-200 shadow-sm hover:shadow-xl rounded-[1.5rem] transition-all hover:border-indigo-300">
                      
                      <div className="flex items-center gap-5 w-full md:w-auto">
                        <div className="w-14 h-14 shrink-0 rounded-2xl bg-gradient-to-br from-indigo-50 to-violet-50 flex items-center justify-center border border-indigo-100">
                           <Award className="w-6 h-6 text-indigo-500" />
                        </div>
                        <div>
                           <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-extrabold text-lg text-slate-800 line-clamp-1">{jobInfo.jobPosition}</h4>
                              <span className={`px-2 py-0.5 text-[10px] whitespace-nowrap font-black uppercase tracking-wider rounded border \${isRecommended ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : 'bg-red-50 text-red-600 border-red-200'}`}>
                                 {isRecommended ? 'Advised' : 'Flagged'}
                              </span>
                           </div>
                           <p className="text-xs font-semibold text-slate-400 tracking-wide">{moment(attempt.created_at).format('MMM Do YYYY')}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-6 mt-4 md:mt-0 w-full md:w-auto justify-between md:justify-end">
                         <div className="text-right">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Composite Score</p>
                            <p className="text-xl font-black text-slate-800">{attemptScore.toFixed(1)}</p>
                         </div>
                         <Link href={`/dashboard/interview/${attempt.interview_id}/feedback/${attempt.id}`}>
                           <button className="flex items-center justify-center w-12 h-12 shrink-0 rounded-2xl bg-slate-50 text-slate-600 hover:bg-slate-900 hover:text-white transition-colors border border-slate-200">
                              <ExternalLink className="w-5 h-5" />
                           </button>
                         </Link>
                      </div>
                   </motion.div>
                 )
              })}
           </div>
        </div>

      </div>
    </div>
  )
}
