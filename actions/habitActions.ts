"use server";

import { auth } from "@/lib/auth";
import { genAI } from "@/lib/ai/ai";
import * as z from "zod";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import {
  generateHabitsSystemPrompt,
  generateHabitsUserPrompt,
  regenerateHabitsSystemPrompt,
  regenerateHabitsUserPrompt,
} from "@/lib/ai/prompts";
import { toUtcMidnight, transformHabitsToLockStatus } from "@/lib/helpers";
import prisma from "@/lib/db";
import { HabitFrequency } from "@/lib/generated/prisma/enums";

const GenerateHabitsSchema = z.object({
  goal: z.string().min(5),
  additionalDetails: z.string().optional(),
  count: z.number().min(1).max(10).default(5),
});
type generateHabitsSchema = z.input<typeof GenerateHabitsSchema>;

export const generateHabits = async ({
  goal,
  additionalDetails,
  count = 5,
}: generateHabitsSchema) => {
  try {
    // 1. Validate input
    const validated = GenerateHabitsSchema.safeParse({
      goal,
      additionalDetails,
      count,
    });
    if (!validated.success) {
      console.error("generateHabits validation error", validated.error);
      return { success: false, error: "Please provide a valid goal" };
    }
    // 2. Get authenticated user
    const session = await auth.api.getSession({
      headers: await headers(), // you need to pass the headers object.
    });
    if (!session?.user) {
      console.error("generateHabits unauthorized");
      return { success: false, error: "Unauthorized" };
    }
    // 3. Call AI API

    const userPrompt = generateHabitsUserPrompt({
      goal,
      additionalDetails,
      count,
    });
    const systemPrompt = generateHabitsSystemPrompt();

    const response = await genAI.models.generateContent({
      model: "gemini-3.5-flash-lite",
      contents: userPrompt,
      config: {
        systemInstruction: systemPrompt,
        temperature: 0.8,
        maxOutputTokens: 750,
        responseMimeType: "application/json",
      },
    });

    // 4. Parse the response

    if (!response.text) {
      return { success: false, error: "Failed to generate habits" };
    }

    const content = response.text;

    let parsed: { habits?: string[] };

    try {
      parsed = JSON.parse(content);
    } catch (error) {
      console.error("generateHabits parse error", error);
      return { success: false, error: "Failed to generate habits" };
    }

    const habitsWithLockStatus = transformHabitsToLockStatus(
      parsed.habits ?? [],
    );

    return {
      success: true,
      data: habitsWithLockStatus,
    };

    // 5. Return the habits
  } catch (error) {
    console.error("Error generating habits:", error);
    return { success: false, error: "Failed to generate habits" };
  }
};

type regenerateHabitsSchema = {
  goal: string;
  additionalDetails?: string;
  count: number;
  lockedHabits: string[];
};

export const regenerateHabits = async ({
  goal,
  additionalDetails,
  count,
  lockedHabits,
}: regenerateHabitsSchema) => {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    if (!session?.user) {
      return { success: false, error: "Unauthorized" };
    }

    const userPrompt = regenerateHabitsUserPrompt({
      goal,
      additionalDetails,
      count,
      lockedHabits,
    });
    const systemPrompt = regenerateHabitsSystemPrompt();

    const response = await genAI.models.generateContent({
      model: "gemini-3.5-flash-lite",
      contents: userPrompt,
      config: {
        systemInstruction: systemPrompt,
        temperature: 0.8,
        maxOutputTokens: 750,
        responseMimeType: "application/json",
      },
    });

    if (!response.text) {
      return { success: false, error: "Failed to generate habits" };
    }

    let parsed: { habits?: string[] };
    try {
      parsed = JSON.parse(response.text);
    } catch {
      return { success: false, error: "Invalid response from AI" };
    }

    if (!Array.isArray(parsed?.habits)) {
      return { success: false, error: "Failed to generate habits" };
    }
    const newHabitsWithLockStatus = transformHabitsToLockStatus(parsed.habits);
    return {
      success: true,
      data: newHabitsWithLockStatus,
    };
  } catch (error) {
    console.error("Error regenerating habits:", error);
    return { success: false, error: "Failed to generate habits" };
  }
};

const SaveHabitsSchema = z.object({
  goal: z.string().min(5),
  additionalDetails: z.string().optional(),
  habits: z
    .array(
      z.object({
        text: z.string().min(1),
        locked: z.boolean().optional(), // UI-only, not saved
        id: z.string().optional(),
      }),
    )
    .min(1, "At least one habit is required"),
});

type SaveHabitsInput = z.infer<typeof SaveHabitsSchema>;

export const saveHabits = async (input: SaveHabitsInput) => {
  try {
    // 1. Validate
    const validated = SaveHabitsSchema.safeParse(input);
    if (!validated.success) {
      console.error("saveHabits validation error", validated.error);
      return { success: false, error: "Invalid data" };
    }

    const { goal, additionalDetails, habits } = validated.data;

    // 2. Auth
    let session = null;
    try {
      session = await auth.api.getSession({
        headers: await headers(),
      });
    } catch (err) {
      console.error("Failed to get session:", err);
      return { success: false, error: "Unauthorized" };
    }

    if (!session?.user?.id) {
      return { success: false, error: "Unauthorized" };
    }

    const userId = session.user.id;

    // 3. Create Goal + Habits

    const createdGoal = await prisma.goal.create({
      data: {
        userId,
        title: goal,
        description: additionalDetails ?? null,
        aiGenerated: true,
        aiPrompt: additionalDetails
          ? `${goal}\n\nAdditional context: ${additionalDetails}`
          : goal,
        habits: {
          create: habits.map((habit, index) => ({
            name: habit.text, // client "text" → DB "name"
            frequency: HabitFrequency.DAILY, // your AI generates daily habits
            aiGenerated: true,
            order: index,
            // status defaults to ACTIVE
            // difficulty defaults to MEDIUM
          })),
        },
      },
      include: {
        habits: {
          orderBy: { order: "asc" },
        },
      },
    });

    revalidatePath("/dashboard");

    return {
      success: true,
      data: createdGoal,
    };
  } catch (error) {
    console.error("Error saving habits:", error);
    return {
      success: false,
      error: "Failed to save habits",
    };
  }
};
const ToggleHabitLogSchema = z.object({
  habitId: z.string().min(1),
  date: z.string().or(z.date()),
});
export const toggleHabitLog = async (input: {
  habitId: string;
  date: string | Date;
}) => {
  try {
    // 1. Zod Validation
    const validated = ToggleHabitLogSchema.safeParse(input);
    if (!validated.success) {
      console.error("toggleHabitLog validation error", validated.error);
      return { success: false, error: "Invalid data" };
    }
    const { habitId, date } = validated.data;
    // 2. Auth Check
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    if (!session?.user?.id) {
      return { success: false, error: "Unauthorized" };
    }

    // 3. normalize Date to UTC Midnight

    const normalizedDate = toUtcMidnight(date);

    // 4. IDOR Guard + Check existing log;

    const habit = await prisma.habit.findFirst({
      where: {
        id: habitId,
        goal: {
          userId: session.user.id,
        },
      },
      include: {
        logs: {
          where: {
            date: normalizedDate,
          },
        },
      },
    });

    if (!habit) {
      return { success: false, error: "Habit not found" };
    }
    // 5. Upsert toggle
    const existingLog = habit.logs[0];
    const nextCompleted = existingLog ? !existingLog.completed : true;
    const log = await prisma.habitLog.upsert({
      where: {
        habitId_date: {
          habitId,
          date: normalizedDate,
        },
      },
      create: {
        habitId,
        date: normalizedDate,
        completed: true,
      },
      update: {
        completed: nextCompleted,
      },
    });
    // 6. Revalidate Cache
    revalidatePath("/dashboard");
    return { success: true, data: log };
  } catch (error) {
    console.error("Error toggling habit log:", error);
    return { success: false, error: "Failed to toggle habit log" };
  }
};
