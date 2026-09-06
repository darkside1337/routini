"use client";

import React from "react";
import { CheckCircle2, Flame, Trophy, TrendingUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface StatsSummaryCardsProps {
  totalCompletions: number;
  currentStreak: number;
  bestStreak: number;
  completionRate30Days: number;
  activeHabitsCount: number;
}

export default function StatsSummaryCards({
  totalCompletions,
  currentStreak,
  bestStreak,
  completionRate30Days,
  activeHabitsCount,
}: StatsSummaryCardsProps) {
  const cards = [
    {
      title: "Total Check-ins",
      value: totalCompletions,
      subtitle: `Across ${activeHabitsCount} active habit${activeHabitsCount === 1 ? "" : "s"}`,
      icon: CheckCircle2,
      color: "text-emerald-600 dark:text-emerald-400",
      bg: "bg-emerald-500/10 dark:bg-emerald-500/20",
    },
    {
      title: "Current Streak",
      value: `${currentStreak} day${currentStreak === 1 ? "" : "s"}`,
      subtitle: currentStreak > 0 ? "Keep the momentum going!" : "Check in today to start",
      icon: Flame,
      color: "text-amber-600 dark:text-amber-400",
      bg: "bg-amber-500/10 dark:bg-amber-500/20",
    },
    {
      title: "Best Streak",
      value: `${bestStreak} day${bestStreak === 1 ? "" : "s"}`,
      subtitle: "All-time personal record",
      icon: Trophy,
      color: "text-indigo-600 dark:text-indigo-400",
      bg: "bg-indigo-500/10 dark:bg-indigo-500/20",
    },
    {
      title: "30-Day Consistency",
      value: `${completionRate30Days}%`,
      subtitle: "Trailing 30-day habit success rate",
      icon: TrendingUp,
      color: "text-teal-600 dark:text-teal-400",
      bg: "bg-teal-500/10 dark:bg-teal-500/20",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <Card
            key={card.title}
            className="border-border/60 shadow-xs hover:border-border transition-colors"
          >
            <CardContent className="p-4 sm:p-5 flex flex-col justify-between h-full space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs sm:text-sm font-medium text-muted-foreground truncate">
                  {card.title}
                </span>
                <div className={`p-2 rounded-xl ${card.bg}`}>
                  <Icon className={`size-4 sm:size-4.5 ${card.color}`} />
                </div>
              </div>
              <div>
                <p className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
                  {card.value}
                </p>
                <p className="text-[11px] sm:text-xs text-muted-foreground truncate mt-0.5">
                  {card.subtitle}
                </p>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
