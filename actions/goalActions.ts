"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/db";
import { calculateHabitStats } from "@/lib/helpers";
import { GoalWithHabits, GoalFilter } from "@/types";
import { headers } from "next/headers";

import { revalidatePath } from "next/cache";
import * as z from "zod";
import { GoalStatus, GoalPriority } from "@/lib/generated/prisma/enums";

export type { GoalWithHabits };

export type GetGoalsResponse =
  | { success: true; data: GoalWithHabits[] }
  | { success: false; error: string };

const UpdateGoalSchema = z.object({
  goalId: z.string().min(1),
  title: z.string().trim().min(3, "Title must be at least 3 characters").max(100),
  description: z.string().trim().optional().nullable(),
  status: z.enum(GoalStatus),
  priority: z.enum(GoalPriority),
  targetDate: z.string().or(z.date()).optional().nullable(),
});

export type UpdateGoalInput = z.infer<typeof UpdateGoalSchema>;

const DeleteGoalSchema = z.object({
  goalId: z.string().min(1),
});

export type DeleteGoalInput = z.infer<typeof DeleteGoalSchema>;

export const getGoals = async (
  filter?: GoalFilter,
): Promise<GetGoalsResponse> => {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user?.id) {
      return {
        success: false,
        error: "Unauthorized",
      };
    }

    const goals = await prisma.goal.findMany({
      where: {
        userId: session.user.id,
        ...(filter && filter !== "ALL" ? { status: filter } : {}),
      },
      include: {
        habits: {
          orderBy: { order: "asc" },
          include: {
            logs: {
              orderBy: { date: "desc" },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // map over habits & populate with completedToday and streaks

    const goalsWithStats = goals.map((goal) => {
      return {
        ...goal,
        habits: goal.habits.map((habit) => {
          const { completedToday, streak } = calculateHabitStats(habit.logs);
          return {
            ...habit,
            completedToday,
            streak,
          };
        }),
      };
    });

    return {
      success: true,
      data: goalsWithStats,
    };
  } catch (error) {
    console.error("Error fetching goals:", error);
    return {
      success: false,
      error: "Failed to fetch goals",
    };
  }
};

export const updateGoal = async (input: UpdateGoalInput) => {
  try {
    const validated = UpdateGoalSchema.safeParse(input);
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

    const { goalId, title, description, status, priority, targetDate } =
      validated.data;

    // IDOR check: verify goal belongs to current user
    const existingGoal = await prisma.goal.findFirst({
      where: {
        id: goalId,
        userId: session.user.id,
      },
    });

    if (!existingGoal) {
      return { success: false, error: "Goal not found" };
    }

    // Sync completedAt timestamp based on status transition
    let completedAt = existingGoal.completedAt;
    if (
      status === GoalStatus.COMPLETED &&
      existingGoal.status !== GoalStatus.COMPLETED
    ) {
      completedAt = new Date();
    } else if (status !== GoalStatus.COMPLETED) {
      completedAt = null;
    }

    const parsedTargetDate = targetDate ? new Date(targetDate) : null;

    const updatedGoal = await prisma.goal.update({
      where: {
        id: goalId,
      },
      data: {
        title,
        description: description ?? null,
        status,
        priority,
        targetDate: parsedTargetDate,
        completedAt,
      },
    });

    revalidatePath("/dashboard");

    return {
      success: true,
      data: updatedGoal,
    };
  } catch (error) {
    console.error("Error updating goal:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to update goal",
    };
  }
};

export const deleteGoal = async (input: DeleteGoalInput) => {
  try {
    const validated = DeleteGoalSchema.safeParse(input);
    if (!validated.success) {
      return { success: false, error: "Invalid goal ID" };
    }

    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user?.id) {
      return { success: false, error: "Unauthorized" };
    }

    const { goalId } = validated.data;

    // IDOR check: verify goal belongs to current user
    const existingGoal = await prisma.goal.findFirst({
      where: {
        id: goalId,
        userId: session.user.id,
      },
    });

    if (!existingGoal) {
      return { success: false, error: "Goal not found" };
    }

    // Deleting the goal will automatically cascade delete habits and logs per Prisma schema
    await prisma.goal.delete({
      where: {
        id: goalId,
      },
    });

    revalidatePath("/dashboard");

    return {
      success: true,
    };
  } catch (error) {
    console.error("Error deleting goal:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to delete goal",
    };
  }
};

