import React from "react";
import { Plus } from "lucide-react";
import CreateGoalModal from "../create-goal-modal/create-goal-modal";

const DashboardHeader = () => {
  return (
    <section className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 className="text-xl md:text-3xl font-bold tracking-tight text-foreground">
          Your Goals
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Track your goals and daily habits
        </p>
      </div>
      <CreateGoalModal
        size="default"
        className="shadow-xs font-medium cursor-pointer self-start sm:self-auto"
      >
        <Plus className="size-4 mr-1.5" />
        <span>Set a New Goal</span>
      </CreateGoalModal>
    </section>
  );
};

export default DashboardHeader;
