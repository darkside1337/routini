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
import { HabitFrequency, HabitDifficulty, HabitStatus } from "@/lib/generated/prisma/enums";
import { withTimeout } from "@/lib/ai/ai-utils";
import { checkRateLimit } from "@/lib/rate-limit";

const AI_GENERATION_TIMEOUT_MS = 15_000;
const RATE_LIMIT_COUNT = 5;
const RATE_LIMIT_WINDOW_MS = 60_000;

const GenerateHabitsSchema = z.object({
  goal: z.string().min(5),
  additionalDetails: z.string().optional(),
  count: z.number().min(1).max(10).default(5),
});
type generateHabitsSchema = z.input<typeof GenerateHabitsSchema>;

const AiHabitItemSchema = z.object({
  name: z.string().min(3),
  frequency: z.enum(HabitFrequency).catch(HabitFrequency.DAILY),
  targetDuration: z.number().int().positive().optional().nullable(),
  difficulty: z.enum(HabitDifficulty).catch(HabitDifficulty.MEDIUM),
  aiReasoning: z.string().optional().nullable(),
});

// Resilient schema: accepts either structured habit items or string fallbacks
const AiHabitResponseSchema = z.object({
  habits: z
    .array(
      z.union([
        z.string().min(3).transform((str) => ({
          name: str,
          frequency: HabitFrequency.DAILY,
          targetDuration: null,
          difficulty: HabitDifficulty.MEDIUM,
          aiReasoning: null,
        })),
        AiHabitItemSchema,
      ]),
    )
    .min(1)
    .max(10),
});

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
      headers: await headers(),
    });
    if (!session?.user?.id) {
      console.error("generateHabits unauthorized");
      return { success: false, error: "Unauthorized" };
    }

    // 3. Rate Limit Check
    const rateLimit = checkRateLimit(
      session.user.id,
      RATE_LIMIT_COUNT,
      RATE_LIMIT_WINDOW_MS,
    );
    if (!rateLimit.success) {
      return {
        success: false,
        error: `You're generating habits too quickly. Please wait ${rateLimit.retryAfter}s before trying again.`,
      };
    }

    // 3.5. Fetch user preferences
    const userPrefs = await prisma.userPreferences.findUnique({
      where: { userId: session.user.id },
      select: { preferredTone: true },
    });

    // 4. Call AI API with explicit timeout
    const userPrompt = generateHabitsUserPrompt({
      goal,
      additionalDetails,
      count,
    });
    const systemPrompt = generateHabitsSystemPrompt(userPrefs?.preferredTone);

    const response = await withTimeout(
      genAI.models.generateContent({
        model: "gemini-3.5-flash-lite",
        contents: userPrompt,
        config: {
          systemInstruction: systemPrompt,
          temperature: 0.8,
          maxOutputTokens: 1000,
          responseMimeType: "application/json",
        },
      }),
      AI_GENERATION_TIMEOUT_MS,
      "Generation timed out. Please try again.",
    );

    // 5. Parse and Zod-validate the response
    if (!response.text) {
      return { success: false, error: "Failed to generate habits. Empty response from AI." };
    }

    let parsed: unknown;
    try {
      parsed = JSON.parse(response.text);
    } catch (error) {
      console.error("generateHabits JSON parse error", error);
      return { success: false, error: "Failed to parse AI response. Please try again." };
    }

    const validatedOutput = AiHabitResponseSchema.safeParse(parsed);
    if (!validatedOutput.success) {
      console.error("generateHabits LLM shape validation error", validatedOutput.error);
      return { success: false, error: "AI returned invalid habit format. Please try again." };
    }

    const habitsWithLockStatus = transformHabitsToLockStatus(validatedOutput.data.habits);

    return {
      success: true,
      data: habitsWithLockStatus,
    };
  } catch (error) {
    console.error("Error generating habits:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Failed to generate habits";
    return { success: false, error: errorMessage };
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
    if (!session?.user?.id) {
      return { success: false, error: "Unauthorized" };
    }

    // Rate Limit Check
    const rateLimit = checkRateLimit(
      session.user.id,
      RATE_LIMIT_COUNT,
      RATE_LIMIT_WINDOW_MS,
    );
    if (!rateLimit.success) {
      return {
        success: false,
        error: `You're regenerating habits too quickly. Please wait ${rateLimit.retryAfter}s before trying again.`,
      };
    }

    // 3.5. Fetch user preferences
    const userPrefs = await prisma.userPreferences.findUnique({
      where: { userId: session.user.id },
      select: { preferredTone: true },
    });

    const userPrompt = regenerateHabitsUserPrompt({
      goal,
      additionalDetails,
      count,
      lockedHabits,
    });
    const systemPrompt = regenerateHabitsSystemPrompt(userPrefs?.preferredTone);

    const response = await withTimeout(
      genAI.models.generateContent({
        model: "gemini-3.5-flash-lite",
        contents: userPrompt,
        config: {
          systemInstruction: systemPrompt,
          temperature: 0.8,
          maxOutputTokens: 1000,
          responseMimeType: "application/json",
        },
      }),
      AI_GENERATION_TIMEOUT_MS,
      "Generation timed out. Please try again.",
    );

    if (!response.text) {
      return { success: false, error: "Failed to generate habits. Empty response from AI." };
    }

    let parsed: unknown;
    try {
      parsed = JSON.parse(response.text);
    } catch {
      return { success: false, error: "Invalid response from AI. Please try again." };
    }

    const validatedOutput = AiHabitResponseSchema.safeParse(parsed);
    if (!validatedOutput.success) {
      console.error("regenerateHabits LLM shape validation error", validatedOutput.error);
      return { success: false, error: "AI returned invalid habit format. Please try again." };
    }

    const newHabitsWithLockStatus = transformHabitsToLockStatus(validatedOutput.data.habits);
    return {
      success: true,
      data: newHabitsWithLockStatus,
    };
  } catch (error) {
    console.error("Error regenerating habits:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Failed to generate habits";
    return { success: false, error: errorMessage };
  }
};

const SaveHabitsSchema = z.object({
  goal: z.string().min(5),
  additionalDetails: z.string().optional(),
  habits: z
    .array(
      z.object({
        text: z.string().min(1),
        frequency: z.enum(HabitFrequency).optional(),
        targetDuration: z.number().int().optional().nullable(),
        difficulty: z.enum(HabitDifficulty).optional(),
        aiReasoning: z.string().optional().nullable(),
        locked: z.boolean().optional(),
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

    // 3. Create Goal + Habits with enriched attributes
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
            name: habit.text,
            frequency: habit.frequency ?? HabitFrequency.DAILY,
            targetDuration: habit.targetDuration ?? null,
            difficulty: habit.difficulty ?? HabitDifficulty.MEDIUM,
            aiReasoning: habit.aiReasoning ?? null,
            aiGenerated: true,
            order: index,
          })),
        },
      },
      include: {
        habits: {
          orderBy: { order: "asc" },
        },
      },
    });

    // 4. Mark onboarding completed if not already done
    await prisma.userPreferences.upsert({
      where: { userId },
      create: {
        userId,
        hasCompletedOnboarding: true,
      },
      update: {
        hasCompletedOnboarding: true,
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

const UpdateHabitSchema = z.object({
  habitId: z.string().min(1),
  name: z.string().trim().min(1, "Habit name cannot be empty").optional(),
  status: z.enum(HabitStatus).optional(),
  frequency: z.enum(HabitFrequency).optional(),
  targetDuration: z.number().int().positive().optional().nullable(),
  difficulty: z.enum(HabitDifficulty).optional(),
});

export type UpdateHabitInput = z.infer<typeof UpdateHabitSchema>;

export const updateHabit = async (input: UpdateHabitInput) => {
  try {
    const validated = UpdateHabitSchema.safeParse(input);
    if (!validated.success) {
      return {
        success: false,
        error: validated.error.issues[0]?.message || "Invalid input",
      };
    }

    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user?.id) {
      return { success: false, error: "Unauthorized" };
    }

    const { habitId, name, status, frequency, targetDuration, difficulty } =
      validated.data;

    // IDOR check: habit must belong to a goal owned by current user
    const habit = await prisma.habit.findFirst({
      where: {
        id: habitId,
        goal: {
          userId: session.user.id,
        },
      },
    });

    if (!habit) {
      return { success: false, error: "Habit not found" };
    }

    const updatedHabit = await prisma.habit.update({
      where: { id: habitId },
      data: {
        ...(name !== undefined ? { name } : {}),
        ...(status !== undefined ? { status } : {}),
        ...(frequency !== undefined ? { frequency } : {}),
        ...(targetDuration !== undefined ? { targetDuration } : {}),
        ...(difficulty !== undefined ? { difficulty } : {}),
      },
    });

    revalidatePath("/dashboard");

    return {
      success: true,
      data: updatedHabit,
    };
  } catch (error) {
    console.error("Error updating habit:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to update habit",
    };
  }
};

const DeleteHabitSchema = z.object({
  habitId: z.string().min(1),
});

export type DeleteHabitInput = z.infer<typeof DeleteHabitSchema>;

export const deleteHabit = async (input: DeleteHabitInput) => {
  try {
    const validated = DeleteHabitSchema.safeParse(input);
    if (!validated.success) {
      return { success: false, error: "Invalid habit ID" };
    }

    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user?.id) {
      return { success: false, error: "Unauthorized" };
    }

    const { habitId } = validated.data;

    // IDOR check
    const habit = await prisma.habit.findFirst({
      where: {
        id: habitId,
        goal: {
          userId: session.user.id,
        },
      },
    });

    if (!habit) {
      return { success: false, error: "Habit not found" };
    }

    await prisma.habit.delete({
      where: { id: habitId },
    });

    revalidatePath("/dashboard");

    return {
      success: true,
    };
  } catch (error) {
    console.error("Error deleting habit:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to delete habit",
    };
  }
};

const CreateHabitSchema = z.object({
  goalId: z.string().min(1),
  name: z.string().trim().min(1, "Habit name is required"),
  frequency: z.enum(HabitFrequency).optional().default(HabitFrequency.DAILY),
  targetDuration: z.number().int().positive().optional().nullable(),
  difficulty: z.enum(HabitDifficulty).optional().default(HabitDifficulty.MEDIUM),
});

export type CreateHabitInput = z.input<typeof CreateHabitSchema>;

export const createHabit = async (input: CreateHabitInput) => {
  try {
    const validated = CreateHabitSchema.safeParse(input);
    if (!validated.success) {
      return {
        success: false,
        error: validated.error.issues[0]?.message || "Invalid input",
      };
    }

    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user?.id) {
      return { success: false, error: "Unauthorized" };
    }

    const { goalId, name, frequency, targetDuration, difficulty } =
      validated.data;

    // IDOR check: goal must belong to current user
    const goal = await prisma.goal.findFirst({
      where: {
        id: goalId,
        userId: session.user.id,
      },
    });

    if (!goal) {
      return { success: false, error: "Goal not found" };
    }

    // Determine order
    const maxOrderHabit = await prisma.habit.findFirst({
      where: { goalId },
      orderBy: { order: "desc" },
      select: { order: true },
    });
    const nextOrder = (maxOrderHabit?.order ?? -1) + 1;

    const habit = await prisma.habit.create({
      data: {
        goalId,
        name,
        frequency,
        targetDuration: targetDuration ?? null,
        difficulty,
        order: nextOrder,
        aiGenerated: false,
      },
    });

    revalidatePath("/dashboard");

    return {
      success: true,
      data: habit,
    };
  } catch (error) {
    console.error("Error creating habit:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to create habit",
    };
  }
};

