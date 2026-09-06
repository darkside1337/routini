"use client";

import React from "react";
import { HabitPerformance } from "@/actions/progressActions";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Flame, Trophy, CheckCircle, BarChart2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

interface HabitPerformanceListProps {
  habits: HabitPerformance[];
}

export default function HabitPerformanceList({ habits }: HabitPerformanceListProps) {
  if (habits.length === 0) {
    return null;
  }

  return (
    <Card className="border-border/60 shadow-xs">
      <CardHeader className="p-4 sm:p-6 pb-2 sm:pb-3">
        <CardTitle className="text-base sm:text-lg font-semibold flex items-center gap-2">
          <BarChart2 className="size-4 text-primary" />
          <span>Active Habits Breakdown</span>
        </CardTitle>
        <CardDescription className="text-xs sm:text-sm">
          Streak and consistency breakdown for each active habit
        </CardDescription>
      </CardHeader>

      <CardContent className="p-4 sm:p-6 pt-2 sm:pt-3 space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
          {habits.map((habit) => (
            <div
              key={habit.id}
              className="p-3.5 sm:p-4 rounded-xl border border-border/60 bg-card hover:border-border transition-colors space-y-3"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <h4 className="font-semibold text-sm text-foreground truncate">
                    {habit.name}
                  </h4>
                  <p className="text-xs text-muted-foreground truncate mt-0.5">
                    Goal: {habit.goalTitle}
                  </p>
                </div>
                <Badge
                  variant="outline"
                  className="shrink-0 gap-1 px-2 py-0.5 font-semibold text-xs border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400"
                >
                  <Flame className="size-3 fill-amber-500 text-amber-500" />
                  <span>{habit.currentStreak}d</span>
                </Badge>
              </div>

              {/* Progress bar for 30-day rate */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>30-Day Consistency</span>
                  <span className="font-medium text-foreground">
                    {habit.completionRateLast30Days}%
                  </span>
                </div>
                <Progress value={habit.completionRateLast30Days} className="h-1.5" />
              </div>

              {/* Stats Footer */}
              <div className="flex items-center justify-between pt-1 border-t border-border/40 text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Trophy className="size-3 text-indigo-500" />
                  <span>Best: <strong>{habit.bestStreak}d</strong></span>
                </div>
                <div className="flex items-center gap-1">
                  <CheckCircle className="size-3 text-emerald-500" />
                  <span>Total: <strong>{habit.totalCompletions}</strong></span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
