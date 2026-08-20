"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Sparkles, Calendar, Trash2, HeartHandshake } from "lucide-react";
import { JournalEntryDTO } from "@/types";

export default function SingleJournalPage() {
  const params = useParams();
  const router = useRouter();
  const [entry, setEntry] = useState<JournalEntryDTO | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!params?.id) return;
    const fetchEntry = async () => {
      try {
        const res = await fetch(`/api/journal/${params.id}`);
        if (res.ok) {
          const data = await res.json();
          setEntry(data.journalEntry);
        }
      } catch (err) {
        console.error("Failed to load journal entry:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchEntry();
  }, [params?.id]);

  const handleDelete = async () => {
    if (!entry) return;
    if (!confirm("Are you sure you want to delete this reflection?")) return;

    try {
      const res = await fetch(`/api/journal/${entry.id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        router.push("/journal");
      }
    } catch (err) {
      console.error("Failed to delete entry:", err);
    }
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto py-12 text-center text-slate-400 text-sm">
        Loading reflection...
      </div>
    );
  }

  if (!entry) {
    return (
      <div className="max-w-3xl mx-auto py-12 text-center space-y-4">
        <p className="text-slate-400">Entry not found.</p>
        <Link
          href="/journal"
          className="inline-flex items-center gap-2 text-sm text-indigo-500 font-semibold hover:underline"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Journal
        </Link>
      </div>
    );
  }

  const dateStr = new Date(entry.createdAt).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="max-w-3xl mx-auto py-4 space-y-6">
      {/* Top navigation */}
      <div className="flex items-center justify-between">
        <Link
          href="/journal"
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Journal
        </Link>

        <button
          onClick={handleDelete}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
        >
          <Trash2 className="w-4 h-4" /> Delete
        </button>
      </div>

      {/* Main Card */}
      <article className="glass-panel p-6 sm:p-10 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-6 shadow-xl">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-2">
            <Calendar className="w-3.5 h-3.5" />
            <span>{dateStr}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            {entry.title || "Untitled Reflection"}
          </h1>
        </div>

        {entry.sentiment && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500">Detected Tone:</span>
            <span className="text-xs font-semibold px-3 py-0.5 rounded-full bg-teal-500/10 text-teal-600 dark:text-teal-400 border border-teal-500/20 capitalize">
              {entry.sentiment}
            </span>
          </div>
        )}

        <div className="text-base text-slate-700 dark:text-slate-200 leading-relaxed whitespace-pre-wrap">
          {entry.content}
        </div>

        {/* AI Reflection Card */}
        {entry.aiReflection && (
          <div className="mt-8 p-6 rounded-3xl bg-indigo-950/20 dark:bg-indigo-950/40 border border-indigo-500/30 text-indigo-900 dark:text-indigo-200 space-y-2">
            <div className="flex items-center gap-2 font-bold text-sm text-indigo-600 dark:text-indigo-400">
              <Sparkles className="w-4 h-4 text-indigo-400" />
              <span>EMO Assistant Reflection & Insight</span>
            </div>
            <p className="text-sm leading-relaxed italic">
              &ldquo;{entry.aiReflection}&rdquo;
            </p>
          </div>
        )}
      </article>
    </div>
  );
}
