"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";

export interface OnboardingStatusResponse {
  hasCompletedOnboarding: boolean;
  hasGoals: boolean;
}

/**
 * Checks whether the authenticated user has completed the onboarding flow.
 * If the user already has goals in the database, automatically marks onboarding as complete.
 */
export async function getOnboardingStatus(): Promise<{
  success: boolean;
  data?: OnboardingStatusResponse;
  error?: string;
}> {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user?.id) {
      return { success: false, error: "Unauthorized" };
    }

    const userId = session.user.id;

    // Check existing goals count
    const goalCount = await prisma.goal.count({
      where: { userId },
    });

    // Check user preferences
    const preferences = await prisma.userPreferences.findUnique({
      where: { userId },
    });

    // If user already has goals, ensure hasCompletedOnboarding is set to true
    if (goalCount > 0) {
      if (!preferences?.hasCompletedOnboarding) {
        await prisma.userPreferences.upsert({
          where: { userId },
          create: {
            userId,
            hasCompletedOnboarding: true,
          },
          update: {
            hasCompletedOnboarding: true,
          },
        });
      }

      return {
        success: true,
        data: {
          hasCompletedOnboarding: true,
          hasGoals: true,
        },
      };
    }

    const hasCompletedOnboarding = preferences?.hasCompletedOnboarding ?? false;

    return {
      success: true,
      data: {
        hasCompletedOnboarding,
        hasGoals: false,
      },
    };
  } catch (error) {
    console.error("getOnboardingStatus error:", error);
    return { success: false, error: "Failed to check onboarding status." };
  }
}

/**
 * Marks onboarding as complete for the authenticated user (e.g. when skipping or completing flow).
 */
export async function completeOnboardingAction(): Promise<{
  success: boolean;
  error?: string;
}> {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user?.id) {
      return { success: false, error: "Unauthorized" };
    }

    const userId = session.user.id;

    await prisma.userPreferences.upsert({
      where: { userId },
      create: {
        userId,
        hasCompletedOnboarding: true,
      },
      update: {
        hasCompletedOnboarding: true,
      },
    });

    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    console.error("completeOnboardingAction error:", error);
    return { success: false, error: "Failed to complete onboarding." };
  }
}

/**
 * Development & testing helper to reset onboarding status.
 */
export async function resetOnboardingAction(): Promise<{
  success: boolean;
  error?: string;
}> {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user?.id) {
      return { success: false, error: "Unauthorized" };
    }

    const userId = session.user.id;

    await prisma.userPreferences.upsert({
      where: { userId },
      create: {
        userId,
        hasCompletedOnboarding: false,
      },
      update: {
        hasCompletedOnboarding: false,
      },
    });

    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    console.error("resetOnboardingAction error:", error);
    return { success: false, error: "Failed to reset onboarding." };
  }
}
