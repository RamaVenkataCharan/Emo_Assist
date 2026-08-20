import { CrisisCheckResult } from "@/types";

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

// Patterns that indicate FALSE ALARMS (idioms, third-person concern, academic research, past resolved)
const SAFE_CONTEXT_PATTERNS = [
  // Idioms & hyperbole
  /\b(deadline|work|traffic|job|boss|weather|exam|test|chore|heat|cold|laughing)\s+(is|are)\s+killing\s+me\b/i,
  /\b(dying\s+(to|for))\s+(see|watch|eat|go|try|hear|read|meet|have|play)\b/i,
  
  // Academic / Third-person informational
  /\b(read|reading|wrote|writing|article|essay|project|book|paper|statistics|research|survey|class|school|assignment)\s+.*\b(self-harm|suicide|depression)\b/i,
  
  // Third-person concern (talking about a friend, family member, coworker)
  /\b(my\s+(friend|brother|sister|mom|dad|mother|father|coworker|cousin|partner)|a\s+friend\s+of\s+mine)\s+(has\s+been|is|was)\s+(struggling|having a hard time|feeling down)\b/i,
  
  // Past resolved / historical reflection
  /\b(used to|in the past|years ago|months ago|long time ago)\s+(feel|be|have)\s+(suicidal|self-harm|depressed)\b.*\b(better place|healed|good now|recovered|happy now)\b/i,
  /\b(used to feel suicidal years ago but I'm in a much better place now)\b/i,
  /\b(passed away|died)\s+(last year|years ago|months ago|a while ago)\b/i,
];

// Critical & High-Risk patterns (Active intent, imminent planning, severe self-harm, coded burden phrases)
const CRITICAL_PATTERNS = [
  // Suicidal Ideation & Intent
  /\b(kill|killing)\s+myself\b/i,
  /\b(take|taking)\s+my\s+(own\s+)?life\b/i,
  /\b(want|wishing)\s+to\s+die\b/i,
  /\b(end|ending)\s+(it all|my life|everything)\b/i,
  /\bthinking\s+about\s+(ending\s+it|ending\s+my\s+life|suicide)\b/i,
  /\b(don't|do not)\s+want\s+to\s+(be here|exist|wake up|live)\s+anymore\b/i,
  /\b(sleep\s+and\s+(not|never)\s+wake\s+up)\b/i,
  /\b(better\s+off\s+dead|no\s+reason\s+to\s+live)\b/i,
  /\b(slit|slitting)\s+(my\s+)?wrist\b/i,
  /\b(hang|hanging|shoot|shooting)\s+myself\b/i,
  
  // Imminent planning / method accumulation
  /\bhave\s+a\s+plan\s+and\s+(i'm|i am)\s+(going to|gonna)\s+(do it|end it)\b/i,
  /\b(stockpiled|stockpiling|hoarding|saving up)\s+(my\s+)?(pills|medication|meds)\b/i,
  /\bgoing\s+to\s+(do it|kill myself|end it)\s+tonight\b/i,

  // Coded & indirect despair
  /\bnobody\s+would\s+(notice|care|miss me)\s+if\s+(i|i'm)\s+(just\s+)?(disappeared|gone|dead|died)\b/i,
  /\b(won't|will not)\s+be\s+a\s+burden\s+(much longer|anymore|to anyone)\b/i,
  
  // Direct acute self-harm (active / recent)
  /\b(cutting|burned|burning)\s+(myself|again)\b/i,
  /\b(tried|attempted)\s+to\s+(hurt|harm|kill)\s+myself\b/i,
  /\b(self-harm|self harm|hurting myself)\b/i,
];

export function detectCrisis(text: string): CrisisCheckResult {
  const normalized = text.trim();
  const lower = normalized.toLowerCase();

  // 1. Check for Safe Context / Exclusions first (False-positive mitigation)
  for (const safePattern of SAFE_CONTEXT_PATTERNS) {
    if (safePattern.test(normalized)) {
      // Confirmed safe context (idiom, academic reference, third-person, past resolved)
      return {
        isHighRisk: false,
        confidence: 0,
        triggers: [],
        severity: "none",
        hotlines: [],
      };
    }
  }

  // 2. Check for Critical & High-Risk Triggers
  const matchedTriggers: string[] = [];

  for (const pattern of CRITICAL_PATTERNS) {
    const match = normalized.match(pattern);
    if (match) {
      matchedTriggers.push(match[0]);
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

  // 3. Moderate distress keywords (Low/Moderate sadness or overwhelm — not acute crisis)
  const MODERATE_INDICATORS = [
    "feel hopeless",
    "panic attack",
    "having a breakdown",
    "severe despair",
    "can't breathe",
  ];

  const moderateTriggers: string[] = [];
  for (const term of MODERATE_INDICATORS) {
    if (lower.includes(term)) {
      moderateTriggers.push(term);
    }
  }

  if (moderateTriggers.length > 0) {
    return {
      isHighRisk: false,
      confidence: 0.5,
      triggers: moderateTriggers,
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
