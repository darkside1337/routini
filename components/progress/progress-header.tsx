"use client";

import React from "react";
import { Flame } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface ProgressHeaderProps {
  currentStreak: number;
}

export default function ProgressHeader({ currentStreak }: ProgressHeaderProps) {
  return (
    <section className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <div className="flex items-center gap-2.5">
          <h1 className="text-xl md:text-3xl font-bold tracking-tight text-foreground">
            Progress & Momentum
          </h1>
          {currentStreak > 0 && (
            <Badge
              variant="outline"
              className="gap-1 px-2 py-0.5 border-amber-500/40 bg-amber-500/10 text-amber-600 dark:text-amber-400 font-semibold text-xs"
            >
              <Flame className="size-3.5 fill-amber-500 text-amber-500" />
              <span>{currentStreak} Day Streak</span>
            </Badge>
          )}
        </div>
        <p className="text-sm text-muted-foreground mt-1">
          Review your habit completion matrix, consistency trends, and individual streaks
        </p>
      </div>
    </section>
  );
}
