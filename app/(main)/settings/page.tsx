"use client";

import { useState } from "react";
import { Settings, Shield, Key, Bell, Heart, User, CheckCircle2 } from "lucide-react";
import CrisisResourceBanner from "@/components/crisis/CrisisResourceBanner";

export default function SettingsPage() {
  const [showCrisisModal, setShowCrisisModal] = useState(false);
  const [voiceSpeed, setVoiceSpeed] = useState("normal");
  const [showSavedToast, setShowSavedToast] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setShowSavedToast(true);
    setTimeout(() => setShowSavedToast(false), 2500);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-2">
      <div>
        <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 mb-1">
          <Settings className="w-4 h-4" />
          <span className="text-xs font-semibold uppercase tracking-wider">Preferences</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
          Settings & Safety Controls
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          Manage your companion preferences, voice controls, and emergency resources.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* User Profile */}
        <div className="glass-panel p-6 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white">Profile</h3>
              <p className="text-xs text-slate-500">Your persona in EMO Assistant</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Preferred Name
              </label>
              <input
                type="text"
                defaultValue="Alex"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Email
              </label>
              <input
                type="email"
                defaultValue="demo@emo-assistant.com"
                disabled
                className="w-full px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 text-sm text-slate-500 cursor-not-allowed"
              />
            </div>
          </div>
        </div>

        {/* Voice & Accessibility */}
        <div className="glass-panel p-6 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-teal-500/10 text-teal-500 flex items-center justify-center">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white">Voice & Reading Pace</h3>
              <p className="text-xs text-slate-500">Speech-to-text and Text-to-speech audio behaviors</p>
            </div>
          </div>

          <div className="space-y-3 pt-2">
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              Speech Pacing
            </label>
            <div className="grid grid-cols-3 gap-2 max-w-md">
              {["calm & slow", "normal", "faster"].map((speed) => (
                <button
                  key={speed}
                  type="button"
                  onClick={() => setVoiceSpeed(speed)}
                  className={`py-2 px-3 rounded-xl text-xs font-semibold capitalize border transition-all ${
                    voiceSpeed === speed
                      ? "bg-indigo-600 text-white border-indigo-600 shadow-sm"
                      : "bg-slate-50 dark:bg-slate-900/60 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800"
                  }`}
                >
                  {speed}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Safety & Hotline Overview */}
        <div className="glass-panel p-6 rounded-3xl border border-rose-500/20 bg-rose-950/10 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-rose-500/10 text-rose-500 flex items-center justify-center">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-base text-slate-900 dark:text-white">Emergency Resources</h3>
                <p className="text-xs text-slate-500">24/7 Lifelines for acute crisis</p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowCrisisModal(true)}
              className="px-4 py-2 rounded-xl text-xs font-bold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/60 hover:bg-rose-100"
            >
              Open Crisis Helplines
            </button>
          </div>
        </div>

        {/* Submit */}
        <div className="flex items-center justify-between">
          {showSavedToast && (
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400 animate-in fade-in duration-200">
              <CheckCircle2 className="w-4 h-4" /> Preferences saved!
            </div>
          )}
          <button
            type="submit"
            className="ml-auto px-6 py-2.5 rounded-xl font-bold text-white bg-indigo-600 hover:bg-indigo-500 shadow-md shadow-indigo-500/20 transition-all text-sm"
          >
            Save Preferences
          </button>
        </div>
      </form>

      {showCrisisModal && (
        <CrisisResourceBanner onClose={() => setShowCrisisModal(false)} />
      )}
    </div>
  );
}
