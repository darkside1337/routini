"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { DashboardHabit, GoalWithHabits } from "@/types";
import {
  GoalStatus,
  GoalPriority,
  HabitStatus,
} from "@/lib/generated/prisma/enums";
import { updateGoal, deleteGoal } from "@/actions/goalActions";
import { updateHabit, deleteHabit, createHabit } from "@/actions/habitActions";
import {
  Calendar,
  Check,
  ChevronDown,
  Edit2,
  Loader2,
  Plus,
  Trash2,
  X,
  Clock,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const EditGoalSchema = z.object({
  title: z
    .string()
    .trim()
    .min(3, "Title must be at least 3 characters")
    .max(100),
  description: z.string().trim().optional(),
  status: z.enum(GoalStatus),
  priority: z.enum(GoalPriority),
  targetDate: z.string().optional(),
});

type EditGoalFormData = z.infer<typeof EditGoalSchema>;

interface EditGoalModalProps {
  goal: GoalWithHabits;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const STATUS_CONFIG: Record<GoalStatus, { label: string; badgeClass: string }> =
  {
    NOT_STARTED: {
      label: "Not Started",
      badgeClass:
        "bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20",
    },
    IN_PROGRESS: {
      label: "In Progress",
      badgeClass:
        "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
    },
    COMPLETED: {
      label: "Completed",
      badgeClass:
        "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
    },
    ON_HOLD: {
      label: "On Hold",
      badgeClass:
        "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
    },
    ABANDONED: {
      label: "Abandoned",
      badgeClass:
        "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20",
    },
  };

const PRIORITY_CONFIG: Record<
  GoalPriority,
  { label: string; badgeClass: string }
> = {
  LOW: {
    label: "Low",
    badgeClass:
      "bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20",
  },
  MEDIUM: {
    label: "Medium",
    badgeClass:
      "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
  },
  HIGH: {
    label: "High",
    badgeClass:
      "bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20",
  },
  CRITICAL: {
    label: "Critical",
    badgeClass:
      "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20",
  },
};

const HABIT_STATUS_CONFIG: Record<
  HabitStatus,
  { label: string; badgeClass: string }
> = {
  ACTIVE: {
    label: "Active",
    badgeClass:
      "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
  },
  PAUSED: {
    label: "Paused",
    badgeClass:
      "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
  },
  ARCHIVED: {
    label: "Archived",
    badgeClass:
      "bg-zinc-500/10 text-zinc-600 dark:text-zinc-400 border-zinc-500/20",
  },
  COMPLETED: {
    label: "Completed",
    badgeClass:
      "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
  },
};

export function EditGoalModal({
  goal,
  open,
  onOpenChange,
}: EditGoalModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {open && (
        <EditGoalModalContent goal={goal} onClose={() => onOpenChange(false)} />
      )}
    </Dialog>
  );
}

function EditGoalModalContent({
  goal,
  onClose,
}: {
  goal: GoalWithHabits;
  onClose: () => void;
}) {
  const [habits, setHabits] = useState<DashboardHabit[]>(goal.habits || []);
  const [isSubmittingGoal, startGoalTransition] = useTransition();
  const [isDeletingGoal, startDeleteGoalTransition] = useTransition();

  // Dialog state for goal deletion
  const [isConfirmDeleteGoalOpen, setIsConfirmDeleteGoalOpen] = useState(false);

  // Dialog state for habit deletion
  const [habitToDelete, setHabitToDelete] = useState<DashboardHabit | null>(
    null,
  );
  const [isDeletingHabit, startDeleteHabitTransition] = useTransition();

  // State for adding a new habit
  const [newHabitName, setNewHabitName] = useState("");
  const [newHabitDuration, setNewHabitDuration] = useState("");
  const [isAddingHabit, startAddHabitTransition] = useTransition();

  // State for renaming a habit inline
  const [editingHabitId, setEditingHabitId] = useState<string | null>(null);
  const [editingHabitName, setEditingHabitName] = useState("");

  const form = useForm<EditGoalFormData>({
    resolver: zodResolver(EditGoalSchema),
    defaultValues: {
      title: goal.title,
      description: goal.description ?? "",
      status: goal.status,
      priority: goal.priority,
      targetDate: goal.targetDate
        ? new Date(goal.targetDate).toISOString().split("T")[0]
        : "",
    },
  });

  const onSaveGoal = (data: EditGoalFormData) => {
    startGoalTransition(async () => {
      const response = await updateGoal({
        goalId: goal.id,
        title: data.title,
        description: data.description || null,
        status: data.status,
        priority: data.priority,
        targetDate: data.targetDate ? new Date(data.targetDate) : null,
      });

      if (response.success) {
        toast.success("Goal updated successfully");
        onClose();
      } else {
        toast.error(response.error || "Failed to update goal");
      }
    });
  };

  const handleDeleteGoal = () => {
    startDeleteGoalTransition(async () => {
      const response = await deleteGoal({ goalId: goal.id });
      if (response.success) {
        toast.success("Goal deleted");
        setIsConfirmDeleteGoalOpen(false);
        onClose();
      } else {
        toast.error(response.error || "Failed to delete goal");
      }
    });
  };

  const handleAddHabit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHabitName.trim()) return;

    startAddHabitTransition(async () => {
      const durationNum = newHabitDuration
        ? parseInt(newHabitDuration, 10)
        : undefined;
      const response = await createHabit({
        goalId: goal.id,
        name: newHabitName.trim(),
        targetDuration: durationNum && !isNaN(durationNum) ? durationNum : null,
      });

      if (response.success && response.data) {
        setHabits((prev) => [
          ...prev,
          {
            ...response.data,
            completedToday: false,
            streak: 0,
          } as DashboardHabit,
        ]);
        setNewHabitName("");
        setNewHabitDuration("");
        toast.success("Habit added");
      } else {
        toast.error(response.error || "Failed to create habit");
      }
    });
  };

  const handleStatusChange = async (habitId: string, status: HabitStatus) => {
    // Optimistic update
    setHabits((prev) =>
      prev.map((h) => (h.id === habitId ? { ...h, status } : h)),
    );

    const response = await updateHabit({ habitId, status });
    if (response.success) {
      toast.success(`Habit status set to ${HABIT_STATUS_CONFIG[status].label}`);
    } else {
      toast.error(response.error || "Failed to update habit status");
      // Revert from goal prop
      setHabits(goal.habits || []);
    }
  };

  const handleStartRename = (habit: DashboardHabit) => {
    setEditingHabitId(habit.id);
    setEditingHabitName(habit.name);
  };

  const handleSaveRename = async (habitId: string) => {
    if (!editingHabitName.trim()) return;
    const nextName = editingHabitName.trim();

    setHabits((prev) =>
      prev.map((h) => (h.id === habitId ? { ...h, name: nextName } : h)),
    );
    setEditingHabitId(null);

    const response = await updateHabit({ habitId, name: nextName });
    if (response.success) {
      toast.success("Habit renamed");
    } else {
      toast.error(response.error || "Failed to rename habit");
    }
  };

  const handleConfirmDeleteHabit = () => {
    if (!habitToDelete) return;
    startDeleteHabitTransition(async () => {
      const habitId = habitToDelete.id;
      const response = await deleteHabit({ habitId });
      if (response.success) {
        setHabits((prev) => prev.filter((h) => h.id !== habitId));
        toast.success("Habit deleted");
        setHabitToDelete(null);
      } else {
        toast.error(response.error || "Failed to delete habit");
      }
    });
  };

  return (
    <>
      <DialogContent className="w-full sm:max-w-xl min-h-[460px] sm:min-h-[640px] max-h-[92vh] overflow-y-auto overflow-x-hidden p-4 sm:p-6 gap-4 sm:gap-5 min-w-0 flex flex-col">
        <DialogHeader className="text-left space-y-1 shrink-0">
          <DialogTitle className="text-xl font-bold tracking-tight">
            Edit Goal
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            Manage your goal details, adjust deadlines, or update habits.
          </DialogDescription>
        </DialogHeader>

        {/* Shadcn Tabs Component */}
        <Tabs
          defaultValue="details"
          className="w-full min-w-0 flex-1 flex flex-col"
        >
          <TabsList className="grid w-full grid-cols-2 h-9 p-1 shrink-0">
            <TabsTrigger value="details" className="text-xs font-semibold">
              Goal Details
            </TabsTrigger>
            <TabsTrigger
              value="habits"
              className="text-xs font-semibold gap-1.5"
            >
              <span>Habits</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-muted-foreground/15 text-foreground font-mono">
                {habits.length}
              </span>
            </TabsTrigger>
          </TabsList>

          {/* TAB 1: GOAL DETAILS */}
          <TabsContent
            value="details"
            className="mt-4 focus-visible:outline-none min-w-0 flex-1 flex flex-col"
          >
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSaveGoal)}
                className="space-y-5 flex-1 flex flex-col justify-between"
              >
                <div className="space-y-4">
                  {/* Title */}
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Goal Title</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g. Run a half marathon"
                            className="h-10 text-sm"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Description */}
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description & Context (Optional)</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Why this goal matters, specific schedule or constraints..."
                            rows={3}
                            className="text-sm resize-none"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Status Selector */}
                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Status</FormLabel>
                        <FormControl>
                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 sm:gap-2">
                            {(Object.keys(STATUS_CONFIG) as GoalStatus[]).map(
                              (st, index) => {
                                const isSelected = field.value === st;
                                const isLastOdd = index === 4;
                                return (
                                  <button
                                    key={st}
                                    type="button"
                                    onClick={() => field.onChange(st)}
                                    className={cn(
                                      "flex items-center justify-between px-2.5 py-2 sm:px-3 sm:py-2 rounded-lg border text-xs font-medium transition-all text-left",
                                      isLastOdd && "col-span-2 sm:col-span-1",
                                      isSelected
                                        ? "border-primary bg-primary/10 text-primary ring-1 ring-primary/40 font-semibold"
                                        : "border-border/70 hover:bg-muted/50 text-muted-foreground",
                                    )}
                                  >
                                    <span>{STATUS_CONFIG[st].label}</span>
                                    {isSelected && (
                                      <Check className="size-3.5 shrink-0" />
                                    )}
                                  </button>
                                );
                              },
                            )}
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Priority Selector */}
                  <FormField
                    control={form.control}
                    name="priority"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Priority</FormLabel>
                        <FormControl>
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 sm:gap-2">
                            {(
                              Object.keys(PRIORITY_CONFIG) as GoalPriority[]
                            ).map((pr) => {
                              const isSelected = field.value === pr;
                              return (
                                <button
                                  key={pr}
                                  type="button"
                                  onClick={() => field.onChange(pr)}
                                  className={cn(
                                    "flex items-center justify-between px-2.5 py-2 sm:px-3 sm:py-2 rounded-lg border text-xs font-medium transition-all text-left",
                                    isSelected
                                      ? "border-primary bg-primary/10 text-primary ring-1 ring-primary/40 font-semibold"
                                      : "border-border/70 hover:bg-muted/50 text-muted-foreground",
                                  )}
                                >
                                  <span>{PRIORITY_CONFIG[pr].label}</span>
                                  {isSelected && (
                                    <Check className="size-3.5 shrink-0" />
                                  )}
                                </button>
                              );
                            })}
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Target Date */}
                  <FormField
                    control={form.control}
                    name="targetDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-1.5">
                          <Calendar className="size-3.5 text-muted-foreground" />
                          <span>Target Date (Optional)</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="date"
                            className="h-10 text-sm"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Actions & Danger Zone */}
                <div className="pt-3 sm:pt-2 flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-2.5 sm:gap-3 border-t border-border/70">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsConfirmDeleteGoalOpen(true)}
                    className="text-destructive hover:bg-destructive/10 hover:text-destructive text-xs font-medium justify-center sm:justify-start h-9 sm:h-8"
                  >
                    <Trash2 className="size-3.5 mr-1.5" />
                    Delete Goal
                  </Button>

                  <div className="flex items-center gap-2 justify-end w-full sm:w-auto">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      disabled={isSubmittingGoal}
                      onClick={onClose}
                      className="flex-1 sm:flex-none h-9 sm:h-8 text-xs"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      size="sm"
                      disabled={isSubmittingGoal}
                      className="flex-1 sm:flex-none h-9 sm:h-8 text-xs"
                    >
                      {isSubmittingGoal && (
                        <Loader2 className="size-3.5 animate-spin mr-1.5" />
                      )}
                      Save Changes
                    </Button>
                  </div>
                </div>
              </form>
            </Form>
          </TabsContent>

          {/* TAB 2: HABITS MANAGEMENT */}
          <TabsContent
            value="habits"
            className="mt-4 focus-visible:outline-none min-w-0 flex-1 flex flex-col"
          >
            <div className="space-y-4 min-w-0 flex-1 flex flex-col">
              {/* Add Habit Form */}
              <form
                onSubmit={handleAddHabit}
                className="flex flex-col sm:flex-row gap-2 bg-muted/40 p-2.5 sm:p-3 rounded-xl border border-border/60 min-w-0 w-full shrink-0"
              >
                <div className="flex-1 min-w-0">
                  <Input
                    placeholder="Add a new habit..."
                    value={newHabitName}
                    onChange={(e) => setNewHabitName(e.target.value)}
                    className="h-9 text-xs bg-background w-full"
                  />
                </div>
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <Input
                    type="number"
                    placeholder="Mins/day"
                    value={newHabitDuration}
                    onChange={(e) => setNewHabitDuration(e.target.value)}
                    className="h-9 flex-1 sm:w-24 text-xs bg-background shrink-0"
                    min={1}
                  />
                  <Button
                    type="submit"
                    size="sm"
                    disabled={!newHabitName.trim() || isAddingHabit}
                    className="h-9 text-xs px-4 shrink-0"
                  >
                    {isAddingHabit ? (
                      <Loader2 className="size-3.5 animate-spin" />
                    ) : (
                      <>
                        <Plus className="size-3.5 mr-1" />
                        Add
                      </>
                    )}
                  </Button>
                </div>
              </form>

              {/* Habit List */}
              <div className="space-y-2 min-w-0 flex-1">
                {habits.length === 0 ? (
                  <div className="h-full min-h-[220px] flex items-center justify-center text-center py-8 text-muted-foreground text-xs border border-dashed rounded-xl">
                    No habits linked to this goal yet. Add one above!
                  </div>
                ) : (
                  habits.map((habit) => {
                    const isEditingThis = editingHabitId === habit.id;
                    const habitStatus =
                      (habit.status as HabitStatus) || "ACTIVE";
                    const statusMeta =
                      HABIT_STATUS_CONFIG[habitStatus] ||
                      HABIT_STATUS_CONFIG.ACTIVE;

                    return (
                      <div
                        key={habit.id}
                        className="flex flex-col sm:flex-row sm:items-center justify-between p-3 rounded-xl border border-border/70 hover:border-border transition-colors bg-card/60 gap-2.5 sm:gap-3 min-w-0 w-full"
                      >
                        {/* Habit Title or Inline Edit Input */}
                        <div className="flex-1 min-w-0 w-full">
                          {isEditingThis ? (
                            <div className="flex items-center gap-1.5 w-full">
                              <Input
                                value={editingHabitName}
                                onChange={(e) =>
                                  setEditingHabitName(e.target.value)
                                }
                                onKeyDown={(e) => {
                                  if (e.key === "Enter") {
                                    e.preventDefault();
                                    handleSaveRename(habit.id);
                                  } else if (e.key === "Escape") {
                                    setEditingHabitId(null);
                                  }
                                }}
                                className="h-8 text-xs min-w-0 flex-1"
                                autoFocus
                              />
                              <Button
                                type="button"
                                size="icon"
                                variant="ghost"
                                className="size-7 shrink-0 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-500/10"
                                onClick={() => handleSaveRename(habit.id)}
                              >
                                <Check className="size-3.5" />
                              </Button>
                              <Button
                                type="button"
                                size="icon"
                                variant="ghost"
                                className="size-7 shrink-0 text-muted-foreground hover:bg-muted"
                                onClick={() => setEditingHabitId(null)}
                              >
                                <X className="size-3.5" />
                              </Button>
                            </div>
                          ) : (
                            <div className="space-y-1 min-w-0">
                              <p
                                className={cn(
                                  "text-sm font-medium text-foreground leading-snug break-words",
                                  habitStatus === "ARCHIVED" &&
                                    "line-through text-muted-foreground opacity-60",
                                  habitStatus === "PAUSED" &&
                                    "text-muted-foreground",
                                )}
                              >
                                {habit.name}
                              </p>
                              {habit.targetDuration && (
                                <span className="inline-flex items-center text-[11px] text-muted-foreground gap-1 font-medium">
                                  <Clock className="size-3" />
                                  {habit.targetDuration} mins/day
                                </span>
                              )}
                            </div>
                          )}
                        </div>

                        {/* Status Dropdown & Actions */}
                        {!isEditingThis && (
                          <div className="flex items-center justify-end sm:justify-start gap-1.5 shrink-0 pt-1.5 sm:pt-0 border-t sm:border-t-0 border-border/40 w-full sm:w-auto">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  className={cn(
                                    "h-7 px-2 text-[11px] font-semibold uppercase tracking-wider rounded-md border",
                                    statusMeta.badgeClass,
                                  )}
                                >
                                  {statusMeta.label}
                                  <ChevronDown className="size-3 ml-1 opacity-70" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="w-32">
                                <DropdownMenuItem
                                  onClick={() =>
                                    handleStatusChange(habit.id, "ACTIVE")
                                  }
                                  className="text-xs"
                                >
                                  Active
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() =>
                                    handleStatusChange(habit.id, "PAUSED")
                                  }
                                  className="text-xs"
                                >
                                  Pause
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() =>
                                    handleStatusChange(habit.id, "ARCHIVED")
                                  }
                                  className="text-xs"
                                >
                                  Archive
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>

                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="size-7 text-muted-foreground hover:text-foreground hover:bg-muted"
                              onClick={() => handleStartRename(habit)}
                              title="Rename habit"
                            >
                              <Edit2 className="size-3.5" />
                            </Button>

                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="size-7 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                              onClick={() => setHabitToDelete(habit)}
                              title="Delete habit"
                            >
                              <Trash2 className="size-3.5" />
                            </Button>
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>

      {/* Confirmation Dialog: Delete Goal */}
      <ConfirmDialog
        open={isConfirmDeleteGoalOpen}
        onOpenChange={setIsConfirmDeleteGoalOpen}
        title="Delete Goal?"
        description={`Are you sure you want to permanently delete "${goal.title}"? This will remove all linked habits and check-in history. This action cannot be undone.`}
        confirmText="Delete Goal"
        variant="destructive"
        isLoading={isDeletingGoal}
        onConfirm={handleDeleteGoal}
      />

      {/* Confirmation Dialog: Delete Habit */}
      <ConfirmDialog
        open={Boolean(habitToDelete)}
        onOpenChange={(val) => !val && setHabitToDelete(null)}
        title="Delete Habit?"
        description={
          habitToDelete
            ? `Are you sure you want to delete "${habitToDelete.name}"? Its check-in history will be removed.`
            : ""
        }
        confirmText="Delete Habit"
        variant="destructive"
        isLoading={isDeletingHabit}
        onConfirm={handleConfirmDeleteHabit}
      />
    </>
  );
}
