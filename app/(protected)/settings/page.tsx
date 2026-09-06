import React from "react";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getUserSettings } from "@/actions/settingsActions";
import SettingsForm from "@/components/settings/settings-form";

export const metadata = {
  title: "Settings & Preferences | Routini",
  description: "Configure your profile, AI tone, and habit tracking preferences.",
};

export default async function SettingsPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return redirect("/auth/sign-in");
  }

  const response = await getUserSettings();

  if (!response.success) {
    return (
      <div className="py-8 space-y-6 max-w-4xl mx-auto px-2 sm:px-0">
        <div className="rounded-xl border border-destructive/20 bg-destructive/10 p-6 text-center text-sm text-destructive">
          {response.error || "Failed to load settings. Please try again."}
        </div>
      </div>
    );
  }

  return (
    <div className="py-8 space-y-6 max-w-4xl mx-auto px-2 sm:px-0 pb-20 md:pb-8">
      <div>
        <h1 className="text-xl md:text-3xl font-bold tracking-tight text-foreground">
          Settings & Preferences
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Customize your profile, behavioral AI generation tone, and tracking calendar
        </p>
      </div>

      <SettingsForm initialData={response.data} />
    </div>
  );
}
