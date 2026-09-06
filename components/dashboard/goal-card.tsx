"use client";

import { DashboardHabit, GoalWithHabits } from "@/types";
import { Button } from "@/components/ui/button";
import { Edit, Flame, MoreHorizontal, Trash2 } from "lucide-react";
import { useOptimistic, useState, useTransition } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { formatShortDate } from "@/lib/helpers";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { EditGoalModal } from "./edit-goal-modal";
import { cn } from "@/lib/utils";
import { toggleHabitLog } from "@/actions/habitActions";
import { deleteGoal } from "@/actions/goalActions";
import { toast } from "sonner";

const getPriorityBadgeStyles = (priority: string) => {
  switch (priority.toUpperCase()) {
    case "LOW":
      return "bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20";
    case "MEDIUM":
      return "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20";
    case "HIGH":
      return "bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20";
    case "CRITICAL":
      return "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20";
    default:
      return "border-border/80 text-muted-foreground";
  }
};

export const GoalCard = ({ goal }: { goal: GoalWithHabits }) => {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);
  const [, startTransition] = useTransition();
  const [isDeleting, startDeleteTransition] = useTransition();

  const { id, title, description, priority, status, startDate, habits } = goal;

  const [optimisticHabits, setOptimisticHabits] = useOptimistic(
    habits || [],
    (currentHabits, toggledHabitId: string) => {
      return currentHabits.map((h) => {
        if (h.id !== toggledHabitId) return h;
        const nextCompleted = !h.completedToday;
        const currentStreak = h.streak ?? 0;
        const nextStreak = nextCompleted
          ? currentStreak + 1
          : Math.max(0, currentStreak - 1);

        return {
          ...h,
          completedToday: nextCompleted,
          streak: nextStreak,
        };
      });
    },
  );

  // Filter out ARCHIVED habits from daily dashboard card
  const visibleHabits = optimisticHabits.filter(
    (h) => h.status !== "ARCHIVED"
  );

  // Active tracking habits for progress calculation (paused habits do not count toward daily completion total)
  const activeHabits = visibleHabits.filter((h) => h.status !== "PAUSED");
  const totalHabits = activeHabits.length;
  const completed = activeHabits.filter((h) => h.completedToday).length;
  const progressValue =
    totalHabits === 0 ? 0 : Math.round((completed / totalHabits) * 100);

  const formattedStatus = status.replace("_", " ");

  const handleToggleHabit = (habitId: string) => {
    startTransition(async () => {
      setOptimisticHabits(habitId);
      const response = await toggleHabitLog({
        habitId,
        date: new Date(),
      });
      if (!response.success) {
        toast.error(response.error || "Failed to update habit!");
      }
    });
  };

  const handleDeleteGoal = () => {
    startDeleteTransition(async () => {
      const response = await deleteGoal({ goalId: id });
      if (response.success) {
        toast.success("Goal deleted");
        setIsConfirmDeleteOpen(false);
      } else {
        toast.error(response.error || "Failed to delete goal");
      }
    });
  };

  return (
    <>
      <Card
        key={id}
        className="p-6 md:p-7 rounded-2xl bg-card border border-border/80 shadow-xs hover:shadow-sm transition-all gap-0"
      >
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3">
          <div>
            <h2 className="text-xl md:text-2xl font-bold tracking-tight text-foreground">
              {title}
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              {description ? `${description} • ` : ""}started{" "}
              {formatShortDate(startDate)}
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0 w-full md:w-auto">
            <Badge
              variant="secondary"
              className={cn(
                "font-semibold text-xs uppercase px-2.5 py-1 tracking-wider border-0",
                status === "COMPLETED"
                  ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                  : "bg-primary/10 text-primary",
              )}
            >
              {formattedStatus}
            </Badge>
            {/* Priority */}
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-muted-foreground font-medium">
                Priority
              </span>
              <Badge
                variant="outline"
                className={cn(
                  "uppercase font-semibold text-xs px-2.5 py-0.5 tracking-wider border",
                  getPriorityBadgeStyles(priority),
                )}
              >
                {priority}
              </Badge>
            </div>

            {/* Actions Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="ml-auto size-8 text-muted-foreground hover:text-foreground"
                >
                  <MoreHorizontal className="size-4" />
                  <span className="sr-only">Goal actions</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-36">
                <DropdownMenuItem onClick={() => setIsEditOpen(true)}>
                  <Edit className="size-3.5 mr-2" />
                  <span>Edit Goal</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => setIsConfirmDeleteOpen(true)}
                  className="text-destructive focus:bg-destructive/10 focus:text-destructive"
                >
                  <Trash2 className="size-3.5 mr-2" />
                  <span>Delete Goal</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Progress */}
        <div className="mt-5 mb-6">
          <div className="flex items-center justify-between text-sm font-medium">
            <span className="font-semibold text-foreground">Progress</span>
            <span className="text-muted-foreground">
              {completed}/{totalHabits}
            </span>
          </div>
          <Progress value={progressValue} className="h-2 w-full mt-2 bg-muted" />
        </div>

        {/* Daily Habits */}
        {visibleHabits && visibleHabits.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-3">
              Daily Habits
            </h3>
            <div className="space-y-2">
              {visibleHabits.map((habit) => (
                <HabitRow
                  key={habit.id}
                  habit={habit}
                  onToggle={() => handleToggleHabit(habit.id)}
                />
              ))}
            </div>
          </div>
        )}
      </Card>

      {/* Edit Goal Modal */}
      <EditGoalModal
        goal={goal}
        open={isEditOpen}
        onOpenChange={setIsEditOpen}
      />

      {/* Direct Delete Confirm Dialog from Card */}
      <ConfirmDialog
        open={isConfirmDeleteOpen}
        onOpenChange={setIsConfirmDeleteOpen}
        title="Delete Goal?"
        description={`Are you sure you want to permanently delete "${title}"? This will remove all associated habits and tracking history.`}
        confirmText="Delete Goal"
        variant="destructive"
        isLoading={isDeleting}
        onConfirm={handleDeleteGoal}
      />
    </>
  );
};

export const HabitRow = ({
  habit,
  onToggle,
}: {
  habit: DashboardHabit;
  onToggle: () => void;
}) => {
  const isPaused = habit.status === "PAUSED";

  return (
    <Label
      htmlFor={habit.id}
      className={cn(
        "flex items-center justify-between py-1.5 px-2 rounded-lg transition-colors select-none font-normal",
        isPaused
          ? "opacity-60 cursor-not-allowed bg-muted/20"
          : "hover:bg-muted/40 cursor-pointer"
      )}
    >
      <div className="flex items-center gap-3 min-w-0">
        <Checkbox
          id={habit.id}
          checked={Boolean(habit.completedToday)}
          disabled={isPaused}
          className="size-4.5 rounded-md"
          onCheckedChange={() => {
            if (!isPaused) {
              onToggle();
            }
          }}
        />
        <span
          className={cn(
            "text-sm font-medium text-foreground leading-normal",
            habit.completedToday && "line-through text-muted-foreground",
            isPaused && "text-muted-foreground italic"
          )}
        >
          {habit.name}
        </span>
        {isPaused && (
          <Badge
            variant="outline"
            className="text-[10px] uppercase font-semibold py-0 px-1.5 border-amber-500/30 text-amber-600 dark:text-amber-400 bg-amber-500/10"
          >
            Paused
          </Badge>
        )}
      </div>

      {!isPaused && habit.streak !== undefined && habit.streak > 0 && (
        <div className="flex items-center gap-1.5 text-xs md:text-sm font-medium text-orange-600 dark:text-orange-400 shrink-0 ml-3">
          <Flame className="size-4 fill-orange-500 text-orange-500" />
          <span>{habit.streak} day streak</span>
        </div>
      )}
    </Label>
  );
};

