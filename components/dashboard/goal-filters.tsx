"use client";
import { GOAL_FILTERS, GoalFilter } from "@/types";
import { Button } from "../ui/button";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";

const GoalFilters = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const handleChangeFilterClick = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value === "ALL") {
      params.delete("filter");
    } else {
      params.set("filter", value);
    }
    router.push(`${pathname}?${params.toString()}`);
  };

  const currentFilter: GoalFilter =
    (searchParams.get("filter") as GoalFilter) ?? "ALL";

  return (
    <section>
      <div
        role="group"
        aria-label="Filter your goals"
        className="flex flex-wrap items-center gap-2"
      >
        {GOAL_FILTERS.map(({ label, value }) => {
          const isActive = currentFilter === value;
          return (
            <Button
              key={value}
              onClick={() => handleChangeFilterClick(value)}
              size="sm"
              variant={isActive ? "default" : "outline"}
              className={cn(
                "rounded-full px-4 text-xs sm:text-sm font-medium transition-all shadow-none",
                !isActive && "border-border/80 bg-background text-muted-foreground hover:bg-muted/60 hover:text-foreground"
              )}
            >
              {label}
            </Button>
          );
        })}
      </div>
    </section>
  );
};

export default GoalFilters;

