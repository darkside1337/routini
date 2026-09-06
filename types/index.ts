import {
  Prisma,
  GoalStatus,
  GoalPriority,
  HabitFrequency,
  HabitStatus,
  HabitDifficulty,
  Habit as PrismaHabit,
} from "@/lib/generated/prisma/client";

export type {
  GoalStatus,
  GoalPriority,
  HabitFrequency,
  HabitStatus,
  HabitDifficulty,
};

export type Habit = {
  id: string;
  text: string;
  frequency?: HabitFrequency;
  targetDuration?: number | null;
  difficulty?: HabitDifficulty;
  aiReasoning?: string | null;
  time?: string;
};

export type HabitWithLockStatus = Habit & { locked: boolean };

export type DashboardHabit = PrismaHabit & {
  completedToday?: boolean;
  streak?: number;
};

export type GoalWithHabits = Omit<
  Prisma.GoalGetPayload<{
    include: {
      habits: {
        orderBy: {
          order: "asc";
        };
      };
    };
  }>,
  "habits"
> & {
  habits: DashboardHabit[];
};

export type GoalFilter = "ALL" | "IN_PROGRESS" | "COMPLETED";

export const GOAL_FILTERS: { label: string; value: GoalFilter }[] = [
  { label: "All", value: "ALL" },
  { label: "In Progress", value: "IN_PROGRESS" },
  { label: "Completed", value: "COMPLETED" },
];
