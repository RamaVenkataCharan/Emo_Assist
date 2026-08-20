"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { 
  HeartHandshake, 
  MessageSquareHeart, 
  Sparkles, 
  BookOpenText, 
  BarChart3, 
  ShieldAlert, 
  Menu, 
  X,
  PhoneCall
} from "lucide-react";
import CrisisResourceBanner from "@/components/crisis/CrisisResourceBanner";

const NAV_ITEMS = [
  { href: "/chat", label: "Companion Chat", icon: MessageSquareHeart },
  { href: "/mood", label: "Mood Check-in", icon: Sparkles },
  { href: "/journal", label: "Journal & Insights", icon: BookOpenText },
  { href: "/dashboard", label: "Analytics", icon: BarChart3 },
];

export default function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [crisisModalOpen, setCrisisModalOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-40 w-full glass-panel border-b border-slate-200 dark:border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-teal-400 flex items-center justify-center shadow-glow-sm group-hover:scale-105 transition-transform duration-200">
                <HeartHandshake className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="text-lg font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-teal-500 dark:from-indigo-400 dark:via-purple-300 dark:to-teal-300 bg-clip-text text-transparent">
                  EMO Assistant
                </span>
                <span className="hidden sm:inline-block ml-2 text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-full bg-teal-500/10 text-teal-600 dark:text-teal-400 border border-teal-500/20">
                  Mindful AI
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-1.5">
              {NAV_ITEMS.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? "bg-indigo-500/15 text-indigo-600 dark:text-indigo-300 font-semibold shadow-sm border border-indigo-500/20"
                        : "text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60"
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? "text-indigo-600 dark:text-indigo-400" : ""}`} />
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            {/* Quick Actions */}
            <div className="hidden md:flex items-center gap-3">
              <button
                onClick={() => setCrisisModalOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 dark:hover:bg-rose-900/50 border border-rose-200 dark:border-rose-800/60 transition-colors shadow-sm"
                title="Immediate 24/7 Crisis Support"
              >
                <ShieldAlert className="w-3.5 h-3.5 text-rose-500 animate-pulse" />
                Crisis Help (988)
              </button>

              <div className="flex items-center gap-2 pl-2 border-l border-slate-200 dark:border-slate-800">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500/20 to-teal-500/20 border border-indigo-500/30 flex items-center justify-center text-sm shadow-inner">
                  🌸
                </div>
                <span className="text-xs font-medium text-slate-700 dark:text-slate-300">Alex</span>
              </div>
            </div>

            {/* Mobile menu button */}
            <div className="flex md:hidden items-center gap-2">
              <button
                onClick={() => setCrisisModalOpen(true)}
                className="p-2 rounded-lg bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800/60"
                aria-label="Crisis Help"
              >
                <PhoneCall className="w-4 h-4" />
              </button>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-slate-200 dark:border-slate-800/80 px-4 pt-2 pb-4 space-y-1 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-base font-medium ${
                    isActive
                      ? "bg-indigo-500/15 text-indigo-600 dark:text-indigo-300 font-semibold"
                      : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                  }`}
                >
                  <Icon className="w-5 h-5 text-indigo-500" />
                  {item.label}
                </Link>
              );
            })}
            <div className="pt-2">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setCrisisModalOpen(true);
                }}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/60"
              >
                <ShieldAlert className="w-4 h-4" />
                Emergency Crisis Resources (988)
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Crisis Resource Modal */}
      {crisisModalOpen && (
        <CrisisResourceBanner onClose={() => setCrisisModalOpen(false)} />
      )}
    </>
  );
}
