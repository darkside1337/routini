import { GoalCard } from "./goal-card";
import { GoalWithHabits, GoalFilter } from "@/types";
import { Card } from "@/components/ui/card";
import { Target, Plus } from "lucide-react";
import CreateGoalModal from "../create-goal-modal/create-goal-modal";

interface GoalListProps {
  goals: GoalWithHabits[];
  filter?: GoalFilter;
}

const GoalList = ({ goals, filter = "ALL" }: GoalListProps) => {
  const filteredGoals = goals.filter((goal) => {
    if (filter === "ALL") return true;
    return goal.status === filter;
  });

  if (!filteredGoals.length) {
    return <GoalListEmptyState filter={filter} />;
  }

  return (
    <div className="flex flex-col gap-6">
      {filteredGoals.map((goal) => (
        <GoalCard key={goal.id} goal={goal} />
      ))}
    </div>
  );
};

const GoalListEmptyState = ({ filter = "ALL" }: { filter?: GoalFilter }) => {
  const message =
    filter === "ALL"
      ? "You have no goals yet"
      : `You have no ${filter === "IN_PROGRESS" ? "in-progress" : "completed"} goals`;

  return (
    <Card className="flex flex-col items-center justify-center text-center p-12 rounded-2xl border-dashed border-2 border-border/80 bg-card/50">
      <div className="flex items-center justify-center size-12 rounded-full bg-primary/10 text-primary mb-4">
        <Target className="size-6" />
      </div>
      <h3 className="text-lg font-semibold text-foreground">{message}</h3>
      <p className="text-sm text-muted-foreground mt-1 max-w-sm">
        Start building positive habits and achieving your milestones by creating your first goal.
      </p>
      <div className="mt-6">
        <CreateGoalModal size="sm">
          <Plus className="size-4 mr-1.5" />
          <span>Set a New Goal</span>
        </CreateGoalModal>
      </div>
    </Card>
  );
};

export default GoalList;

