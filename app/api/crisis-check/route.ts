import { NextRequest, NextResponse } from "next/server";
import { detectCrisis } from "@/lib/crisisDetection";

export async function POST(req: NextRequest) {
  try {
    const { text } = await req.json();
    if (!text || typeof text !== "string") {
      return NextResponse.json({ error: "Text is required" }, { status: 400 });
    }

    const result = detectCrisis(text);
    return NextResponse.json(result);
  } catch (error) {
    console.error("Crisis check error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
