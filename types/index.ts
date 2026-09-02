export type Habit = {
  id: string;
  text: string;
  time?: string;
};

export type HabitWithLockStatus = Habit & { locked: boolean };

export type DashboardHabit = {
  id: string;
  name: string;
  frequency?: string;
  status?: string;
  order?: number;
  completedToday?: boolean;
  streak?: number;
};

export type GoalWithHabits = {
  id: string;
  title: string;
  description?: string | null;
  status: string;
  priority: string;
  startDate: string | Date;
  targetDate?: string | Date | null;
  completedAt?: string | Date | null;
  userId?: string;
  habits?: DashboardHabit[];
};

export type GoalFilter = "ALL" | "IN_PROGRESS" | "COMPLETED";

export const GOAL_FILTERS: { label: string; value: GoalFilter }[] = [
  { label: "All", value: "ALL" },
  { label: "In Progress", value: "IN_PROGRESS" },
  { label: "Completed", value: "COMPLETED" },
];
