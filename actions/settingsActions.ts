"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/db";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import {
  UserSettingsSchema,
  UserSettingsInput,
} from "@/lib/validations/settingsSchema";

export type { UserSettingsInput };

export type UserSettingsData = {
  id: string;
  name: string;
  email: string;
  image?: string | null;
  preferences: {
    preferredTone: string;
    weekStartsOn: number;
    dailyReminderTime: string;
    enableNotifications: boolean;
  };
};

export type UserSettingsResponse =
  | { success: true; data: UserSettingsData }
  | { success: false; error: string };

export async function getUserSettings(): Promise<UserSettingsResponse> {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user?.id) {
      return { success: false, error: "Unauthorized" };
    }

    const userId = session.user.id;

    // Fetch user
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return { success: false, error: "User not found" };
    }

    // Fetch user preferences directly by userId
    let preferences = await prisma.userPreferences.findUnique({
      where: { userId },
    });

    // Seed preferences if missing
    if (!preferences) {
      preferences = await prisma.userPreferences.create({
        data: {
          userId,
          preferredTone: "motivational",
          weekStartsOn: 1, // default Monday
          dailyReminderTime: "08:00",
          enableNotifications: true,
        },
      });
    }

    return {
      success: true,
      data: {
        id: user.id,
        name: user.name || "User",
        email: user.email,
        image: user.image,
        preferences: {
          preferredTone: preferences.preferredTone || "motivational",
          weekStartsOn: preferences.weekStartsOn ?? 1,
          dailyReminderTime: preferences.dailyReminderTime || "08:00",
          enableNotifications: preferences.enableNotifications ?? true,
        },
      },
    };
  } catch (error) {
    console.error("getUserSettings error:", error);
    return { success: false, error: "Failed to load user settings." };
  }
}

export async function updateUserSettings(input: UserSettingsInput) {
  try {
    const validated = UserSettingsSchema.safeParse(input);
    if (!validated.success) {
      return {
        success: false,
        error: validated.error.issues?.[0]?.message || "Invalid input data",
      };
    }

    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user?.id) {
      return { success: false, error: "Unauthorized" };
    }

    const userId = session.user.id;
    const { name, preferredTone, weekStartsOn, dailyReminderTime, enableNotifications } =
      validated.data;

    // Transaction to update both User and UserPreferences
    await prisma.$transaction([
      prisma.user.update({
        where: { id: userId },
        data: { name },
      }),
      prisma.userPreferences.upsert({
        where: { userId },
        create: {
          userId,
          preferredTone,
          weekStartsOn,
          dailyReminderTime,
          enableNotifications,
        },
        update: {
          preferredTone,
          weekStartsOn,
          dailyReminderTime,
          enableNotifications,
        },
      }),
    ]);

    revalidatePath("/settings");
    revalidatePath("/dashboard");
    revalidatePath("/dashboard/progress");

    return { success: true };
  } catch (error) {
    console.error("updateUserSettings error:", error);
    return { success: false, error: "Failed to update settings. Please try again." };
  }
}
