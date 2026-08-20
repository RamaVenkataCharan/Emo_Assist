"use client";

import { CRISIS_HOTLINES } from "@/lib/crisisDetection";
import { Phone, MessageSquare, ExternalLink, X, Heart, Shield, Sparkles } from "lucide-react";

interface CrisisResourceBannerProps {
  onClose?: () => void;
  inline?: boolean;
}

export default function CrisisResourceBanner({
  onClose,
  inline = false,
}: CrisisResourceBannerProps) {
  const content = (
    <div className="bg-slate-900/95 text-slate-100 border border-rose-500/30 rounded-2xl p-5 sm:p-6 shadow-2xl backdrop-blur-xl relative overflow-hidden">
      {/* Background glow accent */}
      <div className="absolute -top-24 -right-24 w-48 h-48 bg-rose-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-4 relative z-10">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-rose-500/20 border border-rose-500/30 text-rose-400 shadow-sm">
            <Heart className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              You are Not Alone — Help is Available 24/7
            </h3>
            <p className="text-xs sm:text-sm text-slate-300">
              If you are feeling overwhelmed, hopeless, or unsafe, free & confidential support is right here.
            </p>
          </div>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Calming reassurance banner */}
      <div className="mb-5 p-3 rounded-xl bg-indigo-950/40 border border-indigo-500/20 text-xs sm:text-sm text-indigo-200 flex items-center gap-2.5">
        <Sparkles className="w-4 h-4 text-indigo-400 shrink-0" />
        <span>Take a slow, deep breath in... and out. Reaching out for help is a sign of strength, not weakness.</span>
      </div>

      {/* Hotline Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 relative z-10">
        {CRISIS_HOTLINES.map((hotline, idx) => (
          <div
            key={idx}
            className="p-4 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 transition-all duration-200 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-semibold text-sm text-white">{hotline.name}</span>
                <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  24/7 Free
                </span>
              </div>
              <p className="text-xs text-slate-300 mb-3">{hotline.details}</p>
            </div>

            <div className="flex items-center gap-2 pt-2 border-t border-slate-700/50">
              <a
                href={hotline.contact.startsWith("Text") ? "sms:741741" : hotline.contact.match(/\d+/) ? `tel:${hotline.contact.replace(/\D/g, '')}` : hotline.url}
                target={hotline.contact.startsWith("http") || hotline.url.startsWith("http") ? "_blank" : undefined}
                rel="noreferrer"
                className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold shadow-sm transition-colors"
              >
                {hotline.contact.includes("Text") ? (
                  <MessageSquare className="w-3.5 h-3.5" />
                ) : (
                  <Phone className="w-3.5 h-3.5" />
                )}
                {hotline.action}
              </a>
              <a
                href={hotline.url}
                target="_blank"
                rel="noreferrer"
                className="p-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-200 transition-colors"
                title="Visit Website"
              >
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 text-center text-[11px] text-slate-400">
        All calls and texts are 100% free, confidential, and staffed by trained compassionate specialists.
      </div>
    </div>
  );

  if (inline) {
    return <div className="w-full my-4">{content}</div>;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-2xl">{content}</div>
    </div>
  );
}
