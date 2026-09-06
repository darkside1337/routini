import DashboardHeader from "@/components/dashboard/dashboard-header";
import GoalFilters from "@/components/dashboard/goal-filters";
import GoalList from "@/components/dashboard/goal-list";
import { OnboardingDialog } from "@/components/onboarding/onboarding-dialog";
import { auth } from "@/lib/auth";
import { getGoals } from "@/actions/goalActions";
import { getOnboardingStatus } from "@/actions/onboardingActions";
import { GoalFilter } from "@/types";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

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

  const [goalsResponse, onboardingResponse] = await Promise.all([
    getGoals(filter),
    getOnboardingStatus(),
  ]);

  const goals = goalsResponse.success ? goalsResponse.data : [];
  const hasCompletedOnboarding = onboardingResponse.success
    ? onboardingResponse.data?.hasCompletedOnboarding ?? false
    : true;

  const showOnboarding =
    resolvedSearchParams?.onboarding === "true" ||
    (!hasCompletedOnboarding && goals.length === 0);

  return (
    <div className="py-8 space-y-6 max-w-5xl mx-auto px-2 sm:px-0">
      <DashboardHeader />
      {showOnboarding && <OnboardingDialog initialOpen={true} />}
      {!goalsResponse.success ? (
        <div className="rounded-xl border border-destructive/20 bg-destructive/10 p-6 text-center text-sm text-destructive">
          {goalsResponse.error || "Failed to load goals. Please try again later."}
        </div>
      ) : (
        <>
          <GoalFilters />
          <GoalList goals={goals} filter={filter} />
        </>
      )}
    </div>
  );
};

export default DashboardPage;
