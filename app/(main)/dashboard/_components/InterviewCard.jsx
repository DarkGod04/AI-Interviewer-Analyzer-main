"use client"
import React from 'react'
import moment from 'moment';
import { Button } from "@/components/ui/button";
import { Copy, Share2, ArrowRight, Calendar, Clock, Users, ChevronRight } from "lucide-react"
import { toast } from "sonner";
import Link from "next/link"

function InterviewCard({ Interviews, viewDetail = false }) {
  const url = process.env.NEXT_PUBLIC_BASE_URL + '/' + Interviews?.interview_id;

  const onCopyLink = async () => {
    await navigator.clipboard.writeText(url);
    toast("🔗 Link copied to clipboard!");
  }

  const handleShare = async () => {
    const shareData = {
      title: 'Interview Invite',
      text: 'Join this interview using the link below:',
      url,
    };
    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.error("Share failed:", err);
      }
    } else {
      await navigator.clipboard.writeText(url);
      toast("🔗 Link copied (sharing not supported)");
    }
  };

  const initials = Interviews?.jobPosition?.substring(0, 2).toUpperCase() || "AI";
  const responseCount = Interviews['interview-feedback']?.length || 0;

  return (
    <div className="premium-card group relative flex flex-col h-full rounded-2xl overflow-hidden transition-all duration-400 hover:-translate-y-1.5"
    >
      {/* Gradient border glow on hover */}
      <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-400 pointer-events-none"
        style={{
          background: 'linear-gradient(135deg, rgba(99,102,241,0.08) 0%, rgba(139,92,246,0.05) 100%)',
          border: '1px solid rgba(99,102,241,0.2)',
        }}
      />

      {/* Top accent bar */}
      <div className="h-1 w-full bg-gradient-to-r from-primary via-violet-500 to-fuchsia-400 opacity-0 group-hover:opacity-100 transition-opacity duration-400" />

      <div className="relative z-10 p-6 flex flex-col flex-1">
        {/* Header row */}
        <div className="flex items-start justify-between mb-4">
          {/* Avatar initials */}
          <div className="relative">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-white font-extrabold text-sm tracking-tight shadow-md"
              style={{ background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)' }}
            >
              {initials}
            </div>
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-400 rounded-full border-2 border-white" title="Active" />
          </div>

          {/* Date badge */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 border border-slate-200/80 rounded-xl">
            <Calendar className="w-3 h-3 text-slate-400" />
            <span className="text-xs font-semibold text-slate-500">
              {moment(Interviews?.created_at).format('MMM D, YY')}
            </span>
          </div>
        </div>

        {/* Job title */}
        <h2 className="font-extrabold text-lg tracking-tight text-slate-800 line-clamp-1 group-hover:text-primary transition-colors duration-300 mb-3">
          {Interviews.jobPosition}
        </h2>

        {/* Stats row */}
        <div className="flex items-center gap-3 mb-4">
          <div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-50 border border-slate-100 rounded-lg">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-xs font-semibold text-slate-600">{Interviews?.duration} min</span>
          </div>
          <div className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border ${responseCount > 0 ? 'bg-emerald-50 border-emerald-100' : 'bg-slate-50 border-slate-100'}`}>
            <Users className={`w-3.5 h-3.5 ${responseCount > 0 ? 'text-emerald-500' : 'text-slate-400'}`} />
            <span className={`text-xs font-bold ${responseCount > 0 ? 'text-emerald-600' : 'text-slate-500'}`}>
              {responseCount} {responseCount === 1 ? 'response' : 'responses'}
            </span>
          </div>
        </div>

        {/* Divider */}
        <div className="mt-auto pt-4 border-t border-slate-100">
          {!viewDetail ? (
            <div className="flex items-center justify-between gap-2">
              <div className="flex gap-2">
                <button
                  onClick={onCopyLink}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-600 bg-slate-50 border border-slate-200 hover:bg-slate-100 hover:border-slate-300 transition-all duration-200"
                >
                  <Copy className="w-3.5 h-3.5" /> Copy
                </button>
                <button
                  onClick={handleShare}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-600 bg-slate-50 border border-slate-200 hover:bg-slate-100 hover:border-slate-300 transition-all duration-200"
                >
                  <Share2 className="w-3.5 h-3.5" /> Send
                </button>
              </div>

              <Link href={'/interview/' + Interviews?.interview_id}>
                <button className="btn-glow flex items-center gap-1.5 text-xs py-2 px-4 shadow-sm">
                  Start <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </Link>
            </div>
          ) : (
            <Link href={'/dashboard/interview/' + Interviews?.interview_id + "/feedback"} className="block">
              <button className="w-full flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white transition-all duration-300 hover:shadow-lg hover:shadow-slate-900/40 hover:-translate-y-0.5 bg-slate-800 hover:bg-slate-900">
                <ArrowRight className="w-4 h-4" /> View Feedback
              </button>
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}

export default InterviewCard