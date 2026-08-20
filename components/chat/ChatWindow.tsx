"use client";

import { useState, useEffect, useRef } from "react";
import { Send, Sparkles, RefreshCw, HeartHandshake, ShieldAlert } from "lucide-react";
import MessageBubble from "./MessageBubble";
import VoiceInputButton from "./VoiceInputButton";
import CrisisResourceBanner from "@/components/crisis/CrisisResourceBanner";
import { ChatMessageDTO } from "@/types";

const SUGGESTED_PROMPTS = [
  "I'm feeling anxious about today and could use grounding.",
  "I had a really good win today that I want to celebrate.",
  "I'm feeling overwhelmed with too many tasks.",
  "Can you help me reframe a negative thought?",
  "I feel physically exhausted and disconnected.",
];

export default function ChatWindow() {
  const [messages, setMessages] = useState<ChatMessageDTO[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showCrisisBanner, setShowCrisisBanner] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const fetchMessages = async () => {
    try {
      const res = await fetch("/api/chat");
      if (res.ok) {
        const data = await res.json();
        setMessages(data.messages || []);
      }
    } catch (err) {
      console.error("Failed to load messages:", err);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const handleSendMessage = async (textToSend?: string) => {
    const messageContent = (textToSend || inputValue).trim();
    if (!messageContent || isLoading) return;

    setInputValue("");
    setIsLoading(true);

    // Optimistic UI representation
    const tempUserMessage: ChatMessageDTO = {
      id: "temp-" + Date.now(),
      userId: "default-user",
      role: "user",
      content: messageContent,
      riskFlag: false,
      createdAt: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, tempUserMessage]);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: messageContent }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.crisisTriggered) {
          setShowCrisisBanner(true);
        }

        // Replace temp and append real messages
        setMessages((prev) => [
          ...prev.filter((m) => m.id !== tempUserMessage.id),
          data.userMessage,
          data.assistantMessage,
        ]);
      } else {
        // Fallback error bubble
        setMessages((prev) => [
          ...prev,
          {
            id: "err-" + Date.now(),
            userId: "default-user",
            role: "assistant",
            content:
              "I'm experiencing a brief pause connecting. Please take a gentle breath, and try sending your message again.",
            riskFlag: false,
            createdAt: new Date().toISOString(),
          },
        ]);
      }
    } catch (err) {
      console.error("Chat error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVoiceTranscript = (transcript: string) => {
    setInputValue((prev) => (prev ? `${prev} ${transcript}` : transcript));
  };

  return (
    <div className="flex flex-col h-[calc(100vh-12rem)] min-h-[550px] glass-panel rounded-3xl overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800/90 relative">
      {/* Chat Header */}
      <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800/80 bg-white/60 dark:bg-slate-900/60 backdrop-blur-md flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-500 to-teal-400 flex items-center justify-center text-white shadow-glow-sm">
            <HeartHandshake className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-bold text-slate-900 dark:text-white text-base sm:text-lg flex items-center gap-2">
              EMO Companion
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              A gentle space to reflect, be heard, and find calm.
            </p>
          </div>
        </div>

        <button
          onClick={fetchMessages}
          className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          title="Refresh messages"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* Inline Crisis Warning Banner if triggered */}
      {showCrisisBanner && (
        <div className="p-4 bg-rose-950/90 border-b border-rose-500/40 text-rose-200">
          <div className="flex items-center justify-between gap-2 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-rose-300 flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4 text-rose-400" />
              Crisis Helpline Notice
            </span>
            <button
              onClick={() => setShowCrisisBanner(false)}
              className="text-xs underline text-rose-300 hover:text-white"
            >
              Dismiss
            </button>
          </div>
          <CrisisResourceBanner inline onClose={() => setShowCrisisBanner(false)} />
        </div>
      )}

      {/* Message List */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-2">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center p-6 space-y-4">
            <div className="w-16 h-16 rounded-3xl bg-indigo-500/10 dark:bg-indigo-950/40 text-indigo-500 flex items-center justify-center">
              <Sparkles className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">
                Welcome to your safe sanctuary
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm mt-1">
                Share what&apos;s on your mind. You can type, speak, or select one of the prompts below.
              </p>
            </div>
          </div>
        )}

        {messages.map((msg) => (
          <MessageBubble key={msg.id} message={msg} />
        ))}

        {isLoading && (
          <div className="flex items-center gap-3 my-3">
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-indigo-500 to-teal-400 flex items-center justify-center text-white shadow-sm">
              <HeartHandshake className="w-4 h-4" />
            </div>
            <div className="glass-panel p-4 rounded-3xl rounded-tl-sm text-slate-400 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce" />
              <span className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce [animation-delay:0.2s]" />
              <span className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce [animation-delay:0.4s]" />
              <span className="text-xs text-slate-500 dark:text-slate-400 ml-1">Reflecting with care...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Prompts Chips */}
      <div className="px-4 py-2 border-t border-slate-200/60 dark:border-slate-800/60 bg-slate-50/70 dark:bg-slate-900/40 overflow-x-auto flex gap-2 no-scrollbar">
        {SUGGESTED_PROMPTS.map((prompt, idx) => (
          <button
            key={idx}
            onClick={() => handleSendMessage(prompt)}
            disabled={isLoading}
            className="text-xs whitespace-nowrap px-3 py-1.5 rounded-full bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 hover:text-indigo-600 dark:hover:text-indigo-400 border border-slate-200 dark:border-slate-700/60 transition-all shrink-0"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Input Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage();
        }}
        className="p-3 sm:p-4 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 flex items-center gap-2"
      >
        <VoiceInputButton
          onTranscript={handleVoiceTranscript}
          disabled={isLoading}
        />

        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Type how you're feeling or what happened..."
          disabled={isLoading}
          className="flex-1 px-4 py-3 rounded-2xl bg-slate-100 dark:bg-slate-800/90 text-slate-900 dark:text-slate-100 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 border border-slate-200 dark:border-slate-700/60 transition-all"
        />

        <button
          type="submit"
          disabled={isLoading || !inputValue.trim()}
          className="p-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-indigo-500/20 transition-all"
        >
          <Send className="w-5 h-5" />
        </button>
      </form>
    </div>
  );
}
