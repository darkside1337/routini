import React from "react";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getProgressStats } from "@/actions/progressActions";
import ProgressHeader from "@/components/progress/progress-header";
import StatsSummaryCards from "@/components/progress/stats-summary-cards";
import HabitHeatmap from "@/components/progress/habit-heatmap";
import HabitPerformanceList from "@/components/progress/habit-performance-list";
import { Target, Plus } from "lucide-react";
import CreateGoalModal from "@/components/create-goal-modal/create-goal-modal";

export const metadata = {
  title: "Progress & Heatmap | Routini",
  description: "Track your habit consistency, streaks, and full-year activity heatmap.",
};

export default async function ProgressPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return redirect("/auth/sign-in");
  }

  const response = await getProgressStats();

  if (!response.success) {
    return (
      <div className="py-8 space-y-6 max-w-5xl mx-auto px-2 sm:px-0">
        <div className="rounded-xl border border-destructive/20 bg-destructive/10 p-6 text-center text-sm text-destructive">
          {response.error || "Failed to load progress stats. Please try again."}
        </div>
      </div>
    );
  }

  const {
    activities,
    totalCompletions,
    currentStreak,
    bestStreak,
    completionRate30Days,
    activeHabitsCount,
    habitBreakdown,
  } = response.data;

  const hasNoData = activeHabitsCount === 0 && totalCompletions === 0;

  return (
    <div className="py-8 space-y-6 max-w-5xl mx-auto px-2 sm:px-0 pb-20 md:pb-8">
      <ProgressHeader currentStreak={currentStreak} />

      {hasNoData ? (
        <div className="rounded-2xl border border-dashed border-border/80 p-8 sm:p-12 text-center space-y-4 bg-muted/20">
          <div className="size-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto">
            <Target className="size-6" />
          </div>
          <div className="space-y-1 max-w-md mx-auto">
            <h3 className="text-base font-semibold text-foreground">
              No habit activity recorded yet
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Set a goal and check off your daily habits to start building your consistency heatmap and streaks!
            </p>
          </div>
          <CreateGoalModal size="default" className="shadow-xs font-medium cursor-pointer">
            <Plus className="size-4 mr-1.5" />
            <span>Set Your First Goal</span>
          </CreateGoalModal>
        </div>
      ) : (
        <>
          <StatsSummaryCards
            totalCompletions={totalCompletions}
            currentStreak={currentStreak}
            bestStreak={bestStreak}
            completionRate30Days={completionRate30Days}
            activeHabitsCount={activeHabitsCount}
          />

          <HabitHeatmap activities={activities} />

          <HabitPerformanceList habits={habitBreakdown} />
        </>
      )}
    </div>
  );
}
