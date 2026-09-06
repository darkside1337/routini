"use client";

import { DialogDescription, DialogHeader, DialogTitle } from "../ui/dialog";
import { Sparkles, ArrowRight, Loader2 } from "lucide-react";
import {
  Controller,
  Control,
  UseFormHandleSubmit,
  FieldErrors,
  UseFormSetValue,
} from "react-hook-form";
import { Button } from "../ui/button";
import { FieldGroup, Field, FieldLabel, FieldError } from "../ui/field";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Badge } from "../ui/badge";
import { GoalInput } from "./create-goal-modal";
import { HabitWithLockStatus } from "@/types";

interface CreateGoalFormViewProps {
  control: Control<GoalInput>;
  handleSubmit: UseFormHandleSubmit<GoalInput>;
  setValue?: UseFormSetValue<GoalInput>;
  errors: FieldErrors<GoalInput>;
  isSubmitting: boolean;
  onSubmit: (data: GoalInput) => void;
  switchViewToReview: () => void;
  generatedHabits: HabitWithLockStatus[] | null;
}

const QUICK_GOAL_SUGGESTIONS = [
  "Run 5K consistently",
  "Read 20 pages daily",
  "Learn TypeScript & React",
  "Sleep 8 hours every night",
  "Daily 15-min mindfulness",
];

const CreateGoalFormView = ({
  control,
  handleSubmit,
  setValue,
  isSubmitting,
  onSubmit,
  switchViewToReview,
  generatedHabits,
}: CreateGoalFormViewProps) => {
  const canGoBackToReview = generatedHabits !== null && generatedHabits.length > 0;

  const handleSelectSuggestion = (suggestion: string) => {
    if (setValue) {
      setValue("goal", suggestion, { shouldValidate: true, shouldDirty: true });
    }
  };

  return (
    <div className="flex flex-col gap-5">
      <DialogHeader className="space-y-1.5 text-left pr-6 sm:pr-0">
        <div className="flex items-center gap-2 flex-wrap">
          <DialogTitle className="text-xl font-semibold tracking-tight text-foreground">
            Set a New Goal
          </DialogTitle>
          <Badge variant="secondary" className="gap-1 text-xs py-0.5 px-2 bg-primary/10 text-primary border-primary/20 shrink-0">
            <Sparkles className="size-3" />
            AI Powered
          </Badge>
        </div>
        <DialogDescription className="text-sm text-muted-foreground leading-relaxed">
          Describe the goal you want to achieve. Routini will generate tailored daily habits to get you there.
        </DialogDescription>
      </DialogHeader>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <FieldGroup className="space-y-4">
          <Controller
            name="goal"
            control={control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid} className="space-y-2">
                <div className="flex items-center justify-between">
                  <FieldLabel htmlFor={field.name} className="text-sm font-medium text-foreground">
                    What is your main goal?
                  </FieldLabel>
                </div>
                <Input
                  id={field.name}
                  placeholder="e.g. Run a half marathon, Master TypeScript..."
                  className="h-10 text-sm"
                  aria-invalid={fieldState.invalid}
                  autoFocus
                  {...field}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}

                {/* Quick suggestions */}
                <div className="pt-1">
                  <div className="text-[11px] font-medium text-muted-foreground mb-1.5">
                    Ideas to get started:
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {QUICK_GOAL_SUGGESTIONS.map((suggestion) => (
                      <Button
                        key={suggestion}
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => handleSelectSuggestion(suggestion)}
                        className="rounded-full min-h-[32px] sm:min-h-0 sm:h-7 px-3 py-1.5 sm:py-1 text-xs text-muted-foreground hover:text-foreground font-normal"
                      >
                        {suggestion}
                      </Button>
                    ))}
                  </div>
                </div>
              </Field>
            )}
          />

          <Controller
            name="additionalDetails"
            control={control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid} className="space-y-1.5">
                <FieldLabel htmlFor={field.name} className="text-sm font-medium text-foreground flex items-center justify-between">
                  <span>Additional details</span>
                  <span className="text-xs font-normal text-muted-foreground">Optional</span>
                </FieldLabel>
                <Textarea
                  id={field.name}
                  placeholder="e.g. I have 30 minutes each morning, prefer gentle progression, beginner level..."
                  className="resize-none text-sm min-h-[84px]"
                  rows={3}
                  aria-invalid={fieldState.invalid}
                  {...field}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        </FieldGroup>

        <div className="flex flex-col sm:flex-row items-center gap-2.5 pt-1">
          {canGoBackToReview && (
            <Button
              type="button"
              variant="outline"
              onClick={switchViewToReview}
              className="w-full sm:w-auto h-10 sm:h-9 text-xs gap-1.5 order-2 sm:order-1"
            >
              Back to Habit List
              <ArrowRight className="size-3.5" />
            </Button>
          )}

          <Button
            className="w-full sm:flex-1 gap-2 h-10 font-medium order-1 sm:order-2"
            disabled={isSubmitting}
            type="submit"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                <span>Crafting daily habits...</span>
              </>
            ) : (
              <>
                <Sparkles className="size-4" />
                <span>Generate Habits with AI</span>
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CreateGoalFormView;
