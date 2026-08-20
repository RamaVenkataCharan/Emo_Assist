import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getOrCreateDefaultUser } from "@/lib/user";

export async function GET(req: NextRequest) {
  try {
    const user = await getOrCreateDefaultUser();
    const moodEntries = await prisma.moodEntry.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      take: 50,
    });

    return NextResponse.json({ moodEntries });
  } catch (error) {
    console.error("Fetch mood entries error:", error);
    return NextResponse.json({ error: "Failed to fetch mood entries" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getOrCreateDefaultUser();
    const body = await req.json();
    const { mood, intensity, note, tags } = body;

    if (!mood || typeof mood !== "string") {
      return NextResponse.json({ error: "Mood is required" }, { status: 400 });
    }

    const intensityNum = Number(intensity) || 5;
    const clampedIntensity = Math.max(1, Math.min(10, intensityNum));

    const newMood = await prisma.moodEntry.create({
      data: {
        userId: user.id,
        mood: mood.trim(),
        intensity: clampedIntensity,
        note: note ? String(note).trim() : null,
        tags: tags ? String(tags).trim() : null,
      },
    });

    return NextResponse.json({ moodEntry: newMood }, { status: 201 });
  } catch (error) {
    console.error("Create mood entry error:", error);
    return NextResponse.json({ error: "Failed to create mood entry" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const user = await getOrCreateDefaultUser();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Entry ID is required" }, { status: 400 });
    }

    await prisma.moodEntry.deleteMany({
      where: {
        id,
        userId: user.id,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete mood entry error:", error);
    return NextResponse.json({ error: "Failed to delete mood entry" }, { status: 500 });
  }
}
