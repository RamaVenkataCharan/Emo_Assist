import { prisma } from "./prisma";

export const DEFAULT_USER_EMAIL = "demo@emo-assistant.com";

export async function getOrCreateDefaultUser() {
  try {
    let user = await prisma.user.findUnique({
      where: { email: DEFAULT_USER_EMAIL },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          id: "default-user",
          email: DEFAULT_USER_EMAIL,
          name: "Alex",
          avatar: "🌸",
        },
      });

      // Seed initial welcoming mood and journal entries if fresh
      await seedInitialData(user.id);
    }

    return user;
  } catch (error) {
    console.error("Error ensuring default user:", error);
    return {
      id: "default-user",
      email: DEFAULT_USER_EMAIL,
      name: "Alex",
      avatar: "🌸",
    };
  }
}

async function seedInitialData(userId: string) {
  try {
    const today = new Date();
    const yesterday = new Date(Date.now() - 86400000);
    const twoDaysAgo = new Date(Date.now() - 86400000 * 2);

    // Initial mood entries
    await prisma.moodEntry.createMany({
      data: [
        {
          userId,
          mood: "Hopeful",
          intensity: 7,
          note: "Starting my day with a cup of tea and a brisk morning walk.",
          tags: "morning, routine, nature",
          createdAt: twoDaysAgo,
        },
        {
          userId,
          mood: "Overwhelmed",
          intensity: 8,
          note: "Too many deadlines stacked together at work.",
          tags: "work, stress",
          createdAt: yesterday,
        },
        {
          userId,
          mood: "Calm",
          intensity: 6,
          note: "Taking a deep breath and focusing on one task at a time.",
          tags: "mindfulness, pause",
          createdAt: today,
        },
      ],
    });

    // Initial journal entry
    await prisma.journalEntry.create({
      data: {
        userId,
        title: "Finding My Breath",
        content:
          "Today was a reminder that I cannot control everything that comes at me, but I can control how I pause before responding. Stepping outside for ten minutes helped clear my head and remember what truly matters.",
        sentiment: "positive",
        emotionTags: JSON.stringify(["Calm", "Hopeful"]),
        aiReflection:
          "You've shown strong emotional self-regulation today by choosing mindful pause over reactive stress. Recognizing your limits and giving yourself permission to step outside is a valuable self-care anchor.",
        createdAt: today,
      },
    });

    // Initial welcome message
    await prisma.chatMessage.create({
      data: {
        userId,
        role: "assistant",
        content:
          "Hi Alex, welcome to EMO Assistant. I'm here whenever you want to check in, unpack your thoughts, or just take a quiet breath together. How are you feeling right now?",
        createdAt: today,
      },
    });
  } catch (seedErr) {
    console.warn("Seeding initial data skipped:", seedErr);
  }
}
