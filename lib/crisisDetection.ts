import { CrisisCheckResult } from "@/types";

// High-risk and moderate-risk indicator keywords and regexes
const CRITICAL_KEYWORDS = [
  "kill myself",
  "want to die",
  "end it all",
  "suicide",
  "suicidal",
  "hang myself",
  "shoot myself",
  "take my own life",
  "no reason to live",
  "better off dead",
  "slit my wrist",
  "overdose",
  "can't go on anymore",
  "end my life",
];

const HIGH_RISK_KEYWORDS = [
  "self harm",
  "self-harm",
  "cutting myself",
  "hurt myself",
  "burning myself",
  "punish myself physically",
  "hopeless and want out",
  "nobody would miss me",
];

const MODERATE_RISK_KEYWORDS = [
  "feel hopeless",
  "so tired of living",
  "everything is dark",
  "can't breathe",
  "panic attack",
  "having a breakdown",
  "severe despair",
];

export const CRISIS_HOTLINES = [
  {
    name: "988 Suicide & Crisis Lifeline",
    contact: "988",
    action: "Call or Text 988",
    details: "Free, confidential 24/7 support across the US & Canada for people in distress.",
    url: "https://988lifeline.org",
  },
  {
    name: "Crisis Text Line",
    contact: "Text HOME to 741741",
    action: "Text HOME to 741741",
    details: "Free 24/7 crisis support via text message in US, UK, and Canada.",
    url: "https://www.crisistextline.org",
  },
  {
    name: "The Trevor Project (LGBTQ Youth)",
    contact: "1-866-488-7386",
    action: "Call 1-866-488-7386 or Text START to 678-678",
    details: "24/7 confidential crisis support for LGBTQ young people.",
    url: "https://www.thetrevorproject.org",
  },
  {
    name: "International Resources (Befrienders Worldwide)",
    contact: "befrienders.org",
    action: "Find your local helpline",
    details: "Global network of emotional support helplines across 32+ countries.",
    url: "https://www.befrienders.org",
  },
];

export function detectCrisis(text: string): CrisisCheckResult {
  const normalized = text.toLowerCase().trim();
  const matchedTriggers: string[] = [];

  for (const keyword of CRITICAL_KEYWORDS) {
    if (normalized.includes(keyword)) {
      matchedTriggers.push(keyword);
    }
  }

  if (matchedTriggers.length > 0) {
    return {
      isHighRisk: true,
      confidence: 0.98,
      triggers: matchedTriggers,
      severity: "critical",
      suggestedResponse:
        "I hear how deeply overwhelmed and in pain you are right now. Please know that your life matters, and you do not have to carry this alone. I am an AI and cannot replace real human support, but there are compassionate people available right now who want to listen and help you through this exact moment.",
      hotlines: CRISIS_HOTLINES,
    };
  }

  for (const keyword of HIGH_RISK_KEYWORDS) {
    if (normalized.includes(keyword)) {
      matchedTriggers.push(keyword);
    }
  }

  if (matchedTriggers.length > 0) {
    return {
      isHighRisk: true,
      confidence: 0.85,
      triggers: matchedTriggers,
      severity: "high",
      suggestedResponse:
        "I can sense how much heavy pain you're navigating right now. Your safety and well-being are so important. Please reach out to someone you trust or one of the dedicated support resources below who are ready to support you right now.",
      hotlines: CRISIS_HOTLINES,
    };
  }

  for (const keyword of MODERATE_RISK_KEYWORDS) {
    if (normalized.includes(keyword)) {
      matchedTriggers.push(keyword);
    }
  }

  if (matchedTriggers.length > 0) {
    return {
      isHighRisk: false,
      confidence: 0.5,
      triggers: matchedTriggers,
      severity: "medium",
      hotlines: CRISIS_HOTLINES.slice(0, 2),
    };
  }

  return {
    isHighRisk: false,
    confidence: 0,
    triggers: [],
    severity: "none",
    hotlines: [],
  };
}
