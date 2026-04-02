import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from "sonner"
import { Copy, Clock, List, Share2, Mail, Slack, MessageCircleMore, ArrowLeft, Plus } from "lucide-react"
function InterviewLink({ interview_id, formData }) {
  const url = process.env.NEXT_PUBLIC_BASE_URL + '/interview/' + interview_id;
  //or Interviews.interview_id
  const GetIntervireUrl = () => {
    return url;
  }

  const handleShare = async () => {
    const url = GetIntervireUrl();
    const shareData = {
      title: 'Interview Invite',
      text: 'Join this interview using the link below:',
      url,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
        console.log("Shared successfully!");
      } catch (err) {
        console.error("Share failed:", err);
      }
    } else {
      // fallback if Web Share API is not supported
      alert("Sharing is not supported in this browser.");
    }
  };

  const onCopyLink = async () => {
    await navigator.clipboard.writeText(url);
    toast("🔗 Link copied to clipboard!");
  }


  return (
    <div className="flex flex-col items-center justify-center mt-12 animate-in fade-in zoom-in duration-500">
      <div className="w-24 h-24 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(16,185,129,0.2)]">
        <Image src={'/check.webp'} alt='check' height={200} width={200}
          className="w-12 h-12 object-contain" />
      </div>

      <h2 className="font-extrabold text-3xl tracking-tight text-slate-800 dark:text-white text-center">
        Your AI Interview is <span className="italic font-caramel text-4xl bg-clip-text text-transparent bg-gradient-to-r from-primary to-violet-500 pt-2 px-1">Ready!!</span>
      </h2>
      <p className="mt-3 text-slate-500 dark:text-slate-400 font-medium text-center">
        Share this secure link with your candidates to begin the evaluation process
      </p>

      <div className="w-full xl:w-3/4 glass-card p-8 mt-10 rounded-3xl relative overflow-hidden flex flex-col">
        {/* Shine effect */}
        <div className="absolute top-0 left-[-100%] w-[50%] h-full bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-[-20deg] group-hover:animate-shine pointer-events-none"></div>

        <div className="flex justify-between items-center mb-6">
          <h2 className="font-bold text-slate-700 dark:text-slate-300 text-lg">Interview Gateway</h2>
          <span className="text-xs font-bold tracking-widest uppercase text-primary bg-primary/10 px-3 py-1.5 rounded-full border border-primary/20">
            Valid for 30 Days
          </span>
        </div>

        <div className="flex items-center gap-3">
          <Input 
            className="h-12 bg-white/50 dark:bg-slate-900/50 border-white/20 dark:border-white/10 ring-1 ring-slate-200 dark:ring-slate-800 shadow-inner font-medium text-slate-600 dark:text-slate-300" 
            defaultValue={GetIntervireUrl()} 
            readOnly 
          />
          <Button onClick={() => onCopyLink()} className="h-12 px-6 bg-slate-900 hover:bg-slate-800 text-white shadow-md rounded-xl transition-all active:scale-95">
            <Copy className="w-4 h-4 mr-2" /> Copy
          </Button>
        </div>

        <div className="h-px w-full bg-slate-200 dark:bg-slate-800 my-8"></div>

        <div className="flex flex-wrap justify-between gap-5 items-center bg-slate-50/50 dark:bg-slate-900/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-6">
            <div className="flex items-center text-sm font-semibold text-slate-600 dark:text-slate-400">
              <Clock className="w-4 h-4 mr-2 text-primary" />
              {formData?.duration} Min
            </div>
            <div className="flex items-center text-sm font-semibold text-slate-600 dark:text-slate-400">
              <List className="w-4 h-4 mr-2 text-violet-500" />
              10 Questions
            </div>
          </div>

          <Button
            onClick={handleShare}
            className="bg-gradient-to-r from-primary to-indigo-500 hover:from-primary/90 hover:to-indigo-500/90 text-white shadow-lg shadow-primary/20 rounded-xl px-6"
          >
            <Share2 className="w-4 h-4 mr-2" /> Share Invite
          </Button>
        </div>
      </div>

      <div className="mt-8 w-full xl:w-3/4 flex flex-col items-center">
        <p className="text-xs font-bold tracking-widest text-slate-400 uppercase mb-4">Or share via</p>
        <div className="flex justify-center gap-4 flex-wrap">
          <Button onClick={handleShare} variant="outline" className="h-12 px-6 rounded-xl bg-white hover:bg-slate-50 border-slate-200 text-slate-600 shadow-sm transition-all hover:-translate-y-0.5"><Slack className="w-4 h-4 mr-2 text-[#4A154B]" /> Slack</Button>
          <Button onClick={handleShare} variant="outline" className="h-12 px-6 rounded-xl bg-white hover:bg-slate-50 border-slate-200 text-slate-600 shadow-sm transition-all hover:-translate-y-0.5"><Mail className="w-4 h-4 mr-2 text-red-500" /> Email</Button>
          <Button onClick={handleShare} variant="outline" className="h-12 px-6 rounded-xl bg-white hover:bg-slate-50 border-slate-200 text-slate-600 shadow-sm transition-all hover:-translate-y-0.5"><MessageCircleMore className="w-4 h-4 mr-2 text-green-500" /> WhatsApp</Button>
        </div>
      </div>

      <div className="flex justify-between w-full xl:w-3/4 mt-12 pt-8 border-t border-slate-200/50 dark:border-slate-800/50">
        <Link href={'/dashboard'}>
          <Button variant="ghost" className="text-slate-500 hover:text-slate-800 hover:bg-slate-100">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Dashboard
          </Button>
        </Link>
        <Link href={'/dashboard/create-interview'}>
          <Button className="bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-white hover:bg-slate-200 dark:hover:bg-slate-700 shadow-sm border-0">
            <Plus className="w-4 h-4 mr-2" /> Create Another
          </Button>
        </Link>
      </div>
    </div>
  )
}

export default InterviewLink