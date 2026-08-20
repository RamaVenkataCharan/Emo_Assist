"use client";

import { useState } from "react";
import { Volume2, VolumeX, ShieldAlert, HeartHandshake, User, Sparkles } from "lucide-react";
import { ChatMessageDTO } from "@/types";

interface MessageBubbleProps {
  message: ChatMessageDTO;
}

export default function MessageBubble({ message }: MessageBubbleProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const isUser = message.role === "user";

  const handleSpeak = () => {
    if (!("speechSynthesis" in window)) return;

    if (isPlaying) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
      return;
    }

    window.speechSynthesis.cancel(); // Stop any current speech
    const utterance = new SpeechSynthesisUtterance(message.content);
    utterance.rate = 0.95; // slightly gentle, calm pace
    utterance.pitch = 1.0;

    utterance.onend = () => setIsPlaying(false);
    utterance.onerror = () => setIsPlaying(false);

    setIsPlaying(true);
    window.speechSynthesis.speak(utterance);
  };

  const formattedTime = new Date(message.createdAt).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });

  return (
    <div
      className={`flex items-start gap-3 my-3 group ${
        isUser ? "flex-row-reverse" : "flex-row"
      }`}
    >
      {/* Avatar */}
      <div
        className={`w-9 h-9 rounded-2xl flex items-center justify-center shrink-0 text-sm shadow-sm ${
          isUser
            ? "bg-indigo-600 text-white font-semibold"
            : message.riskFlag
            ? "bg-rose-500 text-white animate-pulse"
            : "bg-gradient-to-tr from-indigo-500 to-teal-400 text-white"
        }`}
      >
        {isUser ? (
          <User className="w-4 h-4" />
        ) : message.riskFlag ? (
          <ShieldAlert className="w-4 h-4" />
        ) : (
          <HeartHandshake className="w-4 h-4" />
        )}
      </div>

      {/* Message Content Bubble */}
      <div
        className={`max-w-[85%] sm:max-w-[75%] rounded-3xl p-4 shadow-sm relative transition-all ${
          isUser
            ? "bg-indigo-600 text-white rounded-tr-sm"
            : message.riskFlag
            ? "bg-rose-950/80 text-rose-100 border border-rose-500/40 rounded-tl-sm backdrop-blur-md"
            : "glass-panel bg-white dark:bg-slate-800/90 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-700/70 rounded-tl-sm"
        }`}
      >
        {/* Sentiment or Risk Tag if present */}
        {message.riskFlag && (
          <div className="flex items-center gap-1 text-[11px] font-bold text-rose-300 mb-2 pb-1.5 border-b border-rose-500/30">
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Crisis Grounding & Hotlines Active</span>
          </div>
        )}

        {isUser && message.sentiment && (
          <div className="flex items-center gap-1 text-[10px] font-medium text-indigo-200 mb-1">
            <Sparkles className="w-3 h-3 text-indigo-300" />
            <span>Expressed: {message.sentiment}</span>
          </div>
        )}

        {/* Text */}
        <div className="text-sm leading-relaxed whitespace-pre-wrap">
          {message.content}
        </div>

        {/* Footer: Time & TTS Button */}
        <div
          className={`flex items-center justify-between gap-3 mt-2 text-[10px] ${
            isUser ? "text-indigo-200" : "text-slate-400 dark:text-slate-400"
          }`}
        >
          <span>{formattedTime}</span>

          {!isUser && (
            <button
              onClick={handleSpeak}
              className="p-1 rounded-md hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 hover:text-indigo-600 transition-colors"
              title={isPlaying ? "Stop reading" : "Read aloud"}
            >
              {isPlaying ? (
                <VolumeX className="w-3.5 h-3.5 text-indigo-500 animate-pulse" />
              ) : (
                <Volume2 className="w-3.5 h-3.5" />
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
