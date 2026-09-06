"use client";

import { Lock, Unlock, Clock, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import { HabitWithLockStatus } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";

interface HabitCardProps {
  habit: HabitWithLockStatus;
  onToggle: (id: string) => void;
  disabled?: boolean;
}

export function SelectableHabitCard({
  habit,
  onToggle,
  disabled = false,
}: HabitCardProps) {
  const { id, text, locked, targetDuration, difficulty, aiReasoning } = habit;

  return (
    <Button
      type="button"
      variant="outline"
      role="checkbox"
      aria-checked={locked}
      aria-label={`${text} - ${locked ? "Pinned habit, click to unpin" : "Unlocked habit, click to pin"}`}
      onClick={() => onToggle(id)}
      disabled={disabled}
      className={cn(
        "group relative w-full h-auto text-left justify-start items-start p-3.5 rounded-xl border transition-all duration-200 select-none whitespace-normal",
        locked
          ? "border-primary/50 bg-primary/5 hover:bg-primary/8 shadow-xs text-foreground"
          : "border-border/80 bg-card hover:bg-muted/30 hover:border-border text-foreground/90",
      )}
    >
      <div className="flex items-start justify-between gap-3 w-full">
        <div className="flex items-start gap-2.5 flex-1 min-w-0">
          <div className="mt-0.5 shrink-0">
            {locked ? (
              <div className="size-5 rounded-md bg-primary/15 text-primary flex items-center justify-center transition-transform group-hover:scale-105">
                <Lock className="size-3 stroke-[2.5]" />
              </div>
            ) : (
              <div className="size-5 rounded-md bg-muted/60 text-muted-foreground flex items-center justify-center group-hover:bg-muted transition-colors">
                <Unlock className="size-3 opacity-60 group-hover:opacity-100" />
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p
              className={cn(
                "text-sm leading-snug transition-colors break-words",
                locked
                  ? "text-foreground font-medium"
                  : "text-foreground/90 font-normal",
              )}
            >
              {text}
            </p>

            {(targetDuration || difficulty || aiReasoning) && (
              <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
                {targetDuration ? (
                  <span className="inline-flex items-center gap-1 text-[11px] font-medium text-muted-foreground bg-muted/60 px-1.5 py-0.5 rounded-md">
                    <Clock className="size-3 text-muted-foreground/80" />
                    {targetDuration}m
                  </span>
                ) : null}
                {difficulty && (
                  <Badge
                    variant="outline"
                    className={cn(
                      "text-[10px] px-1.5 py-0 h-4 font-medium uppercase tracking-wider",
                      difficulty === "EASY" &&
                        "border-emerald-500/30 text-emerald-600 dark:text-emerald-400 bg-emerald-500/10",
                      difficulty === "MEDIUM" &&
                        "border-amber-500/30 text-amber-600 dark:text-amber-400 bg-amber-500/10",
                      difficulty === "HARD" &&
                        "border-rose-500/30 text-rose-600 dark:text-rose-400 bg-rose-500/10",
                    )}
                  >
                    {difficulty.toLowerCase()}
                  </Badge>
                )}
                {aiReasoning && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span
                        role="button"
                        tabIndex={0}
                        onClick={(e) => e.stopPropagation()}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.stopPropagation();
                          }
                        }}
                        className="inline-flex items-center text-muted-foreground/70 hover:text-foreground transition-colors p-1.5 -m-1 rounded cursor-help"
                        aria-label="Why this habit was recommended"
                      >
                        <Info className="size-3.5" />
                      </span>
                    </TooltipTrigger>
                    <TooltipContent side="top" className="max-w-xs text-xs">
                      {aiReasoning}
                    </TooltipContent>
                  </Tooltip>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="shrink-0 flex items-center gap-1.5 pt-0.5">
          {locked ? (
            <Badge
              variant="default"
              className="text-[11px] px-1.5 py-0 h-5 font-medium tracking-tight bg-primary text-primary-foreground gap-1"
            >
              Pinned
            </Badge>
          ) : (
            <span className="text-[11px] text-muted-foreground/70 opacity-0 group-hover:opacity-100 transition-opacity hidden sm:inline-block">
              Click to pin
            </span>
          )}
        </div>
      </div>
    </Button>
  );
}

interface HabitCardSkeletonProps {
  className?: string;
  index?: number;
}

export function HabitCardSkeleton({ className }: HabitCardSkeletonProps) {
  return (
    <div
      className={cn(
        "w-full p-3.5 rounded-xl border border-border/50 bg-card/60 flex items-start gap-3",
        className,
      )}
    >
      <Skeleton className="size-5 rounded-md shrink-0 mt-0.5" />
      <div className="flex-1 space-y-2 py-0.5">
        <Skeleton className="h-3.5 w-4/5 rounded-md" />
        <Skeleton className="h-2.5 w-1/2 rounded-md" />
      </div>
      <Skeleton className="size-4 rounded shrink-0" />
    </div>
  );
}
