"use client";
import React, { useContext, useEffect, useState, useRef } from 'react';
import { InterviewDataContext } from '@/context/InterviewDataContext';
import { Button } from '@/components/ui/button';
import { PhoneOff, User, Mic, Brain, TrendingUp } from "lucide-react";
import { toast } from 'sonner';
import axios from 'axios';
import { supabase } from '@/services/supabaseClient';
import { useParams, useRouter } from 'next/navigation';
import Vapi from '@vapi-ai/web';
import TimerComponent from './_components/TimerCmponent';
import AdaptiveIntelligencePanel from './_components/AdaptiveIntelligencePanel';

const vapiPublicKey = process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY;

// ─── Adaptive difficulty colours for the evaluation bubble ───────────────────
const DIFF_STYLE = {
  Easy:   { text: 'text-emerald-600', bg: 'bg-emerald-50',  border: 'border-emerald-200' },
  Medium: { text: 'text-amber-600',   bg: 'bg-amber-50',    border: 'border-amber-200'   },
  Hard:   { text: 'text-orange-600',  bg: 'bg-orange-50',   border: 'border-orange-200'  },
  Expert: { text: 'text-red-600',     bg: 'bg-red-50',      border: 'border-red-200'     },
};

function StartInterview() {
  const { interviewInfo, setInterviewInfo } = useContext(InterviewDataContext);
  const [activeUser, setActiveUser]           = useState(false);
  const [isInterviewActive, setIsInterviewActive] = useState(false);
  const [conversation, setConversation]       = useState([]);
  const [loading, setLoading]                 = useState(false);
  const { interview_id } = useParams();
  const router = useRouter();

  // ── Real-time scoring ────────────────────────────────────────────────────
  const [realtimeScores, setRealtimeScores]   = useState([]);
  const [averageScore, setAverageScore]       = useState(0);
  const [partialTranscript, setPartialTranscript] = useState("");

  // ── Adaptive engine state ────────────────────────────────────────────────
  const [adaptiveState, setAdaptiveState] = useState({
    difficultyLevel: 'Medium',
    suggestedFollowUp: null,
    topicProbed: null,
    reasoning: null,
    isAnalysing: false,
  });
  // How many questions have been asked (to know which planned ?s are still pending)
  const questionsAskedRef = useRef(0);

  const vapiRef           = useRef(null);
  const transcriptEndRef  = useRef(null);
  const conversationRef   = useRef([]);

  // ── Average score effect ─────────────────────────────────────────────────
  useEffect(() => {
    if (realtimeScores.length > 0) {
      const avg = realtimeScores.reduce((acc, curr) => acc + curr.score, 0) / realtimeScores.length;
      setAverageScore(parseFloat(avg.toFixed(1)));
    }
  }, [realtimeScores]);

  // ── Auto-scroll chat ─────────────────────────────────────────────────────
  useEffect(() => {
    if (transcriptEndRef.current) {
      transcriptEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [conversation, partialTranscript]);

  // ── Vapi initialisation ───────────────────────────────────────────────────
  useEffect(() => {
    if (!vapiPublicKey) {
      console.error("❌ Vapi Public Key is missing from .env.local");
      return;
    }

    if (!vapiRef.current) {
      vapiRef.current = new Vapi(vapiPublicKey);
      console.log("✅ Vapi instance initialized");
    }

    const vapiInstance = vapiRef.current;

    vapiInstance.on('call-start', () => {
      console.log('🚀 Call started');
      setIsInterviewActive(true);
      toast("Interview Started — Adaptive Engine Active 🧠");
    });

    vapiInstance.on('call-end', () => {
      console.log('🏁 Call ended');
      onCallEnd();
    });

    vapiInstance.on('speech-start', () => {
      setActiveUser(true);
    });

    vapiInstance.on('speech-end', () => {
      setActiveUser(false);
    });

    vapiInstance.on('message', (message) => {
      if (message.type === 'transcript') {
        if (message.transcriptType === 'partial') {
          if (message.role === 'user') {
            setPartialTranscript(message.transcript);
          }
        } else if (message.transcriptType === 'final') {
          setPartialTranscript("");
          const newEntry = {
            role: message.role,
            content: message.transcript,
            timestamp: Date.now(),
            evaluation: null,
          };

          setConversation(prev => {
            const updated = [...prev, newEntry];
            conversationRef.current = updated;
            return updated;
          });

          // Count assistant turns as "questions asked"
          if (message.role === 'assistant') {
            questionsAskedRef.current += 1;
          }

          if (message.role === 'user') {
            EvaluateAnswerInBackground(message.transcript);
          }
        }
      }
    });

    vapiInstance.on('error', (e) => {
      console.error("❌ Vapi Error:", e);
      const errObj = e?.error || e;
      const msg = typeof errObj === 'string' ? errObj : (errObj?.message || JSON.stringify(errObj));
      toast.error("Vapi Error: " + msg);
    });

    return () => {
      vapiInstance.stop();
      vapiInstance.removeAllListeners();
    };
  }, []);

  // ── Fetch interview if context is missing ─────────────────────────────────
  useEffect(() => {
    if (!interviewInfo && interview_id) {
      GetInterviewDetails();
    }
  }, [interviewInfo, interview_id]);

  const GetInterviewDetails = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('Interviews')
        .select("*")
        .eq("interview_id", interview_id)
        .single();

      if (error) throw error;
      if (data) setInterviewInfo(data);
    } catch (err) {
      console.error("❌ Failed to fetch interview details:", err);
      toast.error("Failed to load interview context.");
    } finally {
      setLoading(false);
    }
  };

  // ── Evaluate answer + trigger adaptive engine ─────────────────────────────
  const EvaluateAnswerInBackground = async (answer) => {
    const history = conversationRef.current;
    const lastQuestion = [...history]
      .reverse()
      .find(m => m.role === 'assistant')?.content || "General conversation";

    // Mark panel as analysing
    setAdaptiveState(prev => ({ ...prev, isAnalysing: true }));

    try {
      // 1️⃣  Evaluate answer (now includes difficultyLevel + suggestedFollowUp)
      const evalRes = await axios.post('/api/evaluate-answer', {
        question: lastQuestion,
        answer,
        jobPosition: interviewInfo?.jobPosition || interviewInfo?.interviewData?.jobPosition,
        conversationHistory: history.slice(-8), // pass recent context
      });

      const evaluation = evalRes.data;

      // Update score history
      setRealtimeScores(prev => [...prev, evaluation]);

      // Attach evaluation to the message bubble
      setConversation(prev =>
        prev.map(msg =>
          msg.role === 'user' && msg.content === answer
            ? { ...msg, evaluation }
            : msg
        )
      );

      // 2️⃣  Call adaptive-question engine for the panel (non-blocking)
      const interviewData = interviewInfo?.interviewData || interviewInfo || {};
      const questionList  = interviewData?.questionList || [];

      try {
        const adaptiveRes = await axios.post('/api/adaptive-question', {
          conversation: history.slice(-10),
          lastAnswer: answer,
          lastScore: evaluation.score,
          jobPosition: interviewData?.jobPosition || interviewInfo?.jobPosition,
          questionList,
          questionsAsked: questionsAskedRef.current,
        });

        const adaptive = adaptiveRes.data;
        setAdaptiveState({
          difficultyLevel:   adaptive.difficultyLevel   || evaluation.difficultyLevel || 'Medium',
          suggestedFollowUp: adaptive.followUpQuestion  || evaluation.suggestedFollowUp || null,
          topicProbed:       adaptive.topicProbed       || evaluation.topicProbed      || null,
          reasoning:         adaptive.reasoning         || null,
          isAnalysing:       false,
        });
      } catch (adaptErr) {
        // Graceful fallback — still use the evaluate-answer fields
        console.warn("Adaptive engine unavailable, using eval fields:", adaptErr);
        setAdaptiveState({
          difficultyLevel:   evaluation.difficultyLevel  || 'Medium',
          suggestedFollowUp: evaluation.suggestedFollowUp|| null,
          topicProbed:       evaluation.topicProbed      || null,
          reasoning:         null,
          isAnalysing:       false,
        });
      }

    } catch (err) {
      console.error("Background evaluation failed:", err);
      setAdaptiveState(prev => ({ ...prev, isAnalysing: false }));
    }
  };

  // ── Build & start the Vapi call with the enhanced adaptive system prompt ──
  const startCall = async () => {
    try {
      if (vapiRef.current) vapiRef.current.stop();

      const interviewData  = interviewInfo?.interviewData || interviewInfo || {};
      const questionList   = interviewData?.questionList || [];
      const jobPosition    = interviewData?.jobPosition  || interviewInfo?.jobPosition || 'the role';
      const jobDescription = interviewData?.jobDescription || '';
      const duration       = interviewData?.duration || '15';
      const interviewType  = interviewData?.type || 'General';

      const questionBlock = questionList.length > 0
        ? questionList.map((q, i) => `${i + 1}. ${q.question || q}`).join('\n')
        : "Cover relevant industry standards and best practices.";

      // ── ✅ ADAPTIVE SYSTEM PROMPT ──────────────────────────────────────────
      const systemPrompt = `You are "Jennifer", an elite AI Recruiter conducting a live technical interview for the position of "${jobPosition}".
${jobDescription ? `\nJob Description Context: ${jobDescription}\n` : ''}
Interview Type: ${interviewType}
Interview Duration: ${duration} minutes

═══════════════════════════════════════════════
ADAPTIVE INTERVIEW PROTOCOL — FOLLOW STRICTLY
═══════════════════════════════════════════════

CORE RULES:
- Ask ONE question at a time. Never stack multiple questions.
- Listen deeply to each answer before responding.
- Be professional, concise, and encouraging — but rigorous.
- Never reveal your internal scoring to the candidate.

PLANNED QUESTIONS (use as a guide, not a rigid script):
${questionBlock}

───────────────────────────────────────────────
DIFFICULTY SCALING — Adjust after every answer:
───────────────────────────────────────────────
• STRONG answer (deep, complete, edge-case-aware):
  → Escalate: ask about extreme edge cases, optimisation, system design at scale, or trade-offs.
  → Example move: "How would this perform with 10 million records?"
  → Example move: "What are the trade-offs vs [alternative approach]?"

• DECENT answer (correct but shallow or incomplete):
  → Probe: ask for concrete examples, time/space complexity, or a specific missing detail.
  → Example move: "What is the time complexity of that solution?"
  → Example move: "Can you walk me through a real-world example?"

• WEAK answer (incorrect, vague, or off-topic):
  → Redirect: rephrase the question, give a gentle hint, or simplify to a more fundamental version.
  → Example move: "Let me rephrase — what happens when [simpler scenario]?"
  → Example move: "Think about it from a data structure perspective — which structure fits here?"

───────────────────────────────────────────────
FOLLOW-UP GENERATOR — Use these patterns:
───────────────────────────────────────────────
Algorithm answers:
  • "What is the time and space complexity of your solution?"
  • "How would this change if the array were rotated / the tree unbalanced / the graph disconnected?"
  • "Can you think of a way to reduce the space complexity?"

Conceptual answers:
  • "What are the main trade-offs between X and Y?"
  • "When would you NOT use this approach?"
  • "How does this work under the hood?"

System design answers:
  • "How would you scale this to handle 100× the current load?"
  • "What happens if one of those services goes down?"
  • "How would you monitor and alert on failures?"

Behavioral / experience answers:
  • "What would you do differently if you faced that problem again?"
  • "How did you measure the success of that decision?"
  • "Walk me through the toughest trade-off you had to make."

───────────────────────────────────────────────
CROSS-TOPIC LOGIC:
───────────────────────────────────────────────
• If a candidate mentions a related concept not on your list, pursue it for 1–2 questions.
• Connect topics when relevant (e.g. binary search → rotated array → complexity → space optimisation).
• After 2–3 in-depth follow-ups on a topic, gracefully transition: "Great, let's move on to…"

───────────────────────────────────────────────
TOPIC PROGRESSION:
───────────────────────────────────────────────
• Work through your planned questions in order, but adapt freely.
• If the candidate exhausts a topic early, advance to the next.
• If you are running low on time (approaching ${duration} min), prioritise covering breadth.
• Wrap up naturally: "We're coming up to time — last question…"

Your goal: conduct the most thorough, adaptive, and realistic technical interview possible.`;
      // ── END ADAPTIVE SYSTEM PROMPT ─────────────────────────────────────────

      const assistantOptions = {
        name: "Jennifer",
        firstMessage: `Hello! I'm Jennifer, your AI interviewer today. We're here to discuss the ${jobPosition} role. I'll be adapting my questions based on your responses, so just be yourself and speak naturally. Ready to begin?`,
        silenceTimeoutSeconds: 300,
        maxDurationSeconds: 1800,
        voice: {
          provider: "openai",
          voiceId: "alloy",
        },
        model: {
          provider: "openai",
          model: "gpt-4o-mini",
          messages: [{ role: "system", content: systemPrompt }],
        },
      };

      console.log("🚀 Starting Vapi adaptive call...");
      await vapiRef.current.start(assistantOptions);

    } catch (e) {
      console.error("❌ Failed to start call:", e);
      toast.error("Failed to start call.");
    }
  };

  const stopInterview = () => {
    if (vapiRef.current) vapiRef.current.stop();
  };

  const onCallEnd = () => {
    setIsInterviewActive(false);
    const latestConversation = conversationRef.current;
    if (latestConversation && latestConversation.length > 0) {
      GenerateFeedback(latestConversation);
    } else {
      router.replace('/interview/' + interview_id + '/completed');
    }
  };

  const GenerateFeedback = async (latestConversation) => {
    try {
      toast("Saving interview data...");
      const interviewData = interviewInfo?.interviewData || interviewInfo || {};
      const payload = {
        conversation:  latestConversation,
        jobPosition:   interviewData?.jobPosition,
        jobDescription:interviewData?.jobDescription,
        interviewType: interviewData?.type,
      };
      const result = await axios.post('/api/ai-feedback', payload);
      const parsedFeedback = result.data?.feedback;
      if (parsedFeedback) {
        const { data, error } = await supabase
          .from("InterviewAttempts")
          .insert({
            interview_id:   interview_id,
            candidatename:  interviewInfo?.userName  || "Anonymous Candidate",
            candidateemail: interviewInfo?.userEmail || "No Email Provided",
            feedback:       parsedFeedback,
          })
          .select("id")
          .single();

        if (error) {
          console.error("Supabase Error:", error);
          toast.error("Failed to save attempt.");
          router.replace('/interview/' + interview_id + '/completed');
          return;
        }

        toast("Feedback saved! 🎉");
        router.replace(`/dashboard/interview/${interview_id}/feedback/${data.id}`);
      } else {
        router.replace('/interview/' + interview_id + '/completed');
      }
    } catch (err) {
      console.error("Feedback error:", err);
      router.replace('/interview/' + interview_id + '/completed');
    }
  };

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col relative overflow-hidden">
      {/* Background blobs */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-blue-100/40 blur-3xl" />
        <div className="absolute top-[20%] -right-[10%] w-[40%] h-[40%] rounded-full bg-violet-100/40 blur-3xl" />
      </div>

      {/* Nav bar */}
      <div className="bg-white/70 backdrop-blur-xl border-b border-slate-200/60 px-8 py-4 flex justify-between items-center sticky top-0 z-50">
        <img src="/veritas_logo.png" alt="VeritasAI" className="h-10 w-auto" />
        <div className="flex items-center gap-6">
          {/* Adaptive difficulty badge in header */}
          {isInterviewActive && (
            <div className={`hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all duration-500
              ${DIFF_STYLE[adaptiveState.difficultyLevel]?.bg || 'bg-slate-50'}
              ${DIFF_STYLE[adaptiveState.difficultyLevel]?.border || 'border-slate-200'}
              ${DIFF_STYLE[adaptiveState.difficultyLevel]?.text || 'text-slate-600'}`
            }>
              <Brain className="w-3.5 h-3.5" />
              {adaptiveState.difficultyLevel} Mode
            </div>
          )}
          {isInterviewActive && averageScore > 0 && (
            <div className="hidden md:flex items-center gap-1.5 text-xs font-bold text-slate-600">
              <TrendingUp className="w-3.5 h-3.5 text-indigo-500" />
              {averageScore}/10
            </div>
          )}
          <TimerComponent isInterviewActive={isInterviewActive} />
          <div className="h-10 w-10 rounded-full bg-slate-100 border flex items-center justify-center text-slate-600">
            <User size={18} />
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col items-center justify-start pt-8 pb-16 px-4 relative z-10">
        <div className="text-center mb-8 w-full max-w-5xl">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight flex items-center gap-4 justify-center">
            Interview Session
            {isInterviewActive && (
              <span className="text-xs bg-red-100 text-red-500 px-2 py-1 rounded-full animate-pulse">
                LIVE
              </span>
            )}
          </h1>
          <p className="text-slate-500 mt-2 text-sm">
            Adaptive AI-driven candidate assessment — questions evolve with your answers
          </p>
        </div>

        {/* Avatar cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-5xl">
          {/* Jennifer */}
          <div className="bg-white/80 backdrop-blur shadow-xl rounded-[2rem] p-10 flex flex-col items-center justify-center gap-6 h-[360px] border border-white relative overflow-hidden">
            {isInterviewActive && !activeUser && (
              <div className="absolute inset-0 rounded-[2rem] ring-2 ring-blue-400 ring-offset-2 animate-pulse pointer-events-none" />
            )}
            <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-white shadow-lg">
              <img
                src="https://img.freepik.com/free-photo/young-business-woman-working-laptop-office_1303-21060.jpg"
                alt="Jennifer"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="text-center">
              <h2 className="text-2xl font-bold text-slate-800">Jennifer</h2>
              <span className="text-sm bg-blue-50 text-blue-600 px-3 py-1 rounded-full">
                Adaptive AI Recruiter
              </span>
              {isInterviewActive && adaptiveState.topicProbed && (
                <p className="text-[11px] text-slate-400 mt-2 font-medium">
                  Probing: <span className="text-violet-600 font-bold">{adaptiveState.topicProbed}</span>
                </p>
              )}
            </div>
          </div>

          {/* Candidate */}
          <div className="bg-white/80 backdrop-blur shadow-xl rounded-[2rem] p-10 flex flex-col items-center justify-center gap-6 h-[360px] border border-white relative overflow-hidden">
            {isInterviewActive && activeUser && (
              <div className="absolute inset-0 rounded-[2rem] ring-2 ring-emerald-400 ring-offset-2 animate-pulse pointer-events-none" />
            )}
            <div className="w-28 h-28 rounded-full bg-slate-50 border-4 border-white shadow-inner flex items-center justify-center">
              <span className="text-4xl font-bold text-slate-400">
                {interviewInfo?.userName?.charAt(0) || 'U'}
              </span>
            </div>
            <div className="text-center">
              <h2 className="text-2xl font-bold text-slate-800">
                {interviewInfo?.userName || 'Candidate'}
              </h2>
              <span className="text-sm bg-violet-50 text-violet-600 px-3 py-1 rounded-full">
                Applicant
              </span>
              {realtimeScores.length > 0 && (
                <p className="text-[11px] text-slate-400 mt-2 font-medium">
                  Session avg:{' '}
                  <span className="text-indigo-600 font-bold">{averageScore}/10</span>
                </p>
              )}
            </div>
          </div>
        </div>

        {/* ── Adaptive Intelligence Panel ─────────────────────────────── */}
        {isInterviewActive && (
          <AdaptiveIntelligencePanel
            difficultyLevel={adaptiveState.difficultyLevel}
            topicProbed={adaptiveState.topicProbed}
            suggestedFollowUp={adaptiveState.suggestedFollowUp}
            reasoning={adaptiveState.reasoning}
            realtimeScores={realtimeScores}
            isLoading={adaptiveState.isAnalysing}
          />
        )}

        {/* ── Live Transcript ─────────────────────────────────────────── */}
        {isInterviewActive && (conversation.length > 0 || partialTranscript) && (
          <div className="mt-6 w-full max-w-5xl px-4">
            <div className="bg-slate-900/5 backdrop-blur-md rounded-2xl p-6 border border-slate-200/60 min-h-[120px] max-h-[380px] overflow-y-auto flex flex-col gap-4 shadow-inner">
              {conversation.map((msg, idx) => (
                <div key={idx} className="flex flex-col gap-2">
                  {/* Chat bubble */}
                  <div className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div
                      className={`max-w-[80%] rounded-2xl p-4 text-sm shadow-sm ${
                        msg.role === 'user'
                          ? 'bg-blue-600 text-white rounded-tr-none'
                          : 'bg-white text-slate-700 border rounded-tl-none'
                      }`}
                    >
                      <p className="text-[10px] font-bold uppercase mb-1 opacity-70">
                        {msg.role === 'user' ? 'You' : 'Jennifer'}
                      </p>
                      {msg.content}
                    </div>
                  </div>

                  {/* Evaluation badge (enhanced) */}
                  {msg.role === 'user' && msg.evaluation && (
                    <div className="flex justify-end">
                      <div
                        className={`max-w-[75%] rounded-xl p-3 text-[11px] border
                          ${DIFF_STYLE[msg.evaluation.difficultyLevel]?.bg    || 'bg-blue-50'}
                          ${DIFF_STYLE[msg.evaluation.difficultyLevel]?.border|| 'border-blue-100'}
                          ${DIFF_STYLE[msg.evaluation.difficultyLevel]?.text  || 'text-blue-800'}`
                        }
                      >
                        <div className="flex items-center justify-between mb-1.5">
                          <p className="font-black">Score: {msg.evaluation.score}/10</p>
                          {msg.evaluation.difficultyLevel && (
                            <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full border
                              ${DIFF_STYLE[msg.evaluation.difficultyLevel]?.border}
                              ${DIFF_STYLE[msg.evaluation.difficultyLevel]?.text}`}>
                              {msg.evaluation.difficultyLevel}
                            </span>
                          )}
                        </div>
                        {msg.evaluation.strengths?.length > 0 && (
                          <p className="mt-1">✨ {msg.evaluation.strengths.join(", ")}</p>
                        )}
                        {msg.evaluation.weaknesses?.length > 0 && (
                          <p className="mt-0.5">⚠️ {msg.evaluation.weaknesses.join(", ")}</p>
                        )}
                        {msg.evaluation.improvements?.length > 0 && (
                          <p className="mt-0.5">🚀 {msg.evaluation.improvements.join(", ")}</p>
                        )}
                        {msg.evaluation.topicProbed && (
                          <p className="mt-1.5 text-[9px] font-bold uppercase tracking-wider opacity-60">
                            Topic: {msg.evaluation.topicProbed}
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}

              {/* Partial transcript (live typing) */}
              {partialTranscript && (
                <div className="flex justify-end animate-pulse">
                  <div className="max-w-[80%] rounded-2xl p-4 text-sm bg-blue-400 text-white rounded-tr-none italic">
                    {partialTranscript}...
                  </div>
                </div>
              )}
              <div ref={transcriptEndRef} />
            </div>
          </div>
        )}

        {/* ── CTA Button ──────────────────────────────────────────────── */}
        <div className="mt-8">
          {!isInterviewActive ? (
            <Button
              onClick={startCall}
              className="px-10 py-8 bg-slate-900 text-white rounded-2xl hover:bg-slate-800 transition-all font-bold flex gap-3 text-lg shadow-xl"
            >
              <Brain className="w-5 h-5" />
              Start Adaptive Interview
              <Mic className="w-5 h-5" />
            </Button>
          ) : (
            <Button
              onClick={stopInterview}
              variant="destructive"
              className="px-10 py-8 rounded-2xl font-bold flex gap-3 text-lg hover:bg-red-700 shadow-lg shadow-red-500/20"
            >
              Hang Up <PhoneOff className="w-5 h-5" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

export default StartInterview;
