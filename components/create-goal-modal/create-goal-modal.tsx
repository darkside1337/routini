"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Dialog, DialogTrigger, DialogContent } from "../ui/dialog";
import { Plus } from "lucide-react";
import { Button } from "../ui/button";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import CreateGoalFormView from "./form-view";
import CreateGoalReviewView from "./review-view";
import {
  generateHabits,
  regenerateHabits,
  saveHabits,
} from "@/actions/habitActions";
import { toast } from "sonner";
import { HabitWithLockStatus } from "@/types";

export const GoalInputSchema = z.object({
  goal: z.string().min(5, "Goal must be at least 5 characters long"),
  additionalDetails: z.string().optional(),
});

export type GoalInput = z.infer<typeof GoalInputSchema>;

type ModalView = "form" | "review";

interface CreateGoalModalProps extends React.ComponentProps<typeof Button> {
  onGoalCreated?: () => void;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  initialGoal?: string;
  hideTrigger?: boolean;
}

const CreateGoalModal = ({
  children,
  className,
  onGoalCreated,
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange,
  initialGoal,
  hideTrigger = false,
  ...props
}: CreateGoalModalProps) => {
  const router = useRouter();
  const [internalOpen, setInternalOpen] = useState(false);
  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : internalOpen;

  const [currentView, setCurrentView] = useState<ModalView>("form");

  const [generatedHabits, setGeneratedHabits] = useState<
    HabitWithLockStatus[] | null
  >(null);

  const [goalData, setGoalData] = useState<GoalInput | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [generationError, setGenerationError] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<GoalInput>({
    resolver: zodResolver(GoalInputSchema),
    defaultValues: {
      goal: initialGoal || "",
      additionalDetails: "",
    },
  });

  useEffect(() => {
    if (initialGoal) {
      setValue("goal", initialGoal);
    }
  }, [initialGoal, setValue]);

  const handleOpenChange = (nextOpen: boolean) => {
    if (isControlled) {
      controlledOnOpenChange?.(nextOpen);
    } else {
      setInternalOpen(nextOpen);
    }

    if (!nextOpen) {
      // If modal is closed, give a short grace period then reset view if not saving
      if (!isSaving && !isGenerating) {
        setTimeout(() => {
          setCurrentView("form");
          setGenerationError(null);
        }, 300);
      }
    }
  };

  const switchViewToReview = () => setCurrentView("review");
  const switchViewToForm = () => {
    setGenerationError(null);
    setCurrentView("form");
  };

  const handleGenerateHabits = async (data: GoalInput) => {
    try {
      setGoalData(data);
      setGenerationError(null);
      setIsGenerating(true);
      switchViewToReview();
      const result = await generateHabits(data);

      if (!result.success || !result.data) {
        const errorMsg = result.error ?? "Failed to generate habits";
        setGenerationError(errorMsg);
        toast.error(errorMsg);
        return;
      }

      setGeneratedHabits(result.data);
    } catch (error) {
      const errorMsg = "An unexpected error occurred while generating habits";
      setGenerationError(errorMsg);
      toast.error(errorMsg);
      console.error("Generate habits error:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveHabits = async () => {
    if (!goalData || !generatedHabits?.length) {
      toast.error("Nothing to save!");
      return;
    }

    try {
      setIsSaving(true);

      const result = await saveHabits({
        goal: goalData.goal,
        additionalDetails: goalData.additionalDetails,
        habits: generatedHabits.map((h) => ({
          text: h.text,
          frequency: h.frequency,
          targetDuration: h.targetDuration,
          difficulty: h.difficulty,
          aiReasoning: h.aiReasoning,
          locked: h.locked,
          id: h.id,
        })),
      });

      if (!result.success) {
        toast.error(result.error ?? "Failed to save habits");
        return;
      }

      toast.success("Goal and habits saved successfully!");

      // Reset modal state and close
      setGeneratedHabits(null);
      setGoalData(null);
      setGenerationError(null);
      setCurrentView("form");
      reset();
      handleOpenChange(false);

      // Refresh data
      if (onGoalCreated) {
        onGoalCreated();
      }
      router.refresh();
    } catch (error) {
      console.error("Save habits error:", error);
      toast.error("An error occurred while saving habits");
    } finally {
      setIsSaving(false);
    }
  };

  const handleGenerateAgain = async () => {
    if (!goalData) {
      toast.error("No goal data available");
      return;
    }

    // If no habits exist yet (e.g. initial generation failed and user clicks retry)
    if (!generatedHabits || generatedHabits.length === 0) {
      await handleGenerateHabits(goalData);
      return;
    }

    try {
      setIsGenerating(true);
      setGenerationError(null);
      // keep the full objects so we preserve ids + locked state
      const lockedHabits = generatedHabits.filter((habit) => habit.locked);
      const unlockedCount = generatedHabits.filter((h) => !h.locked).length;

      const result = await regenerateHabits({
        goal: goalData.goal,
        additionalDetails: goalData.additionalDetails,
        count: Math.max(1, unlockedCount),
        lockedHabits: lockedHabits.map((h) => h.text),
      });

      if (!result.success || !result.data) {
        const errorMsg = result.error ?? "Failed to regenerate habits";
        setGenerationError(errorMsg);
        toast.error(errorMsg);
        return;
      }

      const updatedHabits = [...lockedHabits, ...result.data];
      setGeneratedHabits(updatedHabits);
      toast.success("Fresh habits generated");
    } catch (error) {
      const errorMsg = "An error occurred while regenerating habits";
      setGenerationError(errorMsg);
      toast.error(errorMsg);
      console.error("Generate habits error:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleToggleHabitLock = (habitId: string) => {
    setGeneratedHabits((prevHabits) => {
      if (!prevHabits) return [];
      return prevHabits.map((habit) =>
        habit.id === habitId ? { ...habit, locked: !habit.locked } : habit,
      );
    });
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      {!hideTrigger && (
        <DialogTrigger asChild>
          <Button className={className} {...props}>
            {children || (
              <>
                <Plus className="size-4" />
                <span>Set a New Goal</span>
              </>
            )}
          </Button>
        </DialogTrigger>
      )}

      <DialogContent className="sm:max-w-xl p-4 sm:p-6 gap-0 max-h-[calc(100dvh-2rem)] flex flex-col overflow-hidden">
        {currentView === "form" ? (
          <CreateGoalFormView
            control={control}
            handleSubmit={handleSubmit}
            setValue={setValue}
            errors={errors}
            isSubmitting={isSubmitting || isGenerating}
            switchViewToReview={switchViewToReview}
            onSubmit={handleGenerateHabits}
            generatedHabits={generatedHabits}
          />
        ) : (
          <CreateGoalReviewView
            goalTitle={goalData?.goal}
            generatedHabits={generatedHabits}
            switchViewToForm={switchViewToForm}
            handleGenerateAgain={handleGenerateAgain}
            handleToggleHabitLock={handleToggleHabitLock}
            isGenerating={isGenerating}
            handleSaveHabits={handleSaveHabits}
            isSaving={isSaving}
            generationError={generationError}
          />
        )}
      </DialogContent>
    </Dialog>
  );
};

export default CreateGoalModal;
