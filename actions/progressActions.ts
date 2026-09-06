"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/db";
import { headers } from "next/headers";
import { toUtcMidnight } from "@/lib/helpers";

export type ActivityDay = {
  date: string; // "YYYY-MM-DD"
  count: number;
  level: 0 | 1 | 2 | 3 | 4;
};

export type HabitPerformance = {
  id: string;
  name: string;
  goalTitle: string;
  currentStreak: number;
  bestStreak: number;
  totalCompletions: number;
  completionRateLast30Days: number; // percentage 0-100
};

export type ProgressStatsData = {
  activities: ActivityDay[];
  totalCompletions: number;
  currentStreak: number;
  bestStreak: number;
  completionRate30Days: number;
  activeHabitsCount: number;
  habitBreakdown: HabitPerformance[];
};

export type ProgressStatsResponse =
  | { success: true; data: ProgressStatsData }
  | { success: false; error: string };

function formatDateKey(date: Date): string {
  const y = date.getUTCFullYear();
  const m = String(date.getUTCMonth() + 1).padStart(2, "0");
  const d = String(date.getUTCDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function computeLevel(count: number): 0 | 1 | 2 | 3 | 4 {
  if (count <= 0) return 0;
  if (count === 1) return 1;
  if (count === 2) return 2;
  if (count === 3) return 3;
  return 4;
}

export async function getProgressStats(): Promise<ProgressStatsResponse> {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user?.id) {
      return { success: false, error: "Unauthorized" };
    }

    const userId = session.user.id;
    const now = new Date();
    const todayUtc = toUtcMidnight(now);
    const ONE_DAY_MS = 24 * 60 * 60 * 1000;

    // 365 days window (today minus 364 days to today inclusive)
    const startDate = new Date(todayUtc.getTime() - 364 * ONE_DAY_MS);
    const thirtyDaysAgo = new Date(todayUtc.getTime() - 29 * ONE_DAY_MS);

    // Fetch user's goals with habits and their logs
    const goals = await prisma.goal.findMany({
      where: { userId },
      include: {
        habits: {
          include: {
            logs: {
              where: {
                completed: true,
              },
              orderBy: { date: "asc" },
            },
          },
        },
      },
    });

    // Flatten habits
    const allHabits = goals.flatMap((g) =>
      g.habits.map((h) => ({
        ...h,
        goalTitle: g.title,
      }))
    );

    const activeHabits = allHabits.filter((h) => h.status === "ACTIVE");

    // Map daily completion counts across all habits
    const dailyCountsMap = new Map<string, number>();
    let totalCompletions = 0;
    let completionsLast30Days = 0;

    allHabits.forEach((habit) => {
      habit.logs.forEach((log) => {
        totalCompletions++;
        const key = formatDateKey(toUtcMidnight(log.date));
        dailyCountsMap.set(key, (dailyCountsMap.get(key) || 0) + 1);

        if (toUtcMidnight(log.date) >= thirtyDaysAgo) {
          completionsLast30Days++;
        }
      });
    });

    // Generate contiguous 365 days list
    const activities: ActivityDay[] = [];
    for (let i = 0; i < 365; i++) {
      const dayDate = new Date(startDate.getTime() + i * ONE_DAY_MS);
      const dateKey = formatDateKey(dayDate);
      const count = dailyCountsMap.get(dateKey) || 0;
      activities.push({
        date: dateKey,
        count,
        level: computeLevel(count),
      });
    }

    // Calculate overall daily streak (at least 1 habit completed per day)
    let currentStreak = 0;
    let bestStreak = 0;
    let tempStreak = 0;

    // Check backwards from today for current streak
    const completedDaysSet = new Set(dailyCountsMap.keys());
    const todayKey = formatDateKey(todayUtc);

    const completedToday = (dailyCountsMap.get(todayKey) || 0) > 0;
    let checkTime = completedToday ? todayUtc.getTime() : todayUtc.getTime() - ONE_DAY_MS;

    while (completedDaysSet.has(formatDateKey(new Date(checkTime)))) {
      currentStreak++;
      checkTime -= ONE_DAY_MS;
    }

    // Best streak over the 365 day window
    activities.forEach((act) => {
      if (act.count > 0) {
        tempStreak++;
        if (tempStreak > bestStreak) {
          bestStreak = tempStreak;
        }
      } else {
        tempStreak = 0;
      }
    });

    // 30-day rate: percentage of possible completions (activeHabits * 30 days)
    const possibleLast30 = activeHabits.length * 30;
    const completionRate30Days =
      possibleLast30 > 0
        ? Math.min(100, Math.round((completionsLast30Days / possibleLast30) * 100))
        : 0;

    // Habit breakdown
    const habitBreakdown: HabitPerformance[] = activeHabits.map((habit) => {
      const habitLogs = habit.logs;
      const habitLogDays = new Set(
        habitLogs.map((l) => formatDateKey(toUtcMidnight(l.date)))
      );

      // Current habit streak
      let hCurrentStreak = 0;
      const hCompletedToday = habitLogDays.has(todayKey);
      let hCheckTime = hCompletedToday ? todayUtc.getTime() : todayUtc.getTime() - ONE_DAY_MS;

      while (habitLogDays.has(formatDateKey(new Date(hCheckTime)))) {
        hCurrentStreak++;
        hCheckTime -= ONE_DAY_MS;
      }

      // Best streak for habit
      let hBestStreak = 0;
      let hTempStreak = 0;

      // Sort unique timestamps
      const sortedTimestamps = Array.from(habitLogDays)
        .map((k) => new Date(k + "T00:00:00Z").getTime())
        .sort((a, b) => a - b);

      for (let i = 0; i < sortedTimestamps.length; i++) {
        if (i === 0) {
          hTempStreak = 1;
        } else {
          const diff = sortedTimestamps[i] - sortedTimestamps[i - 1];
          if (diff === ONE_DAY_MS) {
            hTempStreak++;
          } else {
            hTempStreak = 1;
          }
        }
        if (hTempStreak > hBestStreak) {
          hBestStreak = hTempStreak;
        }
      }

      // 30 day completion rate for this habit
      let h30DayCompletions = 0;
      habitLogs.forEach((l) => {
        if (toUtcMidnight(l.date) >= thirtyDaysAgo) {
          h30DayCompletions++;
        }
      });
      const hRate = Math.min(100, Math.round((h30DayCompletions / 30) * 100));

      return {
        id: habit.id,
        name: habit.name,
        goalTitle: habit.goalTitle,
        currentStreak: hCurrentStreak,
        bestStreak: Math.max(hBestStreak, hCurrentStreak),
        totalCompletions: habitLogs.length,
        completionRateLast30Days: hRate,
      };
    });

    return {
      success: true,
      data: {
        activities,
        totalCompletions,
        currentStreak,
        bestStreak: Math.max(bestStreak, currentStreak),
        completionRate30Days,
        activeHabitsCount: activeHabits.length,
        habitBreakdown,
      },
    };
  } catch (error) {
    console.error("getProgressStats error:", error);
    return {
      success: false,
      error: "Failed to load progress statistics.",
    };
  }
}
