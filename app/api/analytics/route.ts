import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getOrCreateDefaultUser } from "@/lib/user";

const MOOD_COLOR_MAP: Record<string, string> = {
  Joyful: "#10b981", // emerald
  Grateful: "#059669",
  Hopeful: "#06b6d4", // cyan
  Calm: "#3b82f6", // blue
  Neutral: "#6b7280", // gray
  Exhausted: "#8b5cf6", // purple
  Anxious: "#f59e0b", // amber
  Irritable: "#f97316", // orange
  Overwhelmed: "#ef4444", // rose/red
  Low: "#6366f1", // indigo
};

export async function GET(req: NextRequest) {
  try {
    const user = await getOrCreateDefaultUser();

    const [moods, journals] = await Promise.all([
      prisma.moodEntry.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: "asc" },
      }),
      prisma.journalEntry.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: "desc" },
      }),
    ]);

    const totalMoods = moods.length;
    const totalJournals = journals.length;

    // 1. Average intensity
    const averageIntensity =
      totalMoods > 0
        ? Math.round((moods.reduce((acc, m) => acc + m.intensity, 0) / totalMoods) * 10) / 10
        : 5;

    // 2. Mood distribution & dominant mood
    const moodCounts: Record<string, number> = {};
    for (const m of moods) {
      moodCounts[m.mood] = (moodCounts[m.mood] || 0) + 1;
    }

    let dominantMood = "Calm";
    let maxCount = 0;
    for (const [mood, count] of Object.entries(moodCounts)) {
      if (count > maxCount) {
        maxCount = count;
        dominantMood = mood;
      }
    }

    const moodDistribution = Object.entries(moodCounts).map(([name, count]) => ({
      name,
      count,
      color: MOOD_COLOR_MAP[name] || "#6366f1",
    }));

    // 3. Recent mood trend (chronological)
    const recentMoodTrend = moods.slice(-14).map((m) => ({
      date: new Date(m.createdAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
      time: new Date(m.createdAt).toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
      }),
      intensity: m.intensity,
      mood: m.mood,
    }));

    // 4. Journal sentiment breakdown
    const sentimentCounts: Record<string, number> = {
      positive: 0,
      neutral: 0,
      negative: 0,
      mixed: 0,
    };

    for (const j of journals) {
      const s = j.sentiment || "neutral";
      sentimentCounts[s] = (sentimentCounts[s] || 0) + 1;
    }

    const journalSentimentBreakdown = Object.entries(sentimentCounts).map(([sentiment, count]) => ({
      sentiment: sentiment.charAt(0).toUpperCase() + sentiment.slice(1),
      count,
    }));

    // 5. Streak calculation (unique active days in the last 30 days)
    const activeDates = new Set<string>();
    [...moods, ...journals].forEach((item) => {
      activeDates.add(new Date(item.createdAt).toDateString());
    });

    let streakDays = 0;
    const checkDate = new Date();
    while (true) {
      if (activeDates.has(checkDate.toDateString())) {
        streakDays++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        // If today hasn't been logged yet, check if yesterday was logged to preserve streak
        if (streakDays === 0) {
          checkDate.setDate(checkDate.getDate() - 1);
          if (activeDates.has(checkDate.toDateString())) {
            streakDays++;
            checkDate.setDate(checkDate.getDate() - 1);
            continue;
          }
        }
        break;
      }
    }

    return NextResponse.json({
      totalMoods,
      totalJournals,
      averageIntensity,
      dominantMood,
      recentMoodTrend,
      moodDistribution,
      journalSentimentBreakdown,
      streakDays: Math.max(streakDays, 1),
    });
  } catch (error) {
    console.error("Analytics API error:", error);
    return NextResponse.json({ error: "Failed to generate analytics" }, { status: 500 });
  }
}
