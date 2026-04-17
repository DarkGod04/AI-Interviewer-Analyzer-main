"use client"
import React, { useEffect, useState, useContext } from 'react'
import Image from 'next/image'
import { useRouter, useParams } from 'next/navigation'
import { Clock, Info, Video, Loader2Icon, Sparkles } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { supabase } from '@/services/supabaseClient'
import { toast } from 'sonner'
import { InterviewDataContext } from '@/context/InterviewDataContext'
import { useUser } from '@/app/provider'

function Interview() {
  const { interview_id } = useParams()
  const [interviewData, setInterviewData] = useState(null)
  const [userName, setUserName] = useState('')
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const { setInterviewInfo } = useContext(InterviewDataContext)
  const { user } = useUser()
  const router = useRouter()

  useEffect(() => {
    if (interview_id) {
      GetInterviewDetails()
    }
  }, [interview_id])

  useEffect(() => {
    if (user) {
      setUserName(user.name || '')
      setEmail(user.email || '')
    }
  }, [user])

  const GetInterviewDetails = async () => {
    setLoading(true)
    try {
      const { data: Interviews, error } = await supabase
        .from('Interviews')
        .select("jobPosition,jobDescription,duration,type")
        .eq("interview_id", interview_id)

      if (error) throw error

      if (!Interviews || Interviews.length === 0) {
        toast('❌ No interview found with this id')
        setInterviewData(null)
      } else {
        setInterviewData(Interviews[0])
      }
    } catch (error) {
      toast('Error fetching interview: ' + error.message)
      console.error("Error fetching interview details:", error)
    } finally {
      setLoading(false)
    }
  }

  const onJoinInterview = async () => {
    setLoading(true)
    try {
      const { data: Interviews, error } = await supabase
        .from('Interviews')
        .select("*")
        .eq("interview_id", interview_id)

      if (error || !Interviews || Interviews.length === 0) {
        toast('Something went wrong. Try again!')
        return
      }

      setInterviewInfo({
        userName: userName,
        userEmail: email,
        interviewData: Interviews[0],
      })

      router.push(`/interview/${interview_id}/start`)
    } catch (err) {
      console.error("Join error:", err);
      toast('Unable to join interview: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 md:p-10 relative overflow-hidden"
      style={{ background: 'radial-gradient(ellipse at 60% 20%, rgba(236,72,153,0.12) 0%, transparent 60%), radial-gradient(ellipse at 20% 80%, rgba(168,85,247,0.12) 0%, transparent 60%), #020617' }}>

      {/* Animated background orbs */}
      <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-pink-600/10 rounded-full blur-[80px] animate-pulse pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/4 w-48 h-48 bg-purple-600/10 rounded-full blur-[60px] animate-pulse pointer-events-none" style={{ animationDelay: '1.5s' }} />

      <div className="w-full max-w-2xl relative z-10">
        <div className="glass-card rounded-[1.75rem] p-8 md:p-12 relative overflow-hidden">

          {/* Top accent line */}
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-pink-500 to-transparent" />

          {/* Corner glow */}
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-pink-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col items-center text-center font-sans">
            {/* Logo */}
            <div className="mb-6 p-3 bg-slate-800/80 rounded-2xl shadow-[0_0_20px_rgba(236,72,153,0.15)] border border-pink-500/10">
              <Image src={'/veritas_logo.png'} alt='VeritasAI Logo' width={80} height={80} className="w-20 h-20 object-contain" />
            </div>

            <h1 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-300 mb-2">
              VeritasAI
            </h1>
            <p className="text-lg text-slate-500 font-medium mb-8">
              AI-Powered Interview Platform
            </p>

            {interviewData && (
              <div className="w-full bg-pink-500/5 border border-pink-500/15 rounded-xl p-6 mb-8">
                <h2 className="text-2xl font-bold text-white mb-2">
                  {interviewData.jobPosition}
                </h2>
                <div className="flex items-center justify-center gap-2 text-pink-400 font-medium">
                  <Clock className="w-4 h-4" />
                  <span>{interviewData.duration} Minutes</span>
                </div>
              </div>
            )}

            <div className="w-full space-y-6 text-left">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-300 ml-1">
                  Full Name
                </label>
                <Input
                  className="h-12 px-4 rounded-xl bg-slate-800/80 border-slate-700 text-white placeholder:text-slate-600 focus:ring-2 focus:ring-pink-500/30 focus:border-pink-500/50 transition-all"
                  placeholder="e.g. Nikhil Kumar Singh"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-300 ml-1">
                  Email Address
                </label>
                <Input
                  className="h-12 px-4 rounded-xl bg-slate-800/80 border-slate-700 text-white placeholder:text-slate-600 focus:ring-2 focus:ring-pink-500/30 focus:border-pink-500/50 transition-all"
                  placeholder="e.g. example@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              {/* Info notice */}
              <div className="bg-amber-500/5 border border-amber-500/15 rounded-xl p-4 flex gap-4 items-start">
                <Info className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <h3 className="font-semibold text-amber-300 text-sm">
                    Before you begin
                  </h3>
                  <ul className="text-sm text-amber-500/80 space-y-1 list-disc list-inside">
                    <li>Check your camera and microphone permissions</li>
                    <li>Ensure a stable internet connection</li>
                    <li>Find a quiet environment</li>
                  </ul>
                </div>
              </div>

              <Button
                className="w-full h-14 text-lg font-bold rounded-xl border-0 text-white shadow-[0_4px_20px_rgba(236,72,153,0.4)] hover:shadow-[0_6px_30px_rgba(236,72,153,0.5)] hover:-translate-y-0.5 active:scale-[0.98] transition-all"
                style={{ background: 'linear-gradient(135deg, #ec4899, #d946ef, #a855f7)' }}
                disabled={loading || !userName.trim() || !email.trim()}
                onClick={onJoinInterview}
              >
                {loading ? (
                  <Loader2Icon className="w-6 h-6 animate-spin" />
                ) : (
                  <>
                    <Video className="w-5 h-5 mr-2" />
                    Join Interview
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>

        <p className="text-center text-slate-600 text-sm mt-6">
          Powered by VeritasAI · <span className="text-pink-500">Neural Intelligence</span>
        </p>
      </div>
    </div>
  )
}

export default Interview
