import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { analyzeSentiment } from "@/lib/sentiment";
import { generateJournalReflection } from "@/lib/anthropic";
import { getOrCreateDefaultUser } from "@/lib/user";

export async function GET(req: NextRequest) {
  try {
    const user = await getOrCreateDefaultUser();
    const journalEntries = await prisma.journalEntry.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      take: 50,
    });

    return NextResponse.json({ journalEntries });
  } catch (error) {
    console.error("Fetch journal entries error:", error);
    return NextResponse.json({ error: "Failed to fetch journal entries" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getOrCreateDefaultUser();
    const body = await req.json();
    const { title, content } = body;

    if (!content || typeof content !== "string" || !content.trim()) {
      return NextResponse.json({ error: "Journal content is required" }, { status: 400 });
    }

    const trimmedContent = content.trim();
    const trimmedTitle = title ? String(title).trim() : "Untitled Reflection";

    // 1. Analyze sentiment & emotions
    const sentimentAnalysis = analyzeSentiment(trimmedContent);

    // 2. Generate AI Reflection
    const aiReflection = await generateJournalReflection(trimmedContent);

    // 3. Save to database
    const newJournal = await prisma.journalEntry.create({
      data: {
        userId: user.id,
        title: trimmedTitle,
        content: trimmedContent,
        sentiment: sentimentAnalysis.sentiment,
        emotionTags: JSON.stringify(sentimentAnalysis.emotions),
        aiReflection: aiReflection,
      },
    });

    return NextResponse.json({ journalEntry: newJournal }, { status: 201 });
  } catch (error) {
    console.error("Create journal entry error:", error);
    return NextResponse.json({ error: "Failed to create journal entry" }, { status: 500 });
  }
}
