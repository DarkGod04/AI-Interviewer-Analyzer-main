"use client"
import React, { useEffect, useState, useContext } from 'react'
import Image from 'next/image'
import { useRouter, useParams } from 'next/navigation'
import { Clock, Info, Video, Loader2Icon } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { supabase } from '@/services/supabaseClient'
import { toast } from 'sonner'
import { InterviewDataContext } from '@/context/InterviewDataContext'

function Interview() {
  const { interview_id } = useParams()
  const [interviewData, setInterviewData] = useState(null)
  const [userName, setUserName] = useState('')
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const { setInterviewInfo } = useContext(InterviewDataContext)
  const router = useRouter()

  useEffect(() => {
    if (interview_id) {
      GetInterviewDetails()
    }
  }, [interview_id])

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
    <div className="min-h-screen flex items-center justify-center p-4 md:p-10 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800">
      <div className="w-full max-w-2xl animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border border-white/20 shadow-2xl rounded-2xl p-8 md:p-12 relative overflow-hidden">

          {/* Decorative background elements */}
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500" />
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl" />

          <div className="relative z-10 flex flex-col items-center text-center font-sans">
            <div className="mb-6 p-3 bg-white dark:bg-gray-800 rounded-2xl shadow-lg shadow-blue-500/10">
              <Image src={'/veritas_logo.png'} alt='VeritasAI Logo' width={80} height={80} className="w-20 h-20 object-contain" />
            </div>

            <h1 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 mb-2">
              VeritasAI
            </h1>
            <p className="text-lg text-gray-500 dark:text-gray-400 font-medium mb-8">
              AI-Powered Interview Platform
            </p>

            {interviewData && (
              <div className="w-full bg-blue-50/50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-xl p-6 mb-8 animate-in zoom-in-95 duration-500 delay-150">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2">
                  {interviewData.jobPosition}
                </h2>
                <div className="flex items-center justify-center gap-2 text-blue-600 dark:text-blue-400 font-medium">
                  <Clock className="w-4 h-4" />
                  <span>{interviewData.duration} Minutes</span>
                </div>
              </div>
            )}

            <div className="w-full space-y-6 text-left">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 ml-1">
                  Full Name
                </label>
                <Input
                  className="h-12 px-4 rounded-xl bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                  placeholder="e.g. Nikhil Kumar Singh"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 ml-1">
                  Email Address
                </label>
                <Input
                  className="h-12 px-4 rounded-xl bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                  placeholder="e.g. example@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-800/50 rounded-xl p-4 flex gap-4 items-start">
                <Info className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <h3 className="font-semibold text-amber-800 dark:text-amber-300 text-sm">
                    Before you begin
                  </h3>
                  <ul className="text-sm text-amber-700 dark:text-amber-400 space-y-1 list-disc list-inside">
                    <li>Check your camera and microphone permissions</li>
                    <li>Ensure a stable internet connection</li>
                    <li>Find a quiet environment</li>
                  </ul>
                </div>
              </div>

              <Button
                className="w-full h-14 text-lg font-bold rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg shadow-blue-500/25 transition-all hover:scale-[1.02] active:scale-[0.98]"
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

        <p className="text-center text-gray-400 text-sm mt-6">
          Powered by VeritasAI
        </p>
      </div>
    </div>
  )
}

export default Interview
