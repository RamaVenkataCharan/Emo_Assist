"use client";

import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie,
} from "recharts";

interface EmotionBreakdownProps {
  moodDistribution: { name: string; count: number; color: string }[];
  sentimentBreakdown: { sentiment: string; count: number }[];
}

const SENTIMENT_COLORS: Record<string, string> = {
  Positive: "#10b981",
  Neutral: "#6b7280",
  Negative: "#f59e0b",
  Mixed: "#8b5cf6",
};

export default function EmotionBreakdown({
  moodDistribution,
  sentimentBreakdown,
}: EmotionBreakdownProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="h-64 w-full flex items-center justify-center text-slate-400 text-sm">Loading charts...</div>;
  }

  const hasMoods = moodDistribution && moodDistribution.length > 0;
  const hasSentiment = sentimentBreakdown && sentimentBreakdown.some((s) => s.count > 0);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Mood Distribution */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-200 dark:border-slate-800">
        <h3 className="font-bold text-base text-slate-900 dark:text-white mb-1">
          Emotion Frequency
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
          Breakdown of logged emotional check-ins
        </p>

        {hasMoods ? (
          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={moodDistribution}
                margin={{ top: 10, right: 10, left: -20, bottom: 20 }}
              >
                <XAxis
                  dataKey="name"
                  stroke="#94a3b8"
                  fontSize={10}
                  interval={0}
                  angle={-25}
                  textAnchor="end"
                />
                <YAxis
                  stroke="#94a3b8"
                  fontSize={11}
                  allowDecimals={false}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const item = payload[0].payload;
                      return (
                        <div className="p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white">
                          <span className="font-bold">{item.name}: </span>
                          <span>{item.count} check-ins</span>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                  {moodDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="h-60 flex items-center justify-center text-slate-400 text-xs">
            No emotion frequency recorded yet.
          </div>
        )}
      </div>

      {/* Journal Sentiment Breakdown */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-200 dark:border-slate-800">
        <h3 className="font-bold text-base text-slate-900 dark:text-white mb-1">
          Journal Sentiment Balance
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
          Tone analyzed across your reflection entries
        </p>

        {hasSentiment ? (
          <div className="h-60 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={sentimentBreakdown.filter((s) => s.count > 0)}
                  dataKey="count"
                  nameKey="sentiment"
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={4}
                  label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                  labelLine={false}
                >
                  {sentimentBreakdown.map((entry, index) => (
                    <Cell
                      key={`sentiment-cell-${index}`}
                      fill={SENTIMENT_COLORS[entry.sentiment] || "#6366f1"}
                    />
                  ))}
                </Pie>
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const item = payload[0].payload;
                      return (
                        <div className="p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white">
                          <span className="font-bold">{item.sentiment}: </span>
                          <span>{item.count} entries</span>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="h-60 flex items-center justify-center text-slate-400 text-xs">
            Write journal reflections to view sentiment distributions.
          </div>
        )}
      </div>
    </div>
  );
}
