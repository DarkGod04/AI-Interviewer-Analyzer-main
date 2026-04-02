import React from 'react'
import { Video, Phone, ArrowRight, Sparkles, Lock } from 'lucide-react';
import Link from 'next/link';

function CreateOptions() {
  return (
    <div className='grid grid-cols-1 md:grid-cols-2 gap-5 mt-5'>

      {/* ── Create Interview Card ── */}
      <Link href="/dashboard/create-interview" className="group h-full">
        <div className='relative h-full rounded-2xl overflow-hidden transition-all duration-500 hover:-translate-y-1.5 cursor-pointer bg-gradient-to-br from-primary to-violet-600 border-none'
          style={{
            boxShadow: '0 8px 32px rgba(99,102,241,0.3)',
          }}
        >
          {/* Shine layer */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-0 w-[40%] h-full bg-gradient-to-r from-transparent via-white/15 to-transparent -skew-x-12"
              style={{ left: '-100%', animation: 'shine 4s ease-in-out infinite' }} />
          </div>

          {/* Decorative circles */}
          <div className="absolute -top-12 -right-12 w-40 h-40 rounded-full bg-white/8" />
          <div className="absolute -bottom-8 -left-8 w-32 h-32 rounded-full bg-white/5" />

          <div className="relative z-10 p-7 flex flex-col h-full">
            {/* Badge */}
            <div className="inline-flex items-center gap-1.5 mb-5 px-3 py-1 bg-white/15 border border-white/25 rounded-full w-fit backdrop-blur-sm">
              <Sparkles className="w-3 h-3 text-white" />
              <span className="text-[11px] font-bold text-white uppercase tracking-widest">AI Powered</span>
            </div>

            {/* Icon */}
            <div className="mb-5 w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm group-hover:scale-110 transition-transform duration-300 shadow-lg">
              <Video className="h-7 w-7 text-white" />
            </div>

            <div className="mt-auto">
              <h2 className="text-2xl font-extrabold text-white tracking-tight mb-1.5">
                Create Interview
              </h2>
              <p className="text-white/75 text-sm leading-relaxed font-medium">
                Launch a fully automated AI video interview and seamlessly evaluate candidates in real time.
              </p>
              <div className="mt-5 inline-flex items-center gap-2 text-white font-semibold text-sm group-hover:gap-3 transition-all duration-300">
                Get Started <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          </div>
        </div>
      </Link>

      {/* ── Phone Screening Card (Coming Soon) ── */}
      <div className="group h-full">
        <div className='relative h-full rounded-2xl overflow-hidden transition-all duration-500 border-2 border-dashed border-slate-300 bg-slate-50/50 backdrop-blur-sm hover:border-slate-400'>
          {/* Decorative circles */}
          <div className="absolute -top-12 -right-12 w-40 h-40 rounded-full bg-slate-100" />
          <div className="absolute -bottom-8 -left-8  w-32 h-32 rounded-full bg-slate-50" />

          <div className="relative z-10 p-7 flex flex-col h-full">
            {/* Badge */}
            <div className="inline-flex items-center gap-1.5 mb-5 px-3 py-1 bg-amber-50 border border-amber-200 rounded-full w-fit">
              <Lock className="w-3 h-3 text-amber-500" />
              <span className="text-[11px] font-bold text-amber-600 uppercase tracking-widest">Coming Soon</span>
            </div>

            {/* Icon */}
            <div className="mb-5 w-14 h-14 bg-slate-200/60 rounded-2xl flex items-center justify-center shadow-sm">
              <Phone className="h-7 w-7 text-slate-400" />
            </div>

            <div className="mt-auto">
              <h2 className="text-2xl font-extrabold text-slate-600 tracking-tight mb-1.5">
                Phone Screening
              </h2>
              <p className="text-slate-400 text-sm leading-relaxed font-medium">
                Schedule automated AI-powered phone screening calls to filter candidates at scale.
              </p>
              <div className="mt-5 inline-flex items-center gap-2 text-slate-400 font-semibold text-sm">
                Notify Me <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  )
}

export default CreateOptions