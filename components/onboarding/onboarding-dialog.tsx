"use client";

import { useState, useTransition } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { completeOnboardingAction } from "@/actions/onboardingActions";
import CreateGoalModal from "@/components/create-goal-modal/create-goal-modal";
import { Sparkles, ArrowRight, Target, Brain, Lock, X } from "lucide-react";
import { toast } from "sonner";

interface OnboardingDialogProps {
  initialOpen?: boolean;
}

const STARTER_GOALS = [
  {
    emoji: "🏃",
    title: "Run a 5K marathon",
    category: "Fitness",
  },
  {
    emoji: "💻",
    title: "Master TypeScript in 30 days",
    category: "Coding",
  },
  {
    emoji: "🧘",
    title: "Establish a 15-min morning routine",
    category: "Wellness",
  },
  {
    emoji: "📚",
    title: "Read 20 pages every day",
    category: "Mindset",
  },
];

export function OnboardingDialog({
  initialOpen = true,
}: OnboardingDialogProps) {
  const [open, setOpen] = useState(initialOpen);
  const [goalModalOpen, setGoalModalOpen] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState<string>("");
  const [isPending, startTransition] = useTransition();

  const handleSkip = () => {
    startTransition(async () => {
      try {
        const res = await completeOnboardingAction();
        if (res.success) {
          setOpen(false);
          toast.info(
            "Welcome to your dashboard! Set a goal whenever you are ready.",
          );
        } else {
          toast.error(res.error || "Failed to dismiss onboarding.");
        }
      } catch (err) {
        console.error("Skip onboarding error:", err);
        setOpen(false);
      }
    });
  };

  const handleOpenGoalModal = (goalTitle?: string) => {
    setSelectedGoal(goalTitle || "");
    setOpen(false);
    setGoalModalOpen(true);
  };

  const handleGoalCreated = () => {
    setGoalModalOpen(false);
  };

  return (
    <>
      <Dialog
        open={open}
        onOpenChange={(next) => {
          if (!next) {
            handleSkip();
          } else {
            setOpen(next);
          }
        }}
      >
        <DialogContent
          showCloseButton={false}
          className="w-[calc(100%-2rem)] sm:max-w-lg p-4 sm:p-6 gap-0 max-h-[calc(100dvh-2rem)] flex flex-col overflow-y-auto rounded-2xl border-border bg-card/95 backdrop-blur-md shadow-2xl"
        >
          {/* Top Bar with Skip Icon */}
          <div className="flex items-center justify-between pb-2">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20">
              <Sparkles className="size-3 animate-pulse" />
              <span>Welcome to Routini</span>
            </div>
            <button
              onClick={handleSkip}
              disabled={isPending}
              aria-label="Skip onboarding"
              className="text-muted-foreground hover:text-foreground transition-colors p-1 rounded-lg hover:bg-muted/50 cursor-pointer disabled:opacity-50"
            >
              <X className="size-4" />
            </button>
          </div>

          {/* Header */}
          <DialogHeader className="text-left space-y-1 pt-0.5 pb-2.5">
            <DialogTitle className="text-lg sm:text-2xl font-bold tracking-tight text-foreground leading-snug">
              Turn Big Ambitions Into Daily Momentum
            </DialogTitle>
            <DialogDescription className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              No blank-canvas paralysis. Set a goal, and AI generates 3–5
              bite-sized, calibrated daily habits in seconds.
            </DialogDescription>
          </DialogHeader>

          {/* 3-Step Micro Explainer */}
          <div className="grid grid-cols-3 gap-1.5 sm:gap-3 py-2 sm:py-2.5 my-1 border-y border-border/60">
            <div className="flex flex-col items-center text-center p-1.5 sm:p-2.5 rounded-xl bg-muted/30">
              <div className="size-7 sm:size-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-1">
                <Target className="size-3.5 sm:size-4" />
              </div>
              <span className="text-[11px] sm:text-xs font-semibold text-foreground leading-tight">
                1. Name Goal
              </span>
              <span className="text-[10px] text-muted-foreground hidden sm:block mt-0.5">
                High-level ambition
              </span>
            </div>

            <div className="flex flex-col items-center text-center p-1.5 sm:p-2.5 rounded-xl bg-muted/30">
              <div className="size-7 sm:size-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-1">
                <Brain className="size-3.5 sm:size-4" />
              </div>
              <span className="text-[11px] sm:text-xs font-semibold text-foreground leading-tight">
                2. AI Habits
              </span>
              <span className="text-[10px] text-muted-foreground hidden sm:block mt-0.5">
                Bite-sized daily tasks
              </span>
            </div>

            <div className="flex flex-col items-center text-center p-1.5 sm:p-2.5 rounded-xl bg-muted/30">
              <div className="size-7 sm:size-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-1">
                <Lock className="size-3.5 sm:size-4" />
              </div>
              <span className="text-[11px] sm:text-xs font-semibold text-foreground leading-tight">
                3. Lock & Track
              </span>
              <span className="text-[10px] text-muted-foreground hidden sm:block mt-0.5">
                Keep favorites, re-roll
              </span>
            </div>
          </div>

          {/* Quick-Start Inspiration Chips */}
          <div className="py-2.5 sm:py-3 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] sm:text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Quick-Start Ideas
              </span>
              <span className="text-[10px] sm:text-[11px] text-muted-foreground/80">
                Click to start with a prompt
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 sm:gap-2">
              {STARTER_GOALS.map((starter) => (
                <button
                  key={starter.title}
                  type="button"
                  onClick={() => handleOpenGoalModal(starter.title)}
                  className="flex items-center gap-2 p-2 sm:p-2.5 rounded-xl border border-border/70 hover:border-primary/50 bg-background/50 hover:bg-primary/5 transition-all text-left group cursor-pointer"
                >
                  <span className="text-sm sm:text-base shrink-0 select-none">
                    {starter.emoji}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-[11px] sm:text-xs font-medium text-foreground truncate group-hover:text-primary transition-colors">
                      {starter.title}
                    </p>
                    <span className="text-[9px] sm:text-[10px] text-muted-foreground">
                      {starter.category}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 pt-2.5 border-t border-border/60 mt-1">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              disabled={isPending}
              onClick={handleSkip}
              className="text-muted-foreground hover:text-foreground text-xs order-2 sm:order-1 h-9 sm:h-10 cursor-pointer"
            >
              Skip for now
            </Button>

            <Button
              type="button"
              size="default"
              onClick={() => handleOpenGoalModal()}
              className="h-10 sm:h-11 px-4 sm:px-5 rounded-xl font-medium text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm order-1 sm:order-2 cursor-pointer"
            >
              <span>Set Your First Goal</span>
              <ArrowRight className="size-3.5 sm:size-4" />
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Controlled Goal Creation Modal */}
      <CreateGoalModal
        open={goalModalOpen}
        onOpenChange={setGoalModalOpen}
        initialGoal={selectedGoal}
        onGoalCreated={handleGoalCreated}
        hideTrigger
      />
    </>
  );
}
