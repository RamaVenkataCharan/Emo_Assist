"use client";

import { useEffect, useState } from "react";
import MoodTrendChart from "@/components/dashboard/MoodTrendChart";
import EmotionBreakdown from "@/components/dashboard/EmotionBreakdown";
import Card3D from "@/components/ui/Card3D";
import { AnalyticsSummary } from "@/types";
import {
  Flame,
  Activity,
  Heart,
  BookOpen,
  RefreshCw,
  TrendingUp,
} from "lucide-react";

export default function DashboardPage() {
  const [analytics, setAnalytics] = useState<AnalyticsSummary | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/analytics");
      if (res.ok) {
        const data = await res.json();
        setAnalytics(data);
      }
    } catch (err) {
      console.error("Failed to load analytics:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  return (
    <div className="max-w-6xl mx-auto space-y-8 py-2">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 mb-1">
            <TrendingUp className="w-4 h-4" />
            <span className="text-xs font-bold uppercase tracking-wider">
              Wellness Intelligence
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            Emotional Analytics Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Gain gentle perspective on your emotional rhythms, triggers, and reflection trends.
          </p>
        </div>

        <button
          onClick={fetchAnalytics}
          className="self-start sm:self-auto flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/60 shadow-sm transition-all active:scale-95"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
          Refresh Stats
        </button>
      </div>

      {/* Metric Cards Grid with 3D Tilt */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Streak */}
        <Card3D maxRotation={6} glowColor="rgba(245, 158, 11, 0.25)">
          <div className="glass-panel-3d p-5 rounded-3xl border border-slate-200 dark:border-slate-800/80 flex items-center gap-4 h-full">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center shrink-0 shadow-sm">
              <Flame className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Streak
              </p>
              <h3 className="text-2xl font-black text-slate-900 dark:text-white">
                {analytics?.streakDays || 1} <span className="text-xs font-semibold text-slate-400">days</span>
              </h3>
            </div>
          </div>
        </Card3D>

        {/* Dominant Mood */}
        <Card3D maxRotation={6} glowColor="rgba(20, 184, 166, 0.25)">
          <div className="glass-panel-3d p-5 rounded-3xl border border-slate-200 dark:border-slate-800/80 flex items-center gap-4 h-full">
            <div className="w-12 h-12 rounded-2xl bg-teal-500/10 text-teal-500 flex items-center justify-center shrink-0 shadow-sm">
              <Heart className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Dominant State
              </p>
              <h3 className="text-2xl font-black text-slate-900 dark:text-white">
                {analytics?.dominantMood || "Calm"}
              </h3>
            </div>
          </div>
        </Card3D>

        {/* Avg Intensity */}
        <Card3D maxRotation={6} glowColor="rgba(99, 102, 241, 0.25)">
          <div className="glass-panel-3d p-5 rounded-3xl border border-slate-200 dark:border-slate-800/80 flex items-center gap-4 h-full">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center shrink-0 shadow-sm">
              <Activity className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Avg Intensity
              </p>
              <h3 className="text-2xl font-black text-slate-900 dark:text-white">
                {analytics?.averageIntensity || 5}/10
              </h3>
            </div>
          </div>
        </Card3D>

        {/* Total Reflections */}
        <Card3D maxRotation={6} glowColor="rgba(168, 85, 247, 0.25)">
          <div className="glass-panel-3d p-5 rounded-3xl border border-slate-200 dark:border-slate-800/80 flex items-center gap-4 h-full">
            <div className="w-12 h-12 rounded-2xl bg-purple-500/10 text-purple-500 flex items-center justify-center shrink-0 shadow-sm">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Journals
              </p>
              <h3 className="text-2xl font-black text-slate-900 dark:text-white">
                {analytics?.totalJournals || 0}
              </h3>
            </div>
          </div>
        </Card3D>
      </div>

      {/* Mood Intensity Trend Chart */}
      <div className="glass-panel-3d p-6 sm:p-8 rounded-3xl border border-white/20 dark:border-white/10 shadow-xl">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h2 className="text-lg font-extrabold text-slate-900 dark:text-white">
              Mood Intensity Over Time
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Tracking your emotional fluctuations across recent days
            </p>
          </div>
        </div>

        <MoodTrendChart data={analytics?.recentMoodTrend || []} />
      </div>

      {/* Distributions & Sentiment Breakdown */}
      <EmotionBreakdown
        moodDistribution={analytics?.moodDistribution || []}
        sentimentBreakdown={analytics?.journalSentimentBreakdown || []}
      />
    </div>
  );
}
