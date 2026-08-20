"use client";

import { useState, useEffect } from "react";
import MoodSelector from "@/components/mood/MoodSelector";
import MoodHistoryCard from "@/components/mood/MoodHistoryCard";
import { MoodEntryDTO } from "@/types";
import { RefreshCw, History, CalendarDays } from "lucide-react";

export default function MoodPage() {
  const [entries, setEntries] = useState<MoodEntryDTO[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMoodEntries = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/mood");
      if (res.ok) {
        const data = await res.json();
        setEntries(data.moodEntries || []);
      }
    } catch (err) {
      console.error("Failed to load mood entries:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMoodEntries();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/mood?id=${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setEntries((prev) => prev.filter((e) => e.id !== id));
      }
    } catch (err) {
      console.error("Failed to delete entry:", err);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-10 py-2">
      {/* Mood Selector / Check-in */}
      <section>
        <MoodSelector onSuccess={fetchMoodEntries} />
      </section>

      {/* Mood History Log */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <History className="w-5 h-5 text-indigo-500" />
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">Recent Check-in History</h3>
          </div>
          <button
            onClick={fetchMoodEntries}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Refresh history"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>
        </div>

        <MoodHistoryCard entries={entries} onDelete={handleDelete} />
      </section>
    </div>
  );
}
