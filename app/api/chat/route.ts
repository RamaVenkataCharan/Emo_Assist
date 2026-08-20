import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { detectCrisis } from "@/lib/crisisDetection";
import { analyzeSentiment } from "@/lib/sentiment";
import { generateChatResponse } from "@/lib/anthropic";
import { getOrCreateDefaultUser } from "@/lib/user";

export async function GET(req: NextRequest) {
  try {
    const user = await getOrCreateDefaultUser();
    const messages = await prisma.chatMessage.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "asc" },
      take: 50,
    });

    return NextResponse.json({ messages });
  } catch (error) {
    console.error("Fetch chat messages error:", error);
    return NextResponse.json({ error: "Failed to fetch messages" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getOrCreateDefaultUser();
    const body = await req.json();
    const { content } = body;

    if (!content || typeof content !== "string" || !content.trim()) {
      return NextResponse.json({ error: "Message content is required" }, { status: 400 });
    }

    const trimmedContent = content.trim();

    // 1. Run Crisis Screening first
    const crisisCheck = detectCrisis(trimmedContent);

    // 2. Perform sentiment & emotion analysis on user message
    const sentimentResult = analyzeSentiment(trimmedContent);

    // 3. Save User Message
    const userMsg = await prisma.chatMessage.create({
      data: {
        userId: user.id,
        role: "user",
        content: trimmedContent,
        riskFlag: crisisCheck.isHighRisk,
        sentiment: sentimentResult.emotions.join(", "),
      },
    });

    // 4. If High Risk, respond with safe crisis grounding response + hotlines
    if (crisisCheck.isHighRisk) {
      const hotlineListing = crisisCheck.hotlines
        .map((h) => `• **${h.name}**: ${h.action} (${h.details})`)
        .join("\n");

      const crisisReplyContent = `${crisisCheck.suggestedResponse}\n\n**Immediate Support Resources (24/7 & Free):**\n${hotlineListing}\n\nPlease take this moment to reach out to one of these resources or someone you trust. You matter.`;

      const assistantMsg = await prisma.chatMessage.create({
        data: {
          userId: user.id,
          role: "assistant",
          content: crisisReplyContent,
          riskFlag: true,
        },
      });

      return NextResponse.json({
        userMessage: userMsg,
        assistantMessage: assistantMsg,
        crisisTriggered: true,
        crisisCheck,
      });
    }

    // 5. Gather context: recent moods and journals for this user
    const [recentMoods, recentJournals, recentChatTurns] = await Promise.all([
      prisma.moodEntry.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: "desc" },
        take: 3,
        select: { mood: true, intensity: true, tags: true, createdAt: true },
      }),
      prisma.journalEntry.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: "desc" },
        take: 2,
        select: { content: true, sentiment: true, emotionTags: true, createdAt: true },
      }),
      prisma.chatMessage.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: "desc" },
        take: 8,
      }),
    ]);

    // Format chat history in chronological order
    const formattedHistory = recentChatTurns
      .reverse()
      .map((m) => ({
        role: m.role as "user" | "assistant",
        content: m.content,
      }));

    // 6. Generate empathetic response
    const assistantReply = await generateChatResponse({
      messages: formattedHistory,
      recentMoods: recentMoods.map((m) => ({
        mood: m.mood,
        intensity: m.intensity,
        tags: m.tags || undefined,
        createdAt: m.createdAt.toISOString(),
      })),
      recentJournals: recentJournals.map((j) => ({
        content: j.content,
        sentiment: j.sentiment,
        emotionTags: j.emotionTags || undefined,
        createdAt: j.createdAt.toISOString(),
      })),
    });

    // 7. Save Assistant Message
    const assistantMsg = await prisma.chatMessage.create({
      data: {
        userId: user.id,
        role: "assistant",
        content: assistantReply,
        riskFlag: false,
      },
    });

    return NextResponse.json({
      userMessage: userMsg,
      assistantMessage: assistantMsg,
      crisisTriggered: false,
    });
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json({ error: "Failed to generate chat response" }, { status: 500 });
  }
}
