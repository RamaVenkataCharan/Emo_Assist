"use client";

import { useState } from "react";
import { BookOpen, Sparkles, Lightbulb } from "lucide-react";
import { JournalEntryDTO } from "@/types";

interface JournalEditorProps {
  onEntryCreated?: (entry: JournalEntryDTO) => void;
}

const INSPIRATIONAL_PROMPTS = [
  "What is one thing that brought a small sense of relief or peace today?",
  "What heavy thought can I give myself permission to release right now?",
  "How did my body feel when I was stressed today, and what soothed it?",
  "What is something I'm learning to accept about myself?",
];

export default function JournalEditor({ onEntryCreated }: JournalEditorProps) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lastCreated, setLastCreated] = useState<JournalEntryDTO | null>(null);

  const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/journal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim() || undefined,
          content: content.trim(),
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setLastCreated(data.journalEntry);
        setTitle("");
        setContent("");
        if (onEntryCreated) onEntryCreated(data.journalEntry);
      }
    } catch (err) {
      console.error("Failed to save journal:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const applyPrompt = (prompt: string) => {
    setTitle(prompt);
    setContent((prev) => (prev ? `${prev}\n\n` : ""));
  };

  return (
    <div className="space-y-6">
      {/* Editor Box */}
      <div className="glass-panel-3d p-6 sm:p-8 rounded-3xl shadow-2xl border border-white/20 dark:border-white/10">
        <div className="flex items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center shadow-sm">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">Mindful Journaling</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Write freely. EMO Assistant will generate a gentle, validating reflection.
              </p>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-2 text-xs text-slate-400 font-semibold bg-white/40 dark:bg-slate-800/40 px-3 py-1 rounded-full border border-white/10">
            <span>{wordCount} words</span>
          </div>
        </div>

        {/* Prompt Suggestions */}
        <div className="mb-5 p-3.5 rounded-2xl bg-slate-100/70 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-600 dark:text-indigo-400 mb-2">
            <Lightbulb className="w-3.5 h-3.5" />
            <span>Need inspiration? Click a reflective prompt:</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {INSPIRATIONAL_PROMPTS.map((prompt, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => applyPrompt(prompt)}
                className="text-left text-xs p-2.5 rounded-xl bg-white dark:bg-slate-800/80 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 text-slate-700 dark:text-slate-300 border border-slate-200/80 dark:border-slate-700/60 transition-all font-medium hover:scale-[1.01]"
              >
                &ldquo;{prompt}&rdquo;
              </button>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Title of this reflection (e.g. A Quiet Morning, Letting Go)"
              className="w-full px-4 py-3.5 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 text-sm font-semibold text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
            />
          </div>

          <div>
            <textarea
              rows={6}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Pour out your thoughts, emotions, challenges, or gratitude..."
              className="w-full p-4 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 leading-relaxed transition-all"
            />
          </div>

          <div className="flex items-center justify-between pt-2">
            <span className="sm:hidden text-xs text-slate-400 font-medium">{wordCount} words</span>
            <button
              type="submit"
              disabled={isSubmitting || !content.trim()}
              className="ml-auto flex items-center gap-2 py-3.5 px-7 rounded-2xl font-bold text-white bg-gradient-to-r from-indigo-600 via-indigo-500 to-teal-500 hover:opacity-95 shadow-xl shadow-indigo-500/25 active:scale-[0.99] transition-all disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4" />
              {isSubmitting ? "Generating AI Reflection..." : "Save & Reflect"}
            </button>
          </div>
        </form>
      </div>

      {/* Instant Reflection Display Card if just created */}
      {lastCreated && lastCreated.aiReflection && (
        <div className="glass-panel-3d p-6 sm:p-7 rounded-3xl border border-teal-500/40 bg-teal-950/30 shadow-2xl animate-in slide-in-from-top-4 duration-300">
          <div className="flex items-center gap-2 text-teal-400 font-bold text-sm mb-2">
            <Sparkles className="w-4 h-4 text-teal-400 animate-pulse" />
            <span>AI Companion Reflection</span>
          </div>
          <p className="text-sm leading-relaxed text-slate-800 dark:text-teal-100 italic">
            &ldquo;{lastCreated.aiReflection}&rdquo;
          </p>
          {lastCreated.sentiment && (
            <div className="mt-3 flex items-center gap-2">
              <span className="text-[11px] font-medium text-slate-400">
                Emotional Tone:
              </span>
              <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/30 capitalize">
                {lastCreated.sentiment}
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
