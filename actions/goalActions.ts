"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/db";
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
          orderBy: {
            order: "asc",
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return {
      success: true,
      data: goals,
    };
  } catch (error) {
    console.error("Error fetching goals:", error);
    return {
      success: false,
      error: "Failed to fetch goals",
    };
  }
};
