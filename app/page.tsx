import Link from "next/link";
import {
  HeartHandshake,
  Sparkles,
  MessageSquareHeart,
  BookOpenText,
  BarChart3,
  ShieldCheck,
  ArrowRight,
  SunMedium,
  CheckCircle2,
} from "lucide-react";

export default function HomePage() {
  return (
    <div className="space-y-16 py-6 sm:py-10">
      {/* Hero Section */}
      <section className="relative text-center max-w-3xl mx-auto space-y-6 pt-4 sm:pt-10">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-600 dark:text-indigo-300 text-xs font-semibold shadow-sm animate-pulse">
          <Sparkles className="w-4 h-4 text-indigo-400" />
          <span>Your Empathetic, Non-Clinical Safe Space</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight">
          A Gentle Companion for Your{" "}
          <span className="bg-gradient-to-r from-indigo-500 via-purple-500 to-teal-400 bg-clip-text text-transparent">
            Emotional Journey
          </span>
        </h1>

        <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
          EMO Assistant helps you pause, notice your emotional patterns, journal with AI-guided reflections, and navigate moments of stress with grounded empathy.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-2">
          <Link
            href="/chat"
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-7 py-3.5 rounded-2xl font-bold text-white bg-gradient-to-r from-indigo-600 via-indigo-500 to-teal-500 hover:opacity-95 shadow-lg shadow-indigo-500/25 active:scale-[0.98] transition-all"
          >
            <MessageSquareHeart className="w-5 h-5" />
            Talk to Companion
          </Link>
          <Link
            href="/mood"
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-7 py-3.5 rounded-2xl font-bold text-slate-700 dark:text-slate-200 bg-white/80 dark:bg-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 shadow-sm active:scale-[0.98] transition-all"
          >
            <Sparkles className="w-5 h-5 text-indigo-500" />
            Daily Mood Check-in
          </Link>
        </div>
      </section>

      {/* Feature Cards Grid */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Feature 1 */}
        <div className="glass-panel p-6 sm:p-7 rounded-3xl border border-slate-200 dark:border-slate-800/80 hover:border-indigo-500/30 transition-all group">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <MessageSquareHeart className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
            Empathetic Companion Chat
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
            Safe, non-judgmental conversations with built-in crisis safety screening and Web Speech voice interaction.
          </p>
          <Link
            href="/chat"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
          >
            Start Chatting <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Feature 2 */}
        <div className="glass-panel p-6 sm:p-7 rounded-3xl border border-slate-200 dark:border-slate-800/80 hover:border-teal-500/30 transition-all group">
          <div className="w-12 h-12 rounded-2xl bg-teal-500/10 text-teal-500 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <Sparkles className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
            Mood & Emotion Tracking
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
            Log daily feelings on a 1-10 intensity scale with contextual triggers like work, sleep, and mindfulness.
          </p>
          <Link
            href="/mood"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-teal-600 dark:text-teal-400 hover:underline"
          >
            Check-in Now <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Feature 3 */}
        <div className="glass-panel p-6 sm:p-7 rounded-3xl border border-slate-200 dark:border-slate-800/80 hover:border-purple-500/30 transition-all group">
          <div className="w-12 h-12 rounded-2xl bg-purple-500/10 text-purple-500 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <BookOpenText className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
            Journal & AI Reflections
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
            Write uninhibited entries and receive validating, strength-focused AI reflections that highlight your growth.
          </p>
          <Link
            href="/journal"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-purple-600 dark:text-purple-400 hover:underline"
          >
            Write Entry <ArrowRight className="w-3.5 h-3.5" />
          </Link>
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
