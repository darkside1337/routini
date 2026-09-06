"use client";

import React, { useEffect, useRef, useSyncExternalStore } from "react";
import { ActivityCalendar, Activity, BlockElement } from "react-activity-calendar";
import { useTheme } from "next-themes";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "@/components/ui/tooltip";
import { ActivityDay } from "@/actions/progressActions";
import { Calendar as CalendarIcon, Sparkles } from "lucide-react";

interface HabitHeatmapProps {
  activities: ActivityDay[];
}

const emptySubscribe = () => () => {};

const theme = {
  light: [
    "#e5e7eb", // level 0 (gray-200)
    "#99f6e4", // level 1 (teal-200)
    "#2dd4bf", // level 2 (teal-400)
    "#0d9488", // level 3 (teal-600)
    "#115e59", // level 4 (teal-800)
  ],
  dark: [
    "#1e293b", // level 0 (slate-800)
    "#134e4a", // level 1 (teal-950/900)
    "#0f766e", // level 2 (teal-700)
    "#14b8a6", // level 3 (teal-500)
    "#2dd4bf", // level 4 (teal-400)
  ],
};

function formatTooltipDate(dateStr: string): string {
  const [year, month, day] = dateStr.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  return date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
}

export default function HabitHeatmap({ activities }: HabitHeatmapProps) {
  const { resolvedTheme } = useTheme();
  const mounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to latest days on mobile/compact viewports
  useEffect(() => {
    if (mounted && scrollContainerRef.current) {
      scrollContainerRef.current.scrollLeft = scrollContainerRef.current.scrollWidth;
    }
  }, [mounted]);

  const totalTrackedThisYear = activities.reduce((acc, curr) => acc + curr.count, 0);

  return (
    <Card className="border-border/60 shadow-xs max-w-full overflow-hidden">
      <CardHeader className="p-4 sm:p-6 pb-2 sm:pb-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div className="space-y-1">
          <CardTitle className="text-base sm:text-lg font-semibold flex items-center gap-2">
            <CalendarIcon className="size-4 text-teal-600 dark:text-teal-400" />
            <span>Habit Activity Calendar</span>
          </CardTitle>
          <CardDescription className="text-xs sm:text-sm">
            Full 365-day habit completion matrix
          </CardDescription>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground bg-muted/50 dark:bg-muted/30 px-2.5 py-1 rounded-lg self-start sm:self-auto">
          <Sparkles className="size-3 text-amber-500" />
          <span>
            <strong className="text-foreground">{totalTrackedThisYear}</strong> check-ins in the past year
          </span>
        </div>
      </CardHeader>

      <CardContent className="p-4 sm:p-6 pt-2 sm:pt-3 max-w-full min-w-0 overflow-hidden">
        {/* Scrollable container for mobile */}
        <div
          ref={scrollContainerRef}
          className="overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-muted-foreground/20 w-full min-w-0"
        >
          <div className="min-w-[780px] min-h-[140px] flex items-center justify-center py-2">
            {mounted ? (
              <TooltipProvider delayDuration={50}>
                <ActivityCalendar
                  data={activities as Activity[]}
                  theme={theme}
                  colorScheme={resolvedTheme === "dark" ? "dark" : "light"}
                  blockSize={12}
                  blockMargin={3}
                  blockRadius={2}
                  fontSize={12}
                  showWeekdayLabels={["mon", "wed", "fri"]}
                  labels={{
                    totalCount: "{{count}} check-ins in the last year",
                    legend: {
                      less: "0 habits",
                      more: "4+ habits",
                    },
                  }}
                  renderBlock={(block: BlockElement, activity: Activity) => (
                    <Tooltip key={activity.date}>
                      <TooltipTrigger asChild>{block}</TooltipTrigger>
                      <TooltipContent
                        side="top"
                        className="px-2.5 py-1.5 text-xs shadow-md border border-border"
                      >
                        <p className="font-semibold">{formatTooltipDate(activity.date)}</p>
                        <p className="text-muted-foreground mt-0.5">
                          {activity.count === 0
                            ? "No habits completed"
                            : `${activity.count} habit${activity.count > 1 ? "s" : ""} completed`}
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  )}
                />
              </TooltipProvider>
            ) : (
              <div className="w-full h-[120px] rounded-lg bg-muted/20 animate-pulse" />
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
