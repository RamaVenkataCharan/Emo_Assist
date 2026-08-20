export interface SentimentAnalysisResult {
  sentiment: "positive" | "neutral" | "negative" | "mixed";
  score: number; // -1 to 1
  emotions: string[];
}

const POSITIVE_WORDS = [
  "happy", "joy", "grateful", "good", "great", "peaceful", "calm", "relieved",
  "hopeful", "excited", "proud", "loving", "connected", "inspired", "content",
  "energized", "refreshed", "optimistic", "blessed", "accomplished", "proud"
];

const NEGATIVE_WORDS = [
  "sad", "anxious", "overwhelmed", "angry", "frustrated", "tired", "exhausted",
  "lonely", "hopeless", "scared", "fearful", "stress", "stressed", "depressed",
  "burnt out", "down", "hurting", "lost", "insecure", "guilty", "ashamed"
];

const EMOTION_MAP: Record<string, string[]> = {
  Anxious: ["anxious", "anxiety", "nervous", "worry", "worried", "panic", "scared", "stress", "tense"],
  Calm: ["calm", "peaceful", "relaxed", "serene", "quiet", "settled", "grounded"],
  Low: ["sad", "down", "low", "depressed", "blue", "unhappy", "grief", "heavy"],
  Joyful: ["happy", "joy", "glad", "delighted", "laugh", "cheerful", "excited", "wonderful"],
  Overwhelmed: ["overwhelmed", "too much", "swamped", "burnt out", "chaotic", "exhausted", "drowning"],
  Grateful: ["grateful", "thankful", "blessed", "appreciate", "appreciated"],
  Exhausted: ["tired", "exhausted", "drained", "sleepy", "fatigued", "weary"],
  Hopeful: ["hopeful", "optimistic", "looking forward", "better tomorrow", "encouraged"],
};

export function analyzeSentiment(text: string): SentimentAnalysisResult {
  const lower = text.toLowerCase();
  const words = lower.match(/\b\w+\b/g) || [];

  let posCount = 0;
  let negCount = 0;
  const detectedEmotions = new Set<string>();

  for (const word of words) {
    if (POSITIVE_WORDS.includes(word)) posCount++;
    if (NEGATIVE_WORDS.includes(word)) negCount++;
  }

  for (const [emotion, triggers] of Object.entries(EMOTION_MAP)) {
    for (const trigger of triggers) {
      if (lower.includes(trigger)) {
        detectedEmotions.add(emotion);
        break;
      }
    }
  }

  const total = posCount + negCount;
  let sentiment: "positive" | "neutral" | "negative" | "mixed" = "neutral";
  let score = 0;

  if (total > 0) {
    score = (posCount - negCount) / total;
    if (posCount > 0 && negCount > 0 && Math.abs(posCount - negCount) <= 1) {
      sentiment = "mixed";
    } else if (score > 0.15) {
      sentiment = "positive";
    } else if (score < -0.15) {
      sentiment = "negative";
    }
  }

  if (detectedEmotions.size === 0) {
    if (sentiment === "positive") detectedEmotions.add("Joyful");
    else if (sentiment === "negative") detectedEmotions.add("Low");
    else detectedEmotions.add("Calm");
  }

  return {
    sentiment,
    score: Math.round(score * 100) / 100,
    emotions: Array.from(detectedEmotions),
  };
}
