"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/db";
import { calculateHabitStats } from "@/lib/helpers";
import { GoalWithHabits, GoalFilter } from "@/types";
import { headers } from "next/headers";

export type { GoalWithHabits };

export type GetGoalsResponse =
  | { success: true; data: GoalWithHabits[] }
  | { success: false; error: string };

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
