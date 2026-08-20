"use client";

import Link from "next/link";
import { BookOpen, Sparkles, Trash2, Calendar, ArrowRight } from "lucide-react";
import { JournalEntryDTO } from "@/types";

interface JournalListProps {
  entries: JournalEntryDTO[];
  onDelete?: (id: string) => void;
}

export default function JournalList({ entries, onDelete }: JournalListProps) {
  if (!entries || entries.length === 0) {
    return (
      <div className="glass-panel p-8 rounded-3xl text-center">
        <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center mx-auto mb-3">
          <BookOpen className="w-6 h-6" />
        </div>
        <h3 className="font-semibold text-slate-800 dark:text-slate-200">No Journal Entries Yet</h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs mx-auto mt-1">
          Write down your thoughts above to start building your personal sanctuary of insights.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {entries.map((entry) => {
        const dateStr = new Date(entry.createdAt).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        });

        return (
          <div
            key={entry.id}
            className="glass-panel p-5 sm:p-6 rounded-3xl border border-slate-200 dark:border-slate-800/80 hover:border-indigo-500/30 transition-all group relative overflow-hidden"
          >
            <div className="flex items-start justify-between gap-4 mb-3">
              <div>
                <span className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 mb-1">
                  <Calendar className="w-3.5 h-3.5" />
                  {dateStr}
                </span>
                <h3 className="font-bold text-lg text-slate-900 dark:text-white">
                  {entry.title || "Untitled Reflection"}
                </h3>
              </div>

              <div className="flex items-center gap-2">
                {entry.sentiment && (
                  <span
                    className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border capitalize ${
                      entry.sentiment === "positive"
                        ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                        : entry.sentiment === "negative"
                        ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20"
                        : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700"
                    }`}
                  >
                    {entry.sentiment}
                  </span>
                )}

                {onDelete && (
                  <button
                    onClick={() => onDelete(entry.id)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                    title="Delete reflection"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed line-clamp-3 mb-4 whitespace-pre-wrap">
              {entry.content}
            </p>

            {/* AI Reflection preview */}
            {entry.aiReflection && (
              <div className="p-3.5 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/30 border border-indigo-500/20 text-xs text-indigo-900 dark:text-indigo-200 leading-relaxed">
                <div className="flex items-center gap-1.5 font-semibold text-indigo-600 dark:text-indigo-400 mb-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>EMO Reflection</span>
                </div>
                <p className="italic">&ldquo;{entry.aiReflection}&rdquo;</p>
              </div>
            )}

            <div className="mt-4 pt-3 border-t border-slate-200/60 dark:border-slate-800/60 flex items-center justify-end">
              <Link
                href={`/journal/${entry.id}`}
                className="flex items-center gap-1 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
              >
                View Full Reflection <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        );
      })}
    </div>
  );
}
