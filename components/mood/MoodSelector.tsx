"use client";

import { useState } from "react";
import { Sparkles, Send, CheckCircle2, Tag, Compass, Activity } from "lucide-react";
import { MoodType } from "@/types";
import MoodCrystal3D from "@/components/three/MoodCrystal3D";

interface MoodOption {
  type: MoodType;
  emoji: string;
  label: string;
  color: string;
  bgLight: string;
  borderClass: string;
  activeClass: string;
}

const MOOD_OPTIONS: MoodOption[] = [
  { type: "Calm", emoji: "🌿", label: "Calm", color: "#3b82f6", bgLight: "bg-blue-50 dark:bg-blue-950/30", borderClass: "border-blue-200 dark:border-blue-800", activeClass: "ring-2 ring-blue-500 bg-blue-100 dark:bg-blue-900/50" },
  { type: "Joyful", emoji: "😊", label: "Joyful", color: "#10b981", bgLight: "bg-emerald-50 dark:bg-emerald-950/30", borderClass: "border-emerald-200 dark:border-emerald-800", activeClass: "ring-2 ring-emerald-500 bg-emerald-100 dark:bg-emerald-900/50" },
  { type: "Grateful", emoji: "🌸", label: "Grateful", color: "#059669", bgLight: "bg-teal-50 dark:bg-teal-950/30", borderClass: "border-teal-200 dark:border-teal-800", activeClass: "ring-2 ring-teal-500 bg-teal-100 dark:bg-teal-900/50" },
  { type: "Hopeful", emoji: "✨", label: "Hopeful", color: "#06b6d4", bgLight: "bg-cyan-50 dark:bg-cyan-950/30", borderClass: "border-cyan-200 dark:border-cyan-800", activeClass: "ring-2 ring-cyan-500 bg-cyan-100 dark:bg-cyan-900/50" },
  { type: "Neutral", emoji: "😐", label: "Neutral", color: "#6b7280", bgLight: "bg-slate-50 dark:bg-slate-900/40", borderClass: "border-slate-200 dark:border-slate-700", activeClass: "ring-2 ring-slate-400 bg-slate-200 dark:bg-slate-800" },
  { type: "Anxious", emoji: "⚡", label: "Anxious", color: "#f59e0b", bgLight: "bg-amber-50 dark:bg-amber-950/30", borderClass: "border-amber-200 dark:border-amber-800", activeClass: "ring-2 ring-amber-500 bg-amber-100 dark:bg-amber-900/50" },
  { type: "Overwhelmed", emoji: "🌊", label: "Overwhelmed", color: "#ef4444", bgLight: "bg-rose-50 dark:bg-rose-950/30", borderClass: "border-rose-200 dark:border-rose-800", activeClass: "ring-2 ring-rose-500 bg-rose-100 dark:bg-rose-900/50" },
  { type: "Low", emoji: "🌧️", label: "Low", color: "#6366f1", bgLight: "bg-indigo-50 dark:bg-indigo-950/30", borderClass: "border-indigo-200 dark:border-indigo-800", activeClass: "ring-2 ring-indigo-500 bg-indigo-100 dark:bg-indigo-900/50" },
  { type: "Exhausted", emoji: "🌙", label: "Exhausted", color: "#8b5cf6", bgLight: "bg-purple-50 dark:bg-purple-950/30", borderClass: "border-purple-200 dark:border-purple-800", activeClass: "ring-2 ring-purple-500 bg-purple-100 dark:bg-purple-900/50" },
  { type: "Irritable", emoji: "🔥", label: "Irritable", color: "#f97316", bgLight: "bg-orange-50 dark:bg-orange-950/30", borderClass: "border-orange-200 dark:border-orange-800", activeClass: "ring-2 ring-orange-500 bg-orange-100 dark:bg-orange-900/50" },
];

const SUGGESTED_TAGS = [
  "Work", "Sleep", "Family", "Health", "Social", "Exercise", "Mindfulness", "Weather", "Relationships", "Hobbies"
];

interface MoodSelectorProps {
  onSuccess?: () => void;
}

export default function MoodSelector({ onSuccess }: MoodSelectorProps) {
  const [selectedMood, setSelectedMood] = useState<MoodType>("Calm");
  const [intensity, setIntensity] = useState<number>(6);
  const [note, setNote] = useState<string>("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitted, setSubmitted] = useState<boolean>(false);

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/mood", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mood: selectedMood,
          intensity,
          note,
          tags: selectedTags.join(", "),
        }),
      });

      if (res.ok) {
        setSubmitted(true);
        setNote("");
        setSelectedTags([]);
        if (onSuccess) onSuccess();
        setTimeout(() => setSubmitted(false), 3000);
      }
    } catch (err) {
      console.error("Failed to submit mood:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="glass-panel-3d p-6 sm:p-8 rounded-3xl shadow-2xl relative overflow-hidden border border-white/20 dark:border-white/10">
      {submitted && (
        <div className="absolute inset-0 bg-emerald-950/95 backdrop-blur-md z-30 flex flex-col items-center justify-center text-center p-6 animate-in fade-in duration-300">
          <CheckCircle2 className="w-16 h-16 text-emerald-400 mb-3 animate-bounce" />
          <h3 className="text-xl font-bold text-white mb-1">Check-in Logged!</h3>
          <p className="text-sm text-emerald-200 max-w-sm">
            Thank you for checking in with yourself. Noticing your feelings is the first step toward balance.
          </p>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1 text-indigo-600 dark:text-indigo-400">
            <Sparkles className="w-4 h-4 animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-wider">Mindful Moment</span>
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">
            How are you feeling right now?
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Select what best matches your internal state. Watch your 3D crystal transform in real time.
          </p>
        </div>

        {/* 3D Crystal Visualizer Preview */}
        <div className="flex items-center gap-3 p-2.5 rounded-2xl bg-black/10 dark:bg-black/30 backdrop-blur-md border border-white/10 shrink-0 self-start sm:self-auto">
          <MoodCrystal3D mood={selectedMood} intensity={intensity} size={70} />
          <div className="pr-2">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">3D Crystal State</span>
            <span className="text-xs font-bold text-indigo-600 dark:text-indigo-300 block">{selectedMood}</span>
            <span className="text-[11px] text-slate-500 dark:text-slate-400">Lvl {intensity}/10</span>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Mood Grid */}
        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-3 flex items-center gap-1.5">
            <Compass className="w-3.5 h-3.5 text-indigo-500" />
            Primary Emotion
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
            {MOOD_OPTIONS.map((option) => {
              const isSelected = selectedMood === option.type;
              return (
                <button
                  key={option.type}
                  type="button"
                  onClick={() => setSelectedMood(option.type)}
                  className={`flex items-center sm:flex-col justify-start sm:justify-center gap-2 p-3 rounded-2xl border transition-all duration-200 text-left sm:text-center ${
                    option.bgLight
                  } ${option.borderClass} ${
                    isSelected
                      ? `${option.activeClass} shadow-lg scale-[1.03] font-bold`
                      : "hover:scale-[1.01] opacity-75 hover:opacity-100"
                  }`}
                >
                  <span className="text-2xl sm:text-3xl">{option.emoji}</span>
                  <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                    {option.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Intensity Slider */}
        <div className="p-4 sm:p-5 rounded-2xl bg-slate-100/70 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800/80">
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-teal-500" />
              Intensity: <span className="text-indigo-600 dark:text-indigo-400 font-bold text-sm">{intensity}/10</span>
            </label>
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              {intensity <= 3 ? "Mild & Gentle" : intensity <= 7 ? "Moderate" : "Very Strong"}
            </span>
          </div>
          <input
            type="range"
            min="1"
            max="10"
            value={intensity}
            onChange={(e) => setIntensity(Number(e.target.value))}
            className="w-full h-2.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-600"
          />
          <div className="flex justify-between text-[10px] text-slate-400 mt-1.5 px-1 font-medium">
            <span>1 (Barely noticeable)</span>
            <span>5 (Balanced)</span>
            <span>10 (Overwhelming)</span>
          </div>
        </div>

        {/* Context Tags */}
        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <Tag className="w-3.5 h-3.5 text-indigo-500" />
            What&apos;s influencing this? (Optional)
          </label>
          <div className="flex flex-wrap gap-1.5">
            {SUGGESTED_TAGS.map((tag) => {
              const isSelected = selectedTags.includes(tag);
              return (
                <button
                  key={tag}
                  type="button"
                  onClick={() => toggleTag(tag)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                    isSelected
                      ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/25 scale-105"
                      : "bg-white dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700/60"
                  }`}
                >
                  {isSelected ? `✓ ${tag}` : `+ ${tag}`}
                </button>
              );
            })}
          </div>
        </div>

        {/* Reflection Note */}
        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
            Add a quick reflection note (Optional)
          </label>
          <textarea
            rows={2}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="What's on your mind? Any triggers, thoughts, or reflections..."
            className="w-full px-4 py-3 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800 dark:text-slate-200 placeholder-slate-400 transition-all"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full flex items-center justify-center gap-2 py-4 px-6 rounded-2xl font-bold text-white bg-gradient-to-r from-indigo-600 via-indigo-500 to-teal-500 hover:opacity-95 shadow-xl shadow-indigo-500/25 active:scale-[0.99] transition-all disabled:opacity-50"
        >
          <Send className="w-4 h-4" />
          {isSubmitting ? "Logging Check-in..." : "Save Daily Mood Check-in"}
        </button>
      </form>
    </div>
  );
}
