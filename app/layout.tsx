import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/ui/Navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "EMO Assistant — Mindful Emotional Companion & Tracker",
  description: "A calm, empathetic emotional-support assistant with mood tracking, mindful journaling, and AI-powered reflections.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} min-h-screen calm-gradient text-slate-900 dark:text-slate-100 antialiased selection:bg-indigo-500/20 selection:text-indigo-600 dark:selection:text-indigo-300`}>
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            {children}
          </main>
          <footer className="border-t border-slate-200 dark:border-slate-800/80 py-6 text-center text-xs text-slate-500 dark:text-slate-400">
            <p className="max-w-2xl mx-auto">
              <strong>Disclaimer:</strong> EMO Assistant is a supportive wellness tool and does not provide medical diagnosis, treatment, or clinical therapy. If you are in crisis, please dial <strong>988</strong> (US/Canada) or contact your local emergency services.
            </p>
          </footer>
        </div>
      </body>
    </html>
  );
}
