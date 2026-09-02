"use client";
import { DashboardHabit, GoalWithHabits } from "@/types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Edit } from "lucide-react";
import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { formatShortDate } from "@/lib/helpers";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Flame } from "lucide-react";
import { cn } from "@/lib/utils";

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
  const { id, title, description, priority, status, startDate, habits } = goal;

  const totalHabits = habits?.length || 0;
  const completed = habits?.filter((h) => h.completedToday)?.length || 0;
  const progressValue =
    totalHabits === 0 ? 0 : Math.round((completed / totalHabits) * 100);

  const formattedStatus = status.replace("_", " ");

  return (
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
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsEditOpen(true)}
            className="ml-auto"
          >
            <Edit className="size-4" />
          </Button>
        </div>
      </div>
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="md:max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit Goal</DialogTitle>
          </DialogHeader>
          {/* Add edit form here */}
        </DialogContent>
      </Dialog>

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
      {habits && habits.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-foreground mb-3">
            Daily Habits
          </h3>
          <div className="space-y-2">
            {habits.map((habit) => (
              <HabitRow key={habit.id} habit={habit} />
            ))}
          </div>
        </div>
      )}
    </Card>
  );
};

export const HabitRow = ({ habit }: { habit: DashboardHabit }) => {
  return (
    <Label
      htmlFor={habit.id}
      className="flex items-center justify-between py-1.5 px-2 rounded-lg hover:bg-muted/40 transition-colors cursor-pointer select-none font-normal"
    >
      <div className="flex items-center gap-3 min-w-0">
        <Checkbox
          id={habit.id}
          defaultChecked={habit.completedToday}
          className="size-4.5 rounded-md"
        />
        <span className="text-sm font-medium text-foreground leading-normal">
          {habit.name}
        </span>
      </div>

      {habit.streak !== undefined && habit.streak > 0 && (
        <div className="flex items-center gap-1.5 text-xs md:text-sm font-medium text-orange-600 dark:text-orange-400 shrink-0 ml-3">
          <Flame className="size-4 fill-orange-500 text-orange-500" />
          <span>{habit.streak} day streak</span>
        </div>
      )}
    </Label>
  );
};
