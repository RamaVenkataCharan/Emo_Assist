import Anthropic from "@anthropic-ai/sdk";
import { SYSTEM_PROMPT } from "./prompts/systemPrompt";
import { JOURNAL_REFLECTION_PROMPT } from "./prompts/journalReflectionPrompt";

const apiKey = process.env.ANTHROPIC_API_KEY?.trim();
const anthropic = apiKey ? new Anthropic({ apiKey }) : null;

export async function generateChatResponse({
  messages,
  recentMoods = [],
  recentJournals = [],
}: {
  messages: { role: "user" | "assistant"; content: string }[];
  recentMoods?: { mood: string; intensity: number; tags?: string; createdAt: string }[];
  recentJournals?: { content: string; sentiment?: string | null; emotionTags?: string | null; createdAt: string }[];
}): Promise<string> {
  const contextSections: string[] = [];

  if (recentMoods.length > 0) {
    const moodSummary = recentMoods
      .slice(0, 3)
      .map((m) => `${m.mood} (intensity: ${m.intensity}/10${m.tags ? `, tags: [${m.tags}]` : ""})`)
      .join("; ");
    contextSections.push(`Recent mood check-ins: ${moodSummary}`);
  }

  if (recentJournals.length > 0) {
    const journalSummary = recentJournals
      .slice(0, 2)
      .map((j) => `"${j.content.slice(0, 90)}..." [Sentiment: ${j.sentiment || "neutral"}${j.emotionTags ? `, Emotions: ${j.emotionTags}` : ""}]`)
      .join("; ");
    contextSections.push(`Recent journal sentiment/emotion tags: ${journalSummary}`);
  }

  const systemWithContext = contextSections.length > 0
    ? `${SYSTEM_PROMPT}\n\n## Context (use only when naturally relevant):\n${contextSections.join("\n")}`
    : SYSTEM_PROMPT;

  if (anthropic) {
    try {
      const response = await anthropic.messages.create({
        model: "claude-3-5-sonnet-20241022",
        max_tokens: 350,
        temperature: 0.7,
        system: systemWithContext,
        messages: messages.map((m) => ({
          role: m.role,
          content: m.content,
        })),
      });

      const firstContent = response.content[0];
      if (firstContent && firstContent.type === "text") {
        return firstContent.text;
      }
    } catch (err) {
      console.warn("Anthropic API error, falling back to local companion engine:", err);
    }
  }

  // Built-in intelligent conversational companion simulation (when API key is absent or offline)
  return generateSimulatedCompanionResponse(messages, recentMoods);
}

export async function generateJournalReflection(journalContent: string): Promise<string> {
  if (anthropic) {
    try {
      const response = await anthropic.messages.create({
        model: "claude-3-5-sonnet-20241022",
        max_tokens: 200,
        temperature: 0.6,
        system: JOURNAL_REFLECTION_PROMPT,
        messages: [{ role: "user", content: journalContent }],
      });

      const firstContent = response.content[0];
      if (firstContent && firstContent.type === "text") {
        return firstContent.text;
      }
    } catch (err) {
      console.warn("Anthropic API error for reflection:", err);
    }
  }

  // Realistic empathetic journal reflection fallback
  return generateSimulatedReflection(journalContent);
}

function generateSimulatedCompanionResponse(
  messages: { role: "user" | "assistant"; content: string }[],
  recentMoods: { mood: string; intensity: number }[] = []
): string {
  const lastUserMsg = messages.filter((m) => m.role === "user").pop()?.content.toLowerCase() || "";

  if (lastUserMsg.includes("anxious") || lastUserMsg.includes("nervous") || lastUserMsg.includes("panic")) {
    return "That feeling of anxiety can make everything feel louder and heavier than it is. Take a slow breath with me right now. What is one small physical thing around you that feels steady?";
  }

  if (lastUserMsg.includes("tired") || lastUserMsg.includes("exhausted") || lastUserMsg.includes("burned out")) {
    return "It sounds like you have been carrying a lot of weight on your shoulders lately. Give yourself permission to pause. Is there something non-essential you can let go of for today?";
  }

  if (lastUserMsg.includes("sad") || lastUserMsg.includes("lonely") || lastUserMsg.includes("down")) {
    return "I hear you. Feeling low or disconnected is really tough, and it's completely okay that you're feeling this way right now. Would it help to talk through what sparked this, or would you prefer a quiet moment to unwind?";
  }

  if (lastUserMsg.includes("happy") || lastUserMsg.includes("grateful") || lastUserMsg.includes("good day")) {
    return "I'm genuinely glad to hear that! It's so meaningful to savor those moments of calm and joy. What was the highlight of your day?";
  }

  if (lastUserMsg.includes("thank") || lastUserMsg.includes("helpful")) {
    return "You are very welcome. I'm always glad to be a safe space whenever you want to check in or unpack your thoughts.";
  }

  if (recentMoods.length > 0 && recentMoods[0].intensity >= 7) {
    return `I hear you, and it makes sense that things feel intense right now given you've been feeling ${recentMoods[0].mood.toLowerCase()}. What would feel most comforting or grounding to do in the next hour?`;
  }

  return "Thank you for sharing that with me. It takes real courage to put feelings into words. How has this been sitting with you throughout your day?";
}

function generateSimulatedReflection(content: string): string {
  const lower = content.toLowerCase();
  if (lower.includes("grateful") || lower.includes("thankful") || lower.includes("happy")) {
    return "Your reflection highlights a deep capacity for gratitude and mindfulness. Recognizing these positive anchors during busy moments helps foster long-term emotional resilience. How can you carry this warm feeling into tomorrow?";
  }
  if (lower.includes("overwhelm") || lower.includes("stress") || lower.includes("hard")) {
    return "You did an admirable job giving voice to a complicated and demanding experience. By writing this down, you've created space between yourself and the noise. Be gentle with your expectations for the rest of today.";
  }
  return "This entry demonstrates honest self-awareness. Giving your thoughts a safe place to land is a vital part of processing life's changes. Take a brief moment to acknowledge the care you showed yourself today.";
}
