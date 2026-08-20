"use client";

import { useEffect, useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface MoodTrendChartProps {
  data: { date: string; time?: string; intensity: number; mood: string }[];
}

export default function MoodTrendChart({ data }: MoodTrendChartProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="h-64 w-full flex items-center justify-center text-slate-400 text-sm">Loading trend visualization...</div>;
  }

  if (!data || data.length === 0) {
    return (
      <div className="h-64 w-full flex flex-col items-center justify-center text-slate-400 text-sm">
        <p>No mood trend data yet.</p>
        <p className="text-xs text-slate-500 mt-1">Log check-ins across multiple days to see your emotional curve.</p>
      </div>
    );
  }

  return (
    <div className="h-72 w-full pt-4">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="intensityGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
              <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(156, 163, 175, 0.15)" />
          <XAxis
            dataKey="date"
            stroke="#94a3b8"
            fontSize={11}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            domain={[1, 10]}
            stroke="#94a3b8"
            fontSize={11}
            tickLine={false}
            axisLine={false}
            ticks={[1, 3, 5, 7, 10]}
          />
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const item = payload[0].payload;
                return (
                  <div className="p-3 bg-slate-900/95 border border-slate-700 rounded-xl shadow-xl text-xs text-white">
                    <p className="font-bold text-indigo-300">{item.mood}</p>
                    <p className="text-slate-300">Intensity: <span className="font-semibold text-white">{item.intensity}/10</span></p>
                    <p className="text-slate-400 text-[10px] mt-1">{item.date} {item.time || ""}</p>
                  </div>
                );
              }
              return null;
            }}
          />
          <Area
            type="monotone"
            dataKey="intensity"
            stroke="#6366f1"
            strokeWidth={3}
            fillOpacity={1}
            fill="url(#intensityGradient)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
