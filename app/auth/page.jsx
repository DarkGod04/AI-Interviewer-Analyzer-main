"use client"
import React, { useEffect, useState } from 'react'
import { supabase } from './../../services/supabaseClient'
import { motion } from 'framer-motion'
import { Terminal, ShieldAlert, Fingerprint } from 'lucide-react'

function Login() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const asyncsignInWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/dashboard`
      }
    })

    if (error) {
      console.log(error)
    }
  }

  // Avoid hydration mismatch for animations
  if (!mounted) return null;

  return (
    <div className="relative min-h-screen w-full bg-[#050505] overflow-hidden flex items-center justify-center font-sans">
      
      {/* ── Background Grid & Orbs ── */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1a1a00_1px,transparent_1px),linear-gradient(to_bottom,#1a1a00_1px,transparent_1px)] bg-[size:40px_40px] opacity-60 z-0" />
      
      <motion.div 
        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[-20%] left-[-10%] w-96 h-96 bg-yellow-500/20 blur-[100px] rounded-full pointer-events-none z-0" 
      />
      <motion.div 
        animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.4, 0.2] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        className="absolute bottom-[-10%] right-[-5%] w-[30rem] h-[30rem] bg-blue-500/10 blur-[120px] rounded-full pointer-events-none z-0" 
      />
      <motion.div 
        animate={{ y: [0, 50, 0], opacity: [0.1, 0.3, 0.1] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute top-[30%] right-[20%] w-64 h-64 bg-red-500/10 blur-[80px] rounded-full pointer-events-none z-0" 
      />

      <div className="relative z-10 w-full max-w-md p-4">
        <motion.div
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="relative glass-dark p-8 rounded-[2rem] border border-yellow-500/20 shadow-[0_0_40px_rgba(251,191,36,0.1)] overflow-hidden"
        >
          {/* Cyberpunk Top Accent Line */}
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-yellow-400 to-transparent" />
          
          <div className="absolute top-0 right-0 w-16 h-16 bg-red-500/10 rounded-bl-full" />

          {/* Header */}
          <div className="flex flex-col items-center mb-10">
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3, type: "spring", stiffness: 200, damping: 20 }}
              className="relative w-20 h-20 mb-6 flex items-center justify-center rounded-2xl bg-[#0a0a0a] border border-zinc-800/60 shadow-xl"
            >
              <div className="absolute inset-0 rounded-2xl border border-yellow-500/30 opacity-50" />
              <img src="/veritas_logo.png" alt="VeritasAI" className="w-12 h-12 object-contain filter drop-shadow-[0_0_8px_rgba(251,191,36,0.8)]" />
              <div className="absolute -bottom-2 -right-2 bg-yellow-400 text-black p-1 rounded-md">
                <ShieldAlert className="w-3 h-3" />
              </div>
            </motion.div>
            
            <motion.div
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="flex items-center gap-2 mb-2"
            >
              <Terminal className="text-yellow-400 w-4 h-4" />
              <span className="text-yellow-400 font-mono text-xs font-bold tracking-[0.3em] uppercase">SYSTEM.LOGIN</span>
            </motion.div>
            
            <motion.h1 
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-3xl font-black text-white tracking-tight text-center"
            >
              AUTHENTICATION 
              <br/>
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 via-red-400 to-blue-400">
                REQUIRED
              </span>
            </motion.h1>
          </div>

          {/* Connection Visual */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="w-full flex items-center justify-center gap-4 mb-10"
          >
            <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent to-zinc-700" />
            <Fingerprint className="w-6 h-6 text-zinc-500 animate-pulse" />
            <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent to-zinc-700" />
          </motion.div>

          {/* Action Button */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            <button
              onClick={asyncsignInWithGoogle}
              className="group relative w-full flex items-center justify-center gap-3 py-4 bg-zinc-900 border border-zinc-700 hover:border-yellow-400/50 rounded-xl overflow-hidden transition-all duration-300 transform hover:scale-[1.02]"
              style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.5)' }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              <img className="h-5 w-5 relative z-10" src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" />
              <span className="relative z-10 text-zinc-100 font-bold tracking-wider text-sm">
                SECURE LOGIN WITH GOOGLE
              </span>

              {/* Glowing hover line */}
              <div className="absolute bottom-0 left-[20%] right-[20%] h-[1px] bg-yellow-400 opacity-0 group-hover:opacity-100 blur-[2px] transition-all duration-300" />
            </button>
            <p className="text-center text-zinc-600 font-mono text-[10px] uppercase tracking-[0.2em] mt-6">
              Encrypted Connection Est. 2026
            </p>
          </motion.div>

        </motion.div>
      </div>

    </div>
  )
}

export default Login