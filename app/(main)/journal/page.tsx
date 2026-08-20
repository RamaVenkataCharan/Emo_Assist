"use client";

import { useState, useEffect } from "react";
import JournalEditor from "@/components/journal/JournalEditor";
import JournalList from "@/components/journal/JournalList";
import { JournalEntryDTO } from "@/types";
import { BookMarked, RefreshCw } from "lucide-react";

export default function JournalPage() {
  const [entries, setEntries] = useState<JournalEntryDTO[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchJournals = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/journal");
      if (res.ok) {
        const data = await res.json();
        setEntries(data.journalEntries || []);
      }
    } catch (err) {
      console.error("Failed to load journals:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJournals();
  }, []);

  const handleEntryCreated = (newEntry: JournalEntryDTO) => {
    setEntries((prev) => [newEntry, ...prev]);
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/journal/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setEntries((prev) => prev.filter((e) => e.id !== id));
      }
    } catch (err) {
      console.error("Failed to delete journal:", err);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-10 py-2">
      {/* Journal Editor */}
      <section>
        <JournalEditor onEntryCreated={handleEntryCreated} />
      </section>

      {/* Journal Entry Feed */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookMarked className="w-5 h-5 text-indigo-500" />
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">Past Reflections</h3>
          </div>
          <button
            onClick={fetchJournals}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Refresh entries"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>
        </div>

        <JournalList entries={entries} onDelete={handleDelete} />
      </section>
    </div>
  );
}
