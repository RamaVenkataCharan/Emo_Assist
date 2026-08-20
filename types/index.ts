export type MoodType =
  | "Anxious"
  | "Calm"
  | "Low"
  | "Joyful"
  | "Overwhelmed"
  | "Grateful"
  | "Exhausted"
  | "Hopeful"
  | "Irritable"
  | "Neutral";

export interface MoodConfig {
  name: MoodType;
  emoji: string;
  color: string;
  bgLight: string;
  borderLight: string;
  description: string;
}

export interface MoodEntryDTO {
  id: string;
  userId: string;
  mood: string;
  intensity: number;
  note?: string | null;
  tags?: string | null;
  createdAt: string;
}

export interface JournalEntryDTO {
  id: string;
  userId: string;
  title?: string | null;
  content: string;
  sentiment?: string | null;
  emotionTags?: string | null;
  aiReflection?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ChatMessageDTO {
  id: string;
  userId: string;
  role: "user" | "assistant" | "system";
  content: string;
  riskFlag: boolean;
  sentiment?: string | null;
  createdAt: string;
}

export interface CrisisCheckResult {
  isHighRisk: boolean;
  confidence: number;
  triggers: string[];
  severity: "none" | "low" | "medium" | "high" | "critical";
  suggestedResponse?: string;
  hotlines: {
    name: string;
    contact: string;
    action: string;
    details: string;
    url: string;
  }[];
}

export interface AnalyticsSummary {
  totalMoods: number;
  totalJournals: number;
  averageIntensity: number;
  dominantMood: string;
  recentMoodTrend: { date: string; intensity: number; mood: string }[];
  moodDistribution: { name: string; count: number; color: string }[];
  journalSentimentBreakdown: { sentiment: string; count: number }[];
  streakDays: number;
}
