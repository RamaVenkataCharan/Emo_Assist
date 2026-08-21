"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Sparkles,
  MessageSquareHeart,
  BookOpenText,
  ShieldCheck,
  ArrowRight,
  Wind,
  Layers,
  HeartHandshake,
  Compass,
  Activity,
  SmilePlus,
} from "lucide-react";
import EmotionSphere3D, { EmotionMood } from "@/components/three/EmotionSphere3D";
import Card3D from "@/components/ui/Card3D";
import { useBreathingSpace } from "@/components/three/BreathingContext";

const HERO_MOOD_PRESETS: { mood: EmotionMood; label: string; emoji: string; bg: string }[] = [
  { mood: "Calm", label: "Calm", emoji: "🌿", bg: "hover:border-cyan-500/50" },
  { mood: "Joyful", label: "Joyful", emoji: "😊", bg: "hover:border-amber-500/50" },
  { mood: "Hopeful", label: "Hopeful", emoji: "✨", bg: "hover:border-sky-500/50" },
  { mood: "Grateful", label: "Grateful", emoji: "🌸", bg: "hover:border-emerald-500/50" },
  { mood: "Anxious", label: "Anxious", emoji: "⚡", bg: "hover:border-orange-500/50" },
  { mood: "Low", label: "Low", emoji: "🌧️", bg: "hover:border-indigo-500/50" },
];

export default function HomePage() {
  const [activeMood, setActiveMood] = useState<EmotionMood>("Calm");
  const [activeIntensity, setActiveIntensity] = useState<number>(6);
  const { openBreathing } = useBreathingSpace();

  return (
    <div className="space-y-20 py-4 sm:py-8">
      {/* 3D Hero Section */}
      <section className="relative pt-4 sm:pt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Hero Copy */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-600 dark:text-indigo-300 text-xs font-bold shadow-sm">
              <Sparkles className="w-4 h-4 text-indigo-400 animate-spin [animation-duration:8s]" />
              <span>Immersive 3D Emotional Sanctuary & Companion</span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-slate-900 dark:text-white leading-[1.12]">
              A Living 3D Space for Your{" "}
              <span className="bg-gradient-to-r from-indigo-500 via-purple-500 to-teal-400 bg-clip-text text-transparent">
                Emotional Balance
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-xl mx-auto lg:mx-0 leading-relaxed">
              EMO Assistant helps you pause, notice internal states with real-time 3D sensory feedback, reflect with empathetic AI guidance, and recalibrate your nervous system.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3.5 pt-2">
              <Link
                href="/chat"
                className="flex items-center justify-center gap-2 px-7 py-3.5 rounded-2xl font-bold text-white bg-gradient-to-r from-indigo-600 via-indigo-500 to-teal-500 hover:opacity-95 shadow-xl shadow-indigo-500/25 active:scale-[0.98] transition-all"
              >
                <MessageSquareHeart className="w-5 h-5" />
                Talk to Companion
              </Link>
              
              <button
                onClick={openBreathing}
                className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl font-bold text-teal-700 dark:text-teal-300 bg-teal-500/10 hover:bg-teal-500/20 border border-teal-500/30 hover:border-teal-500/50 shadow-sm active:scale-[0.98] transition-all"
              >
                <Wind className="w-5 h-5 text-teal-400" />
                3D Breathing
              </button>

              <Link
                href="/mood"
                className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl font-bold text-slate-700 dark:text-slate-200 bg-white/80 dark:bg-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 shadow-sm active:scale-[0.98] transition-all"
              >
                <SmilePlus className="w-5 h-5 text-indigo-500" />
                Mood Check-in
              </Link>
            </div>
          </div>

          {/* 3D Living Emotion Sphere Playground */}
          <div className="lg:col-span-5 flex flex-col items-center">
            <div className="w-full max-w-md glass-panel-3d p-5 rounded-3xl border border-white/20 dark:border-white/10 shadow-2xl relative">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5" />
                  3D Living Emotion Orb
                </span>
                <span className="text-[11px] font-semibold text-slate-400 bg-white/40 dark:bg-slate-900/40 px-2 py-0.5 rounded-full">
                  Interactive WebGL
                </span>
              </div>

              {/* 3D WebGL Canvas */}
              <div className="w-full h-72 sm:h-80 relative flex items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-b from-indigo-950/20 to-slate-950/40">
                <EmotionSphere3D mood={activeMood} intensity={activeIntensity} />
                
                <div className="absolute bottom-2 left-3 right-3 text-center pointer-events-none">
                  <span className="text-[10px] uppercase font-semibold tracking-widest text-slate-400 dark:text-slate-500 bg-black/40 px-2.5 py-1 rounded-full backdrop-blur-sm">
                    Drag orb to rotate • Live fluid deformation
                  </span>
                </div>
              </div>

              {/* Interactive Mood Selector Pills */}
              <div className="mt-4 space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-semibold">
                  <span>Simulate Feeling State:</span>
                  <span className="text-indigo-600 dark:text-indigo-400 font-bold">{activeMood}</span>
                </div>
                <div className="grid grid-cols-3 gap-1.5">
                  {HERO_MOOD_PRESETS.map((preset) => (
                    <button
                      key={preset.mood}
                      onClick={() => setActiveMood(preset.mood)}
                      className={`flex items-center justify-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold transition-all border ${
                        activeMood === preset.mood
                          ? "bg-indigo-600 text-white border-indigo-500 shadow-md shadow-indigo-500/20 scale-[1.02]"
                          : `bg-white/60 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 border-slate-200/80 dark:border-slate-700/60 ${preset.bg}`
                      }`}
                    >
                      <span>{preset.emoji}</span>
                      <span>{preset.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3D Tilt Feature Cards Grid */}
      <section className="space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            Designed for Depth, Calm & Clarity
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            A comprehensive suite of mindful tools enhanced with sensory 3D feedback and thoughtful safety boundaries.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
          {/* Card 1: 3D Companion Chat */}
          <Card3D maxRotation={8} glowColor="rgba(99, 102, 241, 0.25)">
            <div className="glass-panel-3d p-6 sm:p-7 rounded-3xl border border-slate-200 dark:border-slate-800/80 h-full flex flex-col justify-between group">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <MessageSquareHeart className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                  Empathetic Companion Chat
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                  Safe, non-judgmental conversations with 3D companion holographic feedback, crisis screening, and Web Speech voice input.
                </p>
              </div>
              <Link
                href="/chat"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline pt-2"
              >
                Start Chatting <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </Card3D>

          {/* Card 2: 3D Mood Crystal Tracking */}
          <Card3D maxRotation={8} glowColor="rgba(20, 184, 166, 0.25)">
            <div className="glass-panel-3d p-6 sm:p-7 rounded-3xl border border-slate-200 dark:border-slate-800/80 h-full flex flex-col justify-between group">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-teal-500/10 text-teal-500 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Sparkles className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                  3D Mood Crystal Tracking
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                  Log feelings with a live 3D Crystal visualizer that morphs geometry, luminescence, and rotation with intensity.
                </p>
              </div>
              <Link
                href="/mood"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-teal-600 dark:text-teal-400 hover:underline pt-2"
              >
                Check-in Now <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </Card3D>

          {/* Card 3: 3D Mindful Sanctuary & Journal */}
          <Card3D maxRotation={8} glowColor="rgba(168, 85, 247, 0.25)">
            <div className="glass-panel-3d p-6 sm:p-7 rounded-3xl border border-slate-200 dark:border-slate-800/80 h-full flex flex-col justify-between group">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-purple-500/10 text-purple-500 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <BookOpenText className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                  Journal & AI Reflections
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                  Free-write uninhibited thoughts and receive validating, strength-focused AI reflections celebrating your resilience.
                </p>
              </div>
              <Link
                href="/journal"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-purple-600 dark:text-purple-400 hover:underline pt-2"
              >
                Write Entry <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </Card3D>
        </div>
      </section>

      {/* 3D Mindful Sanctuary Quick-Launch Banner */}
      <section className="glass-panel-3d p-8 sm:p-10 rounded-3xl border border-teal-500/30 bg-gradient-to-r from-teal-950/20 via-indigo-950/30 to-purple-950/20 relative overflow-hidden">
        <div className="max-w-3xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6 relative z-10 text-center sm:text-left">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-500/10 text-teal-400 text-xs font-bold">
              <Wind className="w-3.5 h-3.5" />
              Mindful Breathing Sanctuary
            </div>
            <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
              Feeling overwhelmed or stressed?
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-md">
              Take 2 minutes for guided Box Breathing with 3D celestial sphere expansion and soft soothing chimes.
            </p>
          </div>

          <button
            onClick={openBreathing}
            className="px-6 py-3.5 rounded-2xl font-bold text-white bg-gradient-to-r from-teal-500 to-indigo-600 hover:opacity-95 shadow-lg shadow-teal-500/25 active:scale-95 transition-all shrink-0 flex items-center gap-2"
          >
            <Wind className="w-5 h-5" />
            Start 3D Session
          </button>
        </div>
      </section>

      {/* Safety & Non-Clinical Boundaries Pledge */}
      <section className="glass-panel p-8 sm:p-10 rounded-3xl border border-slate-200 dark:border-slate-800/80 bg-gradient-to-br from-indigo-950/20 via-slate-900/30 to-teal-950/20">
        <div className="max-w-3xl mx-auto text-center space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center mx-auto">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            Built with Safety & Boundaries at the Core
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            EMO Assistant is designed strictly as an emotional self-care tool. It never offers medical diagnosis, never fosters artificial dependency, and includes instant 24/7 crisis safety screening with immediate access to trained human hotlines (988).
          </p>
        </div>
      </section>
    </div>
  );
}
