"use client";

import { useEffect, useState } from "react";
import { DialogDescription, DialogHeader, DialogTitle } from "../ui/dialog";
import { Button } from "../ui/button";
import { HabitWithLockStatus } from "@/types";
import {
  ArrowLeft,
  Check,
  RotateCw,
  Loader2,
  Sparkles,
  Lock,
  Info,
  AlertCircle,
} from "lucide-react";
import { Badge } from "../ui/badge";
import {
  HabitCardSkeleton,
  SelectableHabitCard,
} from "./selectable-habit-card";

interface CreateGoalReviewViewProps {
  goalTitle?: string;
  generatedHabits: HabitWithLockStatus[] | null;
  switchViewToForm: () => void;
  handleGenerateAgain: () => void;
  handleToggleHabitLock: (habitId: string) => void;
  isGenerating: boolean;
  handleSaveHabits: () => void;
  isSaving: boolean;
  generationError?: string | null;
}

const GENERATING_STEPS = [
  "Analyzing your goal...",
  "Drafting bite-sized daily routines...",
  "Tailoring actionable habits for consistency...",
];

const CreateGoalReviewView = ({
  goalTitle,
  generatedHabits,
  switchViewToForm,
  handleGenerateAgain,
  handleToggleHabitLock,
  isGenerating,
  handleSaveHabits,
  isSaving,
  generationError,
}: CreateGoalReviewViewProps) => {
  const [stepIndex, setStepIndex] = useState(0);

  useEffect(() => {
    if (!isGenerating) return;
    const interval = setInterval(() => {
      setStepIndex((prev) => (prev + 1) % GENERATING_STEPS.length);
    }, 1800);
    return () => clearInterval(interval);
  }, [isGenerating]);

  const totalCount = generatedHabits?.length ?? 5;
  const lockedHabits = generatedHabits?.filter((h) => h.locked) ?? [];
  const lockedCount = lockedHabits.length;
  const unlockedCount = totalCount - lockedCount;

  return (
    <div className="flex flex-col gap-4">
      <DialogHeader className="space-y-1.5 text-left pr-6 sm:pr-0">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <DialogTitle className="text-xl font-semibold tracking-tight text-foreground flex items-center gap-2">
            <Sparkles className="size-5 text-primary" />
            Your AI-Generated Habits
          </DialogTitle>
          {generatedHabits && generatedHabits.length > 0 && !isGenerating && (
            <Badge
              variant="outline"
              className="text-xs font-normal gap-1 py-0.5 border-border shrink-0"
            >
              <Lock className="size-3 text-primary" />
              <span>
                {lockedCount} of {totalCount} pinned
              </span>
            </Badge>
          )}
        </div>
        <DialogDescription className="text-sm text-muted-foreground leading-relaxed break-words">
          {goalTitle ? (
            <span>
              Habits designed for{" "}
              <span className="font-medium text-foreground break-words">
                &ldquo;{goalTitle}&rdquo;
              </span>
              .
            </span>
          ) : (
            "Review and customize your habits before saving them to your routine."
          )}
        </DialogDescription>
      </DialogHeader>

      {/* Inline generation error alert when habits already exist (e.g. re-roll failed) */}
      {generationError && generatedHabits && generatedHabits.length > 0 && !isGenerating && (
        <div className="flex items-center justify-between gap-3 p-3 rounded-xl border border-destructive/30 bg-destructive/10 text-destructive text-xs animate-fade-in">
          <div className="flex items-center gap-2 min-w-0">
            <AlertCircle className="size-4 shrink-0" />
            <span className="truncate">{generationError}</span>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleGenerateAgain}
            disabled={isGenerating}
            className="h-7 px-2.5 text-xs font-medium text-destructive hover:text-destructive hover:bg-destructive/15 shrink-0"
          >
            <RotateCw className="size-3 mr-1" />
            Retry
          </Button>
        </div>
      )}

      {/* Instructional helper hint */}
      {!isGenerating && !generationError && generatedHabits && generatedHabits.length > 0 && (
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-muted/40 border border-border/50 text-xs text-muted-foreground">
          <Info className="size-3.5 shrink-0 text-primary" />
          <span>
            Click a habit to{" "}
            <strong className="font-medium text-foreground">Pin</strong> it.
            Re-rolling will replace only unpinned habits.
          </span>
        </div>
      )}

      {/* Generating step indicator */}
      {isGenerating && (
        <div className="flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-primary/5 border border-primary/20 text-xs text-primary font-medium animate-fade-in">
          <Loader2 className="size-3.5 animate-spin" />
          <span>{GENERATING_STEPS[stepIndex]}</span>
        </div>
      )}

      {/* Habit Cards Container or Full Error State */}
      {generationError && (!generatedHabits || generatedHabits.length === 0) && !isGenerating ? (
        <div className="flex flex-col items-center justify-center text-center p-8 rounded-xl border border-destructive/20 bg-destructive/5 space-y-3.5 my-2 animate-fade-in">
          <div className="size-11 rounded-full bg-destructive/10 text-destructive flex items-center justify-center">
            <AlertCircle className="size-5" />
          </div>
          <div className="space-y-1">
            <h4 className="text-sm font-semibold text-foreground">Generation Failed</h4>
            <p className="text-xs text-muted-foreground max-w-sm leading-relaxed">
              {generationError}
            </p>
          </div>
          <div className="flex items-center gap-2 pt-1">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={switchViewToForm}
              className="text-xs gap-1.5"
            >
              <ArrowLeft className="size-3.5" />
              Edit Prompt
            </Button>
            <Button
              type="button"
              size="sm"
              onClick={handleGenerateAgain}
              disabled={isGenerating}
              className="text-xs font-medium gap-1.5"
            >
              <RotateCw className="size-3.5" />
              Try Again
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-2.5 max-h-[min(380px,50dvh)] overflow-y-auto pr-1 overscroll-contain">
          {isGenerating ? (
            <>
              {/* Show locked habits first */}
              {lockedHabits.map((habit) => (
                <SelectableHabitCard
                  key={habit.id}
                  habit={habit}
                  onToggle={handleToggleHabitLock}
                  disabled={true}
                />
              ))}

              {/* Shimmering placeholders for unlocked slots */}
              {Array.from({ length: Math.max(1, unlockedCount) }).map((_, i) => (
                <HabitCardSkeleton key={`skeleton-${i}`} index={i} />
              ))}
            </>
          ) : (
            generatedHabits?.map((habit) => (
              <SelectableHabitCard
                key={habit.id}
                habit={habit}
                onToggle={handleToggleHabitLock}
                disabled={isSaving}
              />
            ))
          )}
        </div>
      )}

      {/* Action Footer */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-2.5 pt-2 border-t border-border/60">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={switchViewToForm}
          disabled={isGenerating || isSaving}
          className="w-full sm:w-auto h-9 sm:h-8 text-xs text-muted-foreground hover:text-foreground gap-1.5 order-3 sm:order-1"
        >
          <ArrowLeft className="size-3.5" />
          Edit Goal Prompt
        </Button>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end order-1 sm:order-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleGenerateAgain}
            disabled={isGenerating || isSaving}
            className="flex-1 sm:flex-initial h-9 sm:h-8 px-3 text-xs gap-1.5"
          >
            {isGenerating ? (
              <Loader2 className="size-3.5 animate-spin" />
            ) : (
              <RotateCw className="size-3.5" />
            )}
            <span>
              {isGenerating
                ? "Re-rolling..."
                : unlockedCount < totalCount
                  ? `Re-roll (${unlockedCount} unlocked)`
                  : "Re-roll All"}
            </span>
          </Button>

          <Button
            type="button"
            size="sm"
            disabled={isGenerating || isSaving || !generatedHabits?.length}
            onClick={handleSaveHabits}
            className="flex-1 sm:flex-initial h-9 sm:h-8 px-3.5 text-xs font-medium gap-1.5"
          >
            {isSaving ? (
              <>
                <Loader2 className="size-3.5 animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Check className="size-3.5" />
                <span>Save Habits</span>
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CreateGoalReviewView;
