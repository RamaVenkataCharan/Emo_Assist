"use client";

import { Trash2, Calendar, Clock, Activity } from "lucide-react";
import { MoodEntryDTO } from "@/types";

const MOOD_EMOJIS: Record<string, string> = {
  Calm: "🌿",
  Joyful: "😊",
  Grateful: "🌸",
  Hopeful: "✨",
  Neutral: "😐",
  Anxious: "⚡",
  Overwhelmed: "🌊",
  Low: "🌧️",
  Exhausted: "🌙",
  Irritable: "🔥",
};

interface MoodHistoryCardProps {
  entries: MoodEntryDTO[];
  onDelete?: (id: string) => void;
}

export default function MoodHistoryCard({
  entries,
  onDelete,
}: MoodHistoryCardProps) {
  if (!entries || entries.length === 0) {
    return (
      <div className="glass-panel p-8 rounded-3xl text-center">
        <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center mx-auto mb-3">
          <Calendar className="w-6 h-6" />
        </div>
        <h3 className="font-semibold text-slate-800 dark:text-slate-200">No Mood Logs Yet</h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs mx-auto mt-1">
          Complete your first check-in above to start tracking patterns over time.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {entries.map((entry) => {
        const dateObj = new Date(entry.createdAt);
        const dateStr = dateObj.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          weekday: "short",
        });
        const timeStr = dateObj.toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "2-digit",
        });

        const emoji = MOOD_EMOJIS[entry.mood] || "✨";

        return (
          <div
            key={entry.id}
            className="glass-panel p-4 rounded-2xl border border-slate-200 dark:border-slate-800/80 hover:border-indigo-500/40 transition-all group flex flex-col sm:flex-row sm:items-center justify-between gap-4"
          >
            <div className="flex items-start gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800/80 flex items-center justify-center text-2xl shrink-0 shadow-inner">
                {emoji}
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h4 className="font-bold text-slate-900 dark:text-white text-base">
                    {entry.mood}
                  </h4>
                  <span className="flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-md bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
                    <Activity className="w-3 h-3" />
                    Level {entry.intensity}/10
                  </span>
                </div>

                {entry.note && (
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1 italic">
                    &ldquo;{entry.note}&rdquo;
                  </p>
                )}

                {entry.tags && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {entry.tags.split(",").map((t, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                      >
                        #{t.trim()}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between sm:justify-end gap-3 sm:border-l sm:border-slate-200 dark:sm:border-slate-800 sm:pl-4">
              <div className="text-left sm:text-right">
                <div className="flex items-center sm:justify-end gap-1 text-xs text-slate-500 dark:text-slate-400">
                  <Calendar className="w-3 h-3" />
                  {dateStr}
                </div>
                <div className="flex items-center sm:justify-end gap-1 text-[11px] text-slate-400 mt-0.5">
                  <Clock className="w-3 h-3" />
                  {timeStr}
                </div>
              </div>

              {onDelete && (
                <button
                  onClick={() => onDelete(entry.id)}
                  className="opacity-60 group-hover:opacity-100 p-2 rounded-xl text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-all"
                  title="Delete entry"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
