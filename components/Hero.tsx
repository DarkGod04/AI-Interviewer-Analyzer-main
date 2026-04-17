"use client";

import { motion, useScroll, useTransform, useMotionValue, useSpring } from "framer-motion";
import { Mic, Brain, BarChart3, Zap, Clock, Shield, ArrowRight, Sparkles } from "lucide-react";
import { useRef, useState, useEffect } from "react";
import Link from "next/link";

// Pre-seeded static particle data to avoid hydration mismatch (Math.random() differs between SSR and CSR)
const PARTICLES = Array.from({ length: 30 }, (_, i) => ({
  left: ((i * 37 + 13) % 100).toFixed(4),
  top: ((i * 53 + 7) % 100).toFixed(4),
  xDrift: ((i * 29 + 17) % 100) - 50,
  duration: 3 + ((i * 11 + 3) % 30) / 10,
  delay: ((i * 7 + 1) % 20) / 10,
}));

// Pre-seeded particle data for the h1 floating sparks (avoids Math.random() SSR/CSR mismatch)
const H1_SPARKS = Array.from({ length: 20 }, (_, i) => ({
  xDrift: (((i * 41 + 7) % 100) / 100 - 0.5) * 60,
  duration: 2 + ((i * 13 + 5) % 20) / 10,
  left: ((i * 61 + 11) % 100).toFixed(4),
  top: ((i * 43 + 19) % 100).toFixed(4),
}));

// Inline abstract 3D shape for the visual to prevent missing component build errors
const Abstract3DShape = () => {
  return (
    <motion.div
      animate={{ rotateX: [0, 360], rotateY: [0, 360] }}
      transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      className="w-full h-full relative flex items-center justify-center transform-gpu preserve-3d"
    >
      {/* Prime Center Core */}
      <motion.div className="absolute w-40 h-40 bg-gradient-to-br from-pink-500/80 to-fuchsia-600/80 rounded-2xl backdrop-blur-xl border-2 border-pink-400/50 shadow-[0_0_100px_rgba(236,72,153,0.5)]" />
      
      {/* Outer Orbiting Rings */}
      <motion.div
        animate={{ rotateZ: [0, 360], rotateX: [60, 60] }}
        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
        className="absolute w-80 h-80 border-4 border-t-pink-500/80 border-r-fuchsia-500/40 border-b-transparent border-l-transparent rounded-full shadow-[0_0_30px_rgba(236,72,153,0.2)]"
      />
      <motion.div
        animate={{ rotateZ: [360, 0], rotateY: [70, 70] }}
        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        className="absolute w-96 h-96 border-2 border-purple-500/40 border-dashed rounded-full"
      />
      
      {/* Geometric accent squares floating */}
      {[...Array(4)].map((_, i) => (
        <motion.div
          key={i}
          animate={{
            rotateZ: [0, 360],
            rotateX: [0, 360],
            rotateY: [0, 360]
          }}
          transition={{ duration: 12 + i * 2, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0"
        >
          <div className="absolute top-0 right-1/4 w-12 h-12 bg-pink-400/20 border border-fuchsia-400/50 backdrop-blur-sm rounded-lg" style={{ transform: `translateZ(${100 + i * 20}px)` }} />
        </motion.div>
      ))}
    </motion.div>
  );
};


export default function InteractiveHero() {
  const containerRef = useRef(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  // Use 1200 as fallback on server; update to real width on client mount
  const [windowWidth, setWindowWidth] = useState(1200);

  useEffect(() => {
    setWindowWidth(window.innerWidth);
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // Mouse tracking for 3D effects
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const smoothMouseX = useSpring(mouseX, { stiffness: 50, damping: 20 });
  const smoothMouseY = useSpring(mouseY, { stiffness: 50, damping: 20 });

  const handleMouseMove = (e) => {
    const { clientX, clientY } = e;
    const { innerWidth, innerHeight } = window;
    mouseX.set((clientX / innerWidth - 0.5) * 20);
    mouseY.set((clientY / innerHeight - 0.5) * 20);
    setMousePosition({ x: clientX, y: clientY });
  };

  // Scroll-linked transformations for background objects
  const object1Y = useTransform(scrollYProgress, [0, 1], [0, -500]);
  const object2Y = useTransform(scrollYProgress, [0, 1], [0, 300]);
  const object3Rotate = useTransform(scrollYProgress, [0, 1], [0, 360]);
  const object4Scale = useTransform(scrollYProgress, [0, 0.5, 1], [1, 1.5, 0.8]);

  return (
    <div ref={containerRef} className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950/20 to-slate-950 text-white overflow-x-hidden relative" onMouseMove={handleMouseMove}>
      {/* Navigation */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="fixed top-0 left-0 right-0 z-50 px-6 py-6"
      >
        <div className="max-w-7xl mx-auto">
          <div className="bg-slate-900/50 backdrop-blur-xl border border-pink-500/20 rounded-2xl px-8 py-4 flex justify-between items-center">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="text-2xl font-bold bg-gradient-to-r from-pink-400 to-fuchsia-400 bg-clip-text text-transparent cursor-pointer"
            >
              VARITAS AI
            </motion.div>

            <div className="hidden md:flex gap-8 items-center">
              {["Platform", "Features", "Architecture", "Pricing"].map((item) => (
                <motion.a
                  key={item}
                  whileHover={{ scale: 1.1, color: "#ec4899" }}
                  className="text-slate-300 hover:text-pink-400 transition-colors cursor-pointer font-medium"
                >
                  {item}
                </motion.a>
              ))}
            </div>

            <Link href="/auth">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-3 bg-gradient-to-r from-pink-500 to-fuchsia-600 hover:from-pink-600 hover:to-fuchsia-700 rounded-xl font-semibold transition-all duration-300 shadow-lg shadow-pink-500/30"
              >
                Get Started
              </motion.button>
            </Link>
          </div>
        </div>
      </motion.nav>

      {/* Animated Background Objects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 2 }}>
        {/* Object 1: Large gradient sphere */}
        <motion.div
          style={{ y: object1Y }}
          className="absolute -top-40 -right-40 w-[800px] h-[800px] bg-gradient-to-br from-pink-500/20 to-purple-500/20 rounded-full blur-3xl"
        />

        {/* Object 2: Geometric cube */}
        <motion.div
          style={{ y: object2Y, rotateZ: object3Rotate }}
          className="absolute top-1/4 -left-20 w-64 h-64"
        >
          <div className="w-full h-full bg-gradient-to-br from-pink-500/15 to-fuchsia-500/15 backdrop-blur-sm border border-pink-500/30 transform rotate-45" />
        </motion.div>

        {/* Object 3: Floating ring */}
        <motion.div
          style={{ scale: object4Scale, rotateZ: object3Rotate }}
          className="absolute top-1/2 right-1/4 w-80 h-80 border-4 border-pink-500/20 rounded-full"
        >
          <div className="absolute inset-8 border-4 border-fuchsia-500/20 rounded-full" />
        </motion.div>

        {/* Object 4: Grid pattern */}
        <motion.div
          style={{ y: object2Y, opacity: useTransform(scrollYProgress, [0, 0.5], [0.2, 0]) }}
          className="absolute bottom-0 left-0 w-full h-96"
        >
          <div className="w-full h-full bg-[linear-gradient(to_right,#ec4899_1px,transparent_1px),linear-gradient(to_bottom,#ec4899_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-10 [mask-image:linear-gradient(to_bottom,transparent,black,transparent)]" />
        </motion.div>

        {/* Object 5: Animated particles — using pre-seeded data to avoid SSR/CSR hydration mismatch */}
        {PARTICLES.map((p, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0 }}
            animate={{
              opacity: [0.2, 0.6, 0.2],
              y: [0, -150, 0],
              x: [0, p.xDrift, 0],
            }}
            transition={{
              duration: p.duration,
              repeat: Infinity,
              delay: p.delay,
            }}
            className="absolute w-1 h-1 bg-pink-400 rounded-full shadow-lg shadow-pink-500/50"
            style={{
              left: `${p.left}%`,
              top: `${p.top}%`,
            }}
          />
        ))}

        {/* Flowing topographic lines */}
        <svg className="absolute inset-0 w-full h-full opacity-20">
          {[...Array(6)].map((_, i) => {
            // windowWidth is initialized to 1200 on server; updated on client via useEffect
            const w = windowWidth;
            return (
              <motion.path
                key={`topo-${i}`}
                d={`M 0 ${100 + i * 80} Q ${w / 4} ${50 + i * 80} ${w / 2} ${100 + i * 80} T ${w} ${100 + i * 80}`}
                stroke="url(#pink-gradient)"
                strokeWidth="1"
                fill="none"
                animate={{
                  d: [
                    `M 0 ${100 + i * 80} Q ${w / 4} ${50 + i * 80} ${w / 2} ${100 + i * 80} T ${w} ${100 + i * 80}`,
                    `M 0 ${100 + i * 80} Q ${w / 4} ${150 + i * 80} ${w / 2} ${100 + i * 80} T ${w} ${100 + i * 80}`,
                    `M 0 ${100 + i * 80} Q ${w / 4} ${50 + i * 80} ${w / 2} ${100 + i * 80} T ${w} ${100 + i * 80}`,
                  ],
                }}
                transition={{
                  duration: 8 + i * 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            )
          })}
          <defs>
            <linearGradient id="pink-gradient">
              <stop offset="0%" stopColor="#ec4899" />
              <stop offset="100%" stopColor="#a855f7" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center pt-32" style={{ zIndex: 10 }}>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-pink-900/30 via-transparent to-transparent" />

        <div className="relative max-w-7xl mx-auto px-6 py-20 grid lg:grid-cols-2 gap-16 items-center" style={{ zIndex: 10 }}>
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-pink-500/10 border border-pink-500/30 rounded-full mb-6 backdrop-blur-sm"
            >
              <Sparkles className="w-4 h-4 text-pink-400" />
              <span className="text-pink-400 text-sm font-medium">Powered by Advanced AI</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-7xl lg:text-8xl font-bold mb-8 leading-tight relative group cursor-pointer tracking-tight"
              style={{
                perspective: 1000,
                transformStyle: "preserve-3d",
              }}
            >
              <div className="absolute inset-0 pointer-events-none">
                {H1_SPARKS.map((spark, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0 }}
                    animate={{
                      opacity: [0, 0.6, 0],
                      y: [0, -80],
                      x: [0, spark.xDrift],
                    }}
                    transition={{
                      duration: spark.duration,
                      repeat: Infinity,
                      delay: i * 0.1,
                    }}
                    className="absolute w-2 h-2 rounded-full bg-pink-400 shadow-lg shadow-pink-500/50"
                    style={{
                      left: `${spark.left}%`,
                      top: `${spark.top}%`,
                    }}
                  />
                ))}
              </div>

              <motion.div
                className="inline-block"
                whileHover={{ scale: 1.03 }}
                transition={{ type: "spring", stiffness: 300 }}
                style={{
                  transformStyle: "preserve-3d",
                }}
              >
                <span className="relative inline-block">
                  <span className="relative z-10">VARITAS</span>
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-pink-400 to-fuchsia-400 blur-3xl opacity-0 group-hover:opacity-60"
                    transition={{ duration: 0.4 }}
                  />
                </span>
              </motion.div>
              <br />
              <motion.span
                className="relative inline-block mt-2"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
                style={{
                  transformStyle: "preserve-3d",
                }}
              >
                <span className="bg-gradient-to-r from-pink-400 via-fuchsia-400 to-purple-400 bg-clip-text text-transparent relative">
                  AI
                  {/* 3D depth layers */}
                  <motion.span
                    animate={{
                      opacity: [0.3, 0.6, 0.3],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                    }}
                    className="absolute inset-0 bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent blur-md pointer-events-none pb-4"
                  >
                    AI
                  </motion.span>
                </span>
              </motion.span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="text-2xl text-slate-300 mb-10 leading-relaxed max-w-xl"
            >
              Revolutionary AI-powered interview analysis that transforms technical hiring through real-time evaluation and intelligent insights.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="flex gap-4"
            >
              <Link href="/auth">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-10 py-5 bg-gradient-to-r from-pink-500 to-fuchsia-600 hover:from-pink-600 hover:to-fuchsia-700 rounded-xl transition-all duration-300 flex items-center gap-3 group shadow-2xl shadow-pink-500/30 font-semibold text-lg"
                >
                  Explore Platform
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </motion.button>
              </Link>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                className="px-10 py-5 border-2 border-pink-500/30 hover:border-pink-500/60 rounded-xl transition-all duration-300 backdrop-blur-sm hover:bg-pink-500/5 font-semibold text-lg"
              >
                View Demo
              </motion.button>
            </motion.div>
          </motion.div>

          {/* Right Visual - Interactive 3D Abstract Shape */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="relative h-[600px] lg:h-[700px]"
            style={{ transformStyle: "preserve-3d", perspective: 1000 }}
          >
            {/* Background glow */}
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.5, 0.3],
              }}
              transition={{ duration: 4, repeat: Infinity }}
              className="absolute inset-0 bg-gradient-to-r from-pink-600/40 to-purple-600/40 rounded-full blur-3xl"
            />

            {/* Injected Abstract 3D Shape Component directly */}
            <Abstract3DShape />

            {/* Orbiting accent elements */}
            <motion.div
              animate={{
                rotateZ: [0, 360],
              }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 pointer-events-none"
            >
              <motion.div
                animate={{
                  y: [0, -30, 0],
                }}
                transition={{ duration: 3, repeat: Infinity }}
                className="absolute top-10 right-10 w-16 h-16 bg-gradient-to-br from-pink-500/40 to-fuchsia-500/40 rounded-2xl backdrop-blur-sm border border-pink-500/50 transform rotate-12"
              />
            </motion.div>

            <motion.div
              animate={{
                rotateZ: [360, 0],
              }}
              transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 pointer-events-none"
            >
              <motion.div
                animate={{
                  y: [0, 20, 0],
                }}
                transition={{ duration: 4, repeat: Infinity, delay: 1 }}
                className="absolute bottom-20 left-10 w-12 h-12 bg-gradient-to-br from-purple-500/40 to-pink-500/40 rounded-full backdrop-blur-sm border border-purple-500/50"
              />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Architecture Pipeline */}
      <section className="relative py-32 px-6" style={{ zIndex: 10 }}>
        {/* Animated background shape */}
        <motion.div
          style={{
            y: useTransform(scrollYProgress, [0.2, 0.5], [100, -100]),
            rotateZ: useTransform(scrollYProgress, [0.2, 0.5], [0, 180]),
          }}
          className="absolute top-1/4 right-10 w-96 h-96 bg-gradient-to-br from-pink-500/15 to-purple-500/15 rounded-full blur-3xl"
        />

        <div className="max-w-7xl mx-auto relative" style={{ zIndex: 10 }}>
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-20"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="inline-block px-5 py-2 bg-pink-500/10 border border-pink-500/30 rounded-full mb-6 backdrop-blur-sm"
            >
              <span className="text-pink-400 text-sm font-semibold tracking-wide uppercase">System Architecture</span>
            </motion.div>
            <h2 className="text-6xl font-bold mb-6 bg-gradient-to-r from-white via-pink-100 to-white bg-clip-text text-transparent">
              End-to-End Intelligence
            </h2>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
              A seamless pipeline transforming voice interactions into actionable intelligence
            </p>
          </motion.div>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              {
                icon: Mic,
                title: "Voice Input",
                description: "Real-time speech-to-text conversion with natural language processing",
                tech: "Vapi AI • STT",
                color: "pink"
              },
              {
                icon: Brain,
                title: "LLM Evaluation",
                description: "Advanced AI analysis with structured feedback generation",
                tech: "OpenAI • GPT-4",
                color: "fuchsia"
              },
              {
                icon: BarChart3,
                title: "Analytics Engine",
                description: "Intelligent data storage and query optimization",
                tech: "Supabase • PostgreSQL",
                color: "purple"
              },
              {
                icon: Zap,
                title: "Dashboard",
                description: "Real-time recruiter insights and candidate tracking",
                tech: "Next.js • React",
                color: "pink"
              }
            ].map((step, index) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{
                  y: -15,
                  scale: 1.03,
                  transition: { duration: 0.3 }
                }}
                className="relative group"
                style={{ transformStyle: "preserve-3d" }}
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-b from-pink-600/20 to-transparent rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  animate={{
                    scale: [1, 1.05, 1],
                  }}
                  transition={{ duration: 3, repeat: Infinity }}
                />
                <div className="relative bg-gradient-to-br from-slate-900/80 to-slate-900/40 border border-pink-500/20 rounded-2xl p-8 backdrop-blur-xl hover:border-pink-500/40 transition-all duration-500"
                  style={{ transform: "translateZ(20px)" }}
                >
                  <motion.div
                    whileHover={{ rotateY: 360 }}
                    transition={{ duration: 0.8 }}
                    className="w-16 h-16 rounded-xl bg-gradient-to-br from-pink-500 to-fuchsia-600 flex items-center justify-center mb-6 shadow-lg shadow-pink-500/30"
                  >
                    <step.icon className="w-8 h-8" />
                  </motion.div>
                  <h3 className="text-2xl font-bold mb-4">{step.title}</h3>
                  <p className="text-slate-300 mb-6 leading-relaxed text-base">{step.description}</p>
                  <div className="text-sm text-pink-400 font-mono font-semibold">{step.tech}</div>
                </div>
                {index < 3 && (
                  <motion.div
                    animate={{
                      opacity: [0.3, 0.6, 0.3],
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="hidden md:block absolute top-1/2 -right-4 w-8 h-0.5 bg-gradient-to-r from-pink-500/50 to-transparent"
                  />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="relative py-32 px-6" style={{ zIndex: 10 }}>
        {/* Scroll-linked geometric shapes */}
        <motion.div
          style={{
            y: useTransform(scrollYProgress, [0.4, 0.7], [-100, 100]),
            rotateZ: useTransform(scrollYProgress, [0.4, 0.7], [-45, 45]),
          }}
          className="absolute top-20 left-10 w-64 h-64 border-2 border-pink-500/20 transform rotate-45"
        />

        <motion.div
          style={{
            scale: useTransform(scrollYProgress, [0.5, 0.7], [0.8, 1.2]),
            opacity: useTransform(scrollYProgress, [0.5, 0.7], [0.4, 0.15]),
          }}
          className="absolute bottom-20 right-20 w-[500px] h-[500px] bg-gradient-to-br from-fuchsia-500/20 to-purple-500/20 rounded-full blur-3xl"
        />

        <div className="max-w-7xl mx-auto relative" style={{ zIndex: 10 }}>
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-20"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="inline-block px-5 py-2 bg-pink-500/10 border border-pink-500/30 rounded-full mb-6 backdrop-blur-sm"
            >
              <span className="text-pink-400 text-sm font-semibold tracking-wide uppercase">Core Capabilities</span>
            </motion.div>
            <h2 className="text-6xl font-bold mb-6 bg-gradient-to-r from-white via-pink-100 to-white bg-clip-text text-transparent">
              Enterprise-Grade Intelligence
            </h2>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
              Production-ready infrastructure designed for reliability, speed, and scalability
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-10">
            {[
              {
                icon: Clock,
                title: "Real-Time Processing",
                description: "Streaming responses with asynchronous evaluation. No blocking, no lag—candidates experience natural conversation flow while feedback generates in parallel.",
                metrics: "< 100ms",
                detail: "Average latency"
              },
              {
                icon: Shield,
                title: "Structured Output",
                description: "Deterministic JSON responses via prompt engineering and validation layers. Failed parsing triggers automatic retry with corrected prompts.",
                metrics: "99.9%",
                detail: "Output reliability"
              },
              {
                icon: BarChart3,
                title: "Analytics Dashboard",
                description: "Query-optimized PostgreSQL schema stores scores, feedback, and metadata. Track performance trends, create templates, and export insights.",
                metrics: "∞",
                detail: "Unlimited scale"
              }
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.15 }}
                whileHover={{
                  y: -12,
                  scale: 1.02,
                  transition: { duration: 0.3 }
                }}
                className="relative bg-gradient-to-br from-slate-900/90 to-slate-900/50 border border-pink-500/20 rounded-2xl p-10 hover:border-pink-500/40 transition-all duration-500 group backdrop-blur-xl"
                style={{ transformStyle: "preserve-3d" }}
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-br from-pink-500/10 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  animate={{
                    scale: [1, 1.02, 1],
                  }}
                  transition={{ duration: 3, repeat: Infinity }}
                />

                <div className="relative z-10">
                  <motion.div
                    whileHover={{ rotateY: 360, scale: 1.15 }}
                    transition={{ duration: 0.8 }}
                    className="inline-block mb-6"
                  >
                    <feature.icon className="w-14 h-14 text-pink-400 group-hover:text-fuchsia-400 transition-colors drop-shadow-lg" />
                  </motion.div>

                  <h3 className="text-3xl font-bold mb-5 bg-gradient-to-r from-white to-pink-100 bg-clip-text text-transparent">
                    {feature.title}
                  </h3>

                  <p className="text-slate-300 leading-relaxed mb-8 text-base">
                    {feature.description}
                  </p>

                  <div className="flex items-baseline gap-2">
                    <div className="text-4xl font-bold bg-gradient-to-r from-pink-400 to-fuchsia-400 bg-clip-text text-transparent">
                      {feature.metrics}
                    </div>
                    <div className="text-sm text-slate-400 font-medium">
                      {feature.detail}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Technical Highlight */}
      <section className="relative py-32 px-6 bg-gradient-to-b from-slate-900 via-purple-950/20 to-slate-950" style={{ zIndex: 10 }}>
        {/* Animated orbs */}
        <motion.div
          animate={{
            x: [0, 120, 0],
            y: [0, -60, 0],
          }}
          transition={{ duration: 10, repeat: Infinity }}
          className="absolute top-40 left-20 w-64 h-64 bg-gradient-to-br from-pink-500/25 to-fuchsia-500/25 rounded-full blur-3xl"
        />

        <motion.div
          animate={{
            x: [0, -100, 0],
            y: [0, 80, 0],
          }}
          transition={{ duration: 12, repeat: Infinity }}
          className="absolute bottom-40 right-20 w-80 h-80 bg-gradient-to-br from-purple-500/25 to-pink-500/25 rounded-full blur-3xl"
        />

        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-br from-pink-500/10 to-purple-500/10 rounded-3xl blur-2xl"
              animate={{
                scale: [1, 1.05, 1],
                opacity: [0.3, 0.5, 0.3],
              }}
              transition={{ duration: 4, repeat: Infinity }}
            />

            <div className="relative bg-gradient-to-br from-slate-900/90 to-slate-900/60 border border-pink-500/30 rounded-3xl p-14 backdrop-blur-xl">
              <div className="flex items-start gap-8 mb-10">
                <motion.div
                  whileHover={{ rotateY: 360 }}
                  transition={{ duration: 0.8 }}
                  className="w-20 h-20 rounded-2xl bg-gradient-to-br from-pink-500 to-fuchsia-600 flex items-center justify-center flex-shrink-0 shadow-2xl shadow-pink-500/40"
                  style={{ transformStyle: "preserve-3d" }}
                >
                  <Brain className="w-10 h-10" />
                </motion.div>
                <div>
                  <h3 className="text-4xl font-bold mb-4 bg-gradient-to-r from-white via-pink-100 to-white bg-clip-text text-transparent">
                    The Evaluation Challenge
                  </h3>
                  <p className="text-slate-300 text-xl leading-relaxed">
                    Ensuring consistent, reliable LLM evaluation was our most critical technical challenge
                  </p>
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-8">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="relative pl-6 border-l-4 border-pink-500/50 hover:border-pink-500 transition-colors"
                >
                  <p className="font-bold text-white mb-3 text-lg">The Problem</p>
                  <p className="text-slate-300 leading-relaxed">
                    LLMs can return unstructured text, inconsistent scoring, and unpredictable formats—breaking database storage and analytics pipelines.
                  </p>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="relative pl-6 border-l-4 border-fuchsia-500/50 hover:border-fuchsia-500 transition-colors"
                >
                  <p className="font-bold text-white mb-3 text-lg">The Solution</p>
                  <p className="text-slate-300 leading-relaxed">
                    Strict JSON schema enforcement through few-shot prompting, validation layers, and intelligent retry logic with corrected prompts.
                  </p>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="relative pl-6 border-l-4 border-purple-500/50 hover:border-purple-500 transition-colors"
                >
                  <p className="font-bold text-white mb-3 text-lg">The Impact</p>
                  <p className="text-slate-300 leading-relaxed">
                    Production-ready reliability with deterministic outputs. Recruiters get consistent, queryable data—enabling real analytics.
                  </p>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative py-32 px-6" style={{ zIndex: 10 }}>
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { value: "10x", label: "Faster Evaluations", description: "Than traditional methods" },
              { value: "99.9%", label: "Accuracy Rate", description: "In candidate assessment" },
              { value: "500K+", label: "Interviews Analyzed", description: "Across global teams" },
              { value: "24/7", label: "Available", description: "Always-on AI analysis" },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -8, scale: 1.05 }}
                className="relative group"
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-br from-pink-500/20 to-purple-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  animate={{
                    scale: [1, 1.05, 1],
                  }}
                  transition={{ duration: 3, repeat: Infinity }}
                />
                <div className="relative text-center bg-gradient-to-br from-slate-900/80 to-slate-900/40 border border-pink-500/20 rounded-2xl p-8 backdrop-blur-xl group-hover:border-pink-500/40 transition-all duration-500">
                  <motion.div
                    animate={{
                      scale: [1, 1.1, 1],
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="text-6xl font-bold bg-gradient-to-r from-pink-400 to-fuchsia-400 bg-clip-text text-transparent mb-3"
                  >
                    {stat.value}
                  </motion.div>
                  <div className="text-xl font-semibold text-white mb-2">{stat.label}</div>
                  <div className="text-sm text-slate-400">{stat.description}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative py-40 px-6" style={{ zIndex: 10 }}>
        {/* Radial gradient background */}
        <motion.div
          style={{
            scale: useTransform(scrollYProgress, [0.8, 1], [0.8, 1.3]),
            opacity: useTransform(scrollYProgress, [0.8, 1], [0.3, 0.5]),
          }}
          className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-pink-600/40 via-purple-600/20 to-transparent"
        />

        <div className="max-w-5xl mx-auto text-center relative">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="inline-block px-5 py-2 bg-pink-500/10 border border-pink-500/30 rounded-full mb-8 backdrop-blur-sm"
            >
              <span className="text-pink-400 text-sm font-semibold tracking-wide uppercase">Get Started Today</span>
            </motion.div>

            <h2 className="text-7xl font-bold mb-8 bg-gradient-to-r from-white via-pink-100 to-white bg-clip-text text-transparent leading-tight">
              Transform Your<br />Hiring Process
            </h2>

            <p className="text-xl text-slate-300 mb-12 max-w-2xl mx-auto leading-relaxed">
              Join forward-thinking companies using VeritasAI to make smarter, faster, and more accurate hiring decisions.
            </p>

            <div className="flex gap-6 justify-center flex-wrap">
              <Link href="/auth">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-12 py-6 bg-gradient-to-r from-pink-500 to-fuchsia-600 hover:from-pink-600 hover:to-fuchsia-700 rounded-xl transition-all duration-300 flex items-center gap-3 group shadow-2xl shadow-pink-500/30 font-bold text-xl"
                >
                  Start Free Trial
                  <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                </motion.button>
              </Link>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                className="px-12 py-6 border-2 border-pink-500/30 hover:border-pink-500/60 rounded-xl transition-all duration-300 backdrop-blur-sm hover:bg-pink-500/5 font-bold text-xl"
              >
                Schedule Demo
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
