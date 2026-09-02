import DashboardHeader from "@/components/dashboard/dashboard-header";
import GoalFilters from "@/components/dashboard/goal-filters";
import GoalList from "@/components/dashboard/goal-list";
import { auth } from "@/lib/auth";
import { GoalFilter } from "@/types";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

const dummyData = {
  success: true,
  data: [
    {
      id: "goal_01hqxt7k2m9p4n8r3s6v0w1y2z",
      title: "Learn spot trading at Binance",
      description: "i work full time",
      status: "IN_PROGRESS",
      priority: "CRITICAL",
      startDate: "2026-08-26T00:00:00.000Z",
      targetDate: null,
      aiGenerated: true,
      habits: [
        {
          id: "habit_01hqxt7k2m9p4n8r3s6v0w1y2a",
          name: "Read one Binance Academy article (15 min)",
          frequency: "DAILY",
          status: "ACTIVE",
          order: 0,
          completedToday: true,
          streak: 4,
        },
        {
          id: "habit_01hqxt7k2m9p4n8r3s6v0w1y2b",
          name: "Watch one spot trading video",
          frequency: "DAILY",
          status: "ACTIVE",
          order: 1,
          completedToday: false,
          streak: 0,
        },
        {
          id: "habit_01hqxt7k2m9p4n8r3s6v0w1y2c",
          name: "Review key terms and concepts",
          frequency: "DAILY",
          status: "ACTIVE",
          order: 2,
          completedToday: true,
          streak: 12,
        },
        {
          id: "habit_01hqxt7k2m9p4n8r3s6v0w1y2d",
          name: "Practice with a demo trade",
          frequency: "DAILY",
          status: "ACTIVE",
          order: 3,
          completedToday: true,
          streak: 2,
        },
        {
          id: "habit_01hqxt7k2m9p4n8r3s6v0w1y2e",
          name: "Journal one lesson learned",
          frequency: "DAILY",
          status: "ACTIVE",
          order: 4,
          completedToday: false,
          streak: 0,
        },
      ],
    },
    {
      id: "goal_01hqxt8a3n0q5o9s4t7w1x2z3a",
      title: "Run a 5K",
      description: "Build up from walking; race in October",
      status: "COMPLETED",
      priority: "HIGH",
      startDate: "2026-08-10T00:00:00.000Z",
      targetDate: "2026-10-15T00:00:00.000Z",
      aiGenerated: true,
      habits: [
        {
          id: "habit_01hqxt8a3n0q5o9s4t7w1x2z3b",
          name: "Morning walk or run (20 min)",
          frequency: "DAILY",
          status: "ACTIVE",
          order: 0,
          completedToday: true,
          streak: 18,
        },
        {
          id: "habit_01hqxt8a3n0q5o9s4t7w1x2z3c",
          name: "Stretch for 10 minutes after work",
          frequency: "DAILY",
          status: "ACTIVE",
          order: 1,
          completedToday: false,
          streak: 5,
        },
        {
          id: "habit_01hqxt8a3n0q5o9s4t7w1x2z3d",
          name: "Log distance and how you felt",
          frequency: "DAILY",
          status: "ACTIVE",
          order: 2,
          completedToday: true,
          streak: 9,
        },
      ],
    },
    {
      id: "goal_01hqxt9b4o1r6p0t5u8x2y3z4b",
      title: "Read 12 books this year",
      description: "Mix of fiction and non-fiction, ~1 per month",
      status: "IN_PROGRESS",
      priority: "LOW",
      startDate: "2026-01-01T00:00:00.000Z",
      targetDate: "2026-12-31T00:00:00.000Z",
      aiGenerated: false,
      habits: [
        {
          id: "habit_01hqxt9b4o1r6p0t5u8x2y3z4c",
          name: "Read 20 pages before bed",
          frequency: "DAILY",
          status: "ACTIVE",
          order: 0,
          completedToday: false,
          streak: 3,
        },
        {
          id: "habit_01hqxt9b4o1r6p0t5u8x2y3z4d",
          name: "Carry a book or e-reader during commute",
          frequency: "DAILY",
          status: "ACTIVE",
          order: 1,
          completedToday: true,
          streak: 21,
        },
        {
          id: "habit_01hqxt9b4o1r6p0t5u8x2y3z4e",
          name: "Write 3 bullet takeaways on Sundays",
          frequency: "WEEKLY",
          status: "ACTIVE",
          order: 2,
          completedToday: false,
          streak: 1,
        },
      ],
    },
  ],
};
const DashboardPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return redirect("/auth/sign-in");
  }

  const resolvedSearchParams = await searchParams;
  const rawFilter = resolvedSearchParams?.filter as string | undefined;
  const filter: GoalFilter =
    rawFilter === "IN_PROGRESS" || rawFilter === "COMPLETED"
      ? rawFilter
      : "ALL";

  return (
    <div className="py-8 space-y-6 max-w-5xl mx-auto px-2 sm:px-0">
      <DashboardHeader />
      <GoalFilters />
      <GoalList goals={dummyData.data} filter={filter} />
    </div>
  );
};

export default DashboardPage;
