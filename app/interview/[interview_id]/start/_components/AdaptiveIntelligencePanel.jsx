'use client';
import React from 'react';
import { Brain, TrendingUp, Lightbulb, Target, Zap, ChevronRight, Loader2 } from 'lucide-react';

const DIFFICULTY_CONFIG = {
  Easy: {
    color: 'text-emerald-600',
    bg: 'bg-emerald-50',
    border: 'border-emerald-200',
    glow: 'shadow-emerald-100',
    bar: 'bg-emerald-400',
    barWidth: 'w-1/4',
    label: 'Easy',
  },
  Medium: {
    color: 'text-amber-600',
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    glow: 'shadow-amber-100',
    bar: 'bg-amber-400',
    barWidth: 'w-2/4',
    label: 'Medium',
  },
  Hard: {
    color: 'text-orange-600',
    bg: 'bg-orange-50',
    border: 'border-orange-200',
    glow: 'shadow-orange-100',
    bar: 'bg-orange-500',
    barWidth: 'w-3/4',
    label: 'Hard',
  },
  Expert: {
    color: 'text-red-600',
    bg: 'bg-red-50',
    border: 'border-red-200',
    glow: 'shadow-red-100',
    bar: 'bg-gradient-to-r from-red-500 to-purple-600',
    barWidth: 'w-full',
    label: 'Expert',
  },
};

export default function AdaptiveIntelligencePanel({
  difficultyLevel = 'Medium',
  topicProbed = null,
  suggestedFollowUp = null,
  reasoning = null,
  realtimeScores = [],
  isLoading = false,
}) {
  const cfg = DIFFICULTY_CONFIG[difficultyLevel] || DIFFICULTY_CONFIG.Medium;
  const avgScore =
    realtimeScores.length > 0
      ? (realtimeScores.reduce((a, b) => a + (b.score || 0), 0) / realtimeScores.length).toFixed(1)
      : null;

  return (
    <div className="w-full max-w-5xl mx-auto mt-6 px-4">
      <div className="bg-slate-900/95 backdrop-blur-xl border border-slate-700/60 rounded-[1.5rem] overflow-hidden shadow-2xl">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-violet-600/20 flex items-center justify-center">
              <Brain className="w-4 h-4 text-violet-400" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-slate-400">
                Adaptive Intelligence
              </p>
              <p className="text-[10px] text-slate-600 font-medium">
                Real-time interview analysis
              </p>
            </div>
          </div>
          {isLoading && (
            <Loader2 className="w-4 h-4 text-violet-400 animate-spin" />
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-0 divide-y md:divide-y-0 md:divide-x divide-slate-800">
          
          {/* Difficulty Meter */}
          <div className="p-5 flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <Zap className="w-3.5 h-3.5 text-slate-500" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                Difficulty
              </span>
            </div>
            <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border font-black text-sm w-fit ${cfg.bg} ${cfg.border} ${cfg.color}`}>
              <span className="animate-pulse">●</span>
              {cfg.label}
            </div>
            {/* Graduated bar */}
            <div className="flex items-center gap-1.5">
              {['Easy', 'Medium', 'Hard', 'Expert'].map((level) => {
                const isActive = level === difficultyLevel;
                const levelCfg = DIFFICULTY_CONFIG[level];
                return (
                  <div
                    key={level}
                    className={`flex-1 h-1.5 rounded-full transition-all duration-500 ${
                      isActive ? levelCfg.bar : 'bg-slate-800'
                    }`}
                  />
                );
              })}
            </div>
            <p className="text-[10px] text-slate-600">
              {difficultyLevel === 'Easy' && 'Warm-up mode — building foundation'}
              {difficultyLevel === 'Medium' && 'Standard depth — probing understanding'}
              {difficultyLevel === 'Hard' && 'Deep dive — testing mastery'}
              {difficultyLevel === 'Expert' && 'Elite tier — edge cases & scale'}
            </p>
          </div>

          {/* Topic + Follow-up */}
          <div className="p-5 flex flex-col gap-3 md:col-span-2">
            <div className="flex items-start gap-4">
              {/* Topic */}
              {topicProbed && (
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center gap-1.5">
                    <Target className="w-3.5 h-3.5 text-slate-500" />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                      Topic
                    </span>
                  </div>
                  <span className="px-3 py-1 rounded-lg bg-violet-600/10 border border-violet-600/20 text-violet-300 text-xs font-bold">
                    {topicProbed}
                  </span>
                </div>
              )}

              {/* Session score */}
              {avgScore && (
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center gap-1.5">
                    <TrendingUp className="w-3.5 h-3.5 text-slate-500" />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                      Avg Score
                    </span>
                  </div>
                  <span className="text-2xl font-black text-white">
                    {avgScore}
                    <span className="text-sm text-slate-500 font-medium">/10</span>
                  </span>
                </div>
              )}
            </div>

            {/* AI Suggested Follow-up */}
            {suggestedFollowUp && (
              <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-4 flex gap-3 items-start">
                <Lightbulb className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-amber-400/70 mb-1">
                    AI suggests Jennifer may ask
                  </p>
                  <p className="text-sm text-slate-200 font-medium leading-snug italic">
                    "{suggestedFollowUp}"
                  </p>
                  {reasoning && (
                    <p className="text-[10px] text-slate-500 mt-1.5 leading-snug">
                      {reasoning}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Placeholder when loading */}
            {!suggestedFollowUp && isLoading && (
              <div className="bg-slate-800/40 border border-dashed border-slate-700 rounded-xl p-4 flex gap-3 items-center animate-pulse">
                <Lightbulb className="w-4 h-4 text-slate-600 shrink-0" />
                <p className="text-xs text-slate-600 italic">Analysing your response...</p>
              </div>
            )}
          </div>
        </div>

        {/* Score history mini-strip */}
        {realtimeScores.length > 0 && (
          <div className="px-6 py-3 border-t border-slate-800 flex items-center gap-3">
            <span className="text-[9px] font-bold uppercase tracking-widest text-slate-600">
              Scores
            </span>
            <div className="flex items-end gap-1 h-6">
              {realtimeScores.map((s, i) => {
                const score = s.score || 0;
                const heightPct = Math.round((score / 10) * 100);
                const color =
                  score >= 8
                    ? 'bg-emerald-500'
                    : score >= 6
                    ? 'bg-amber-500'
                    : 'bg-red-500';
                return (
                  <div
                    key={i}
                    title={`Answer ${i + 1}: ${score}/10`}
                    className={`w-3 rounded-sm transition-all duration-300 ${color}`}
                    style={{ height: `${Math.max(heightPct, 10)}%` }}
                  />
                );
              })}
            </div>
            <span className="text-[9px] text-slate-600">
              {realtimeScores.length} answer{realtimeScores.length !== 1 ? 's' : ''} evaluated
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
