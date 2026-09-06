"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  UserSettingsSchema,
  UserSettingsInput,
} from "@/lib/validations/settingsSchema";
import {
  UserSettingsData,
  updateUserSettings,
} from "@/actions/settingsActions";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  User,
  Bot,
  Calendar,
  Clock,
  Sparkles,
  Save,
  CheckCircle,
  Loader2,
  Bell,
  LogOut,
} from "lucide-react";

interface SettingsFormProps {
  initialData: UserSettingsData;
}

const TONE_OPTIONS = [
  {
    id: "motivational",
    title: "Motivational",
    description: "Encouraging, inspiring, celebrating momentum and wins.",
    icon: Sparkles,
  },
  {
    id: "direct",
    title: "Direct & Tactical",
    description: "Concise, actionable, focused strictly on execution.",
    icon: CheckCircle,
  },
  {
    id: "casual",
    title: "Casual & Friendly",
    description: "Relaxed, conversational, and approachable.",
    icon: User,
  },
  {
    id: "empathetic",
    title: "Empathetic",
    description: "Supportive, forgiving, and understanding of daily friction.",
    icon: Bot,
  },
] as const;

type PreferredTone = "motivational" | "direct" | "casual" | "empathetic";

function isValidTone(tone: string): tone is PreferredTone {
  return ["motivational", "direct", "casual", "empathetic"].includes(tone);
}

export default function SettingsForm({ initialData }: SettingsFormProps) {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);

  const handleSignOut = async () => {
    try {
      setIsSigningOut(true);
      await authClient.signOut({
        fetchOptions: {
          onSuccess: () => {
            toast.success("Signed out successfully");
            router.replace("/auth/sign-in");
          },
        },
      });
    } catch (error) {
      console.error("Sign out error:", error);
      toast.error("Failed to sign out");
      setIsSigningOut(false);
    }
  };

  const defaultTone: PreferredTone = isValidTone(initialData.preferences.preferredTone)
    ? initialData.preferences.preferredTone
    : "motivational";

  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors },
  } = useForm<UserSettingsInput>({
    resolver: zodResolver(UserSettingsSchema),
    defaultValues: {
      name: initialData.name,
      preferredTone: defaultTone,
      weekStartsOn: initialData.preferences.weekStartsOn ?? 1,
      dailyReminderTime: initialData.preferences.dailyReminderTime || "08:00",
      enableNotifications: initialData.preferences.enableNotifications ?? true,
    },
  });

  const selectedTone = useWatch({ control, name: "preferredTone" });
  const selectedWeekStart = useWatch({ control, name: "weekStartsOn" });
  const notificationsEnabled = useWatch({ control, name: "enableNotifications" });

  const onSubmit = async (data: UserSettingsInput) => {
    setIsPending(true);
    try {
      const res = await updateUserSettings(data);
      if (res.success) {
        toast.success("Preferences saved successfully!");
      } else {
        toast.error(res.error || "Failed to update settings");
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong while saving settings");
    } finally {
      setIsPending(false);
    }
  };

  const getUserInitials = (name?: string | null, email?: string | null) => {
    if (name?.trim()) {
      return name
        .trim()
        .split(/\s+/)
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
    }
    return email?.slice(0, 2).toUpperCase() || "U";
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* 1. Profile Section */}
      <Card className="border-border/60 shadow-xs">
        <CardHeader className="p-4 sm:p-6 pb-3">
          <CardTitle className="text-base sm:text-lg font-semibold flex items-center gap-2">
            <User className="size-4 text-primary" />
            <span>Profile Information</span>
          </CardTitle>
          <CardDescription className="text-xs sm:text-sm">
            Manage your personal details and account presence
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4 sm:p-6 pt-2 space-y-4">
          <div className="flex items-center gap-4">
            <Avatar className="size-14 sm:size-16 rounded-2xl border border-border/80">
              <AvatarImage src={initialData.image ?? undefined} alt={initialData.name} />
              <AvatarFallback className="rounded-2xl text-base font-bold bg-primary/10 text-primary">
                {getUserInitials(initialData.name, initialData.email)}
              </AvatarFallback>
            </Avatar>
            <div className="space-y-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="text-sm font-semibold text-foreground truncate">
                  {initialData.name}
                </p>
                <Badge variant="outline" className="text-[10px] px-1.5 py-0 font-medium">
                  Verified
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground truncate">{initialData.email}</p>
            </div>
          </div>

          <div className="space-y-2 pt-2">
            <Label htmlFor="name" className="text-xs sm:text-sm font-medium">
              Display Name
            </Label>
            <Input
              id="name"
              {...register("name")}
              placeholder="Your name"
              className="max-w-md"
            />
            {errors.name && (
              <p className="text-xs text-destructive">{errors.name.message}</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* 2. AI Habit Breakdown Preferences */}
      <Card className="border-border/60 shadow-xs">
        <CardHeader className="p-4 sm:p-6 pb-3">
          <CardTitle className="text-base sm:text-lg font-semibold flex items-center gap-2">
            <Bot className="size-4 text-teal-600 dark:text-teal-400" />
            <span>AI Habit Generation Tone</span>
          </CardTitle>
          <CardDescription className="text-xs sm:text-sm">
            Controls the voice and behavioral style Gemini uses when generating your habit stacks
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4 sm:p-6 pt-2 space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {TONE_OPTIONS.map((option) => {
              const isSelected = selectedTone === option.id;
              const Icon = option.icon;
              return (
                <button
                  type="button"
                  key={option.id}
                  onClick={() => setValue("preferredTone", option.id, { shouldDirty: true })}
                  className={`p-3.5 sm:p-4 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between space-y-2 ${
                    isSelected
                      ? "border-primary bg-primary/5 ring-1 ring-primary/40 shadow-xs"
                      : "border-border/60 bg-card hover:border-border/90 hover:bg-muted/30"
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <span className="font-semibold text-sm text-foreground flex items-center gap-2">
                      <Icon
                        className={`size-4 ${
                          isSelected ? "text-primary" : "text-muted-foreground"
                        }`}
                      />
                      {option.title}
                    </span>
                    {isSelected && (
                      <span className="size-2 rounded-full bg-primary animate-pulse" />
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {option.description}
                  </p>
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* 3. Schedule & Tracking Habits */}
      <Card className="border-border/60 shadow-xs">
        <CardHeader className="p-4 sm:p-6 pb-3">
          <CardTitle className="text-base sm:text-lg font-semibold flex items-center gap-2">
            <Calendar className="size-4 text-indigo-600 dark:text-indigo-400" />
            <span>Calendar & Schedule</span>
          </CardTitle>
          <CardDescription className="text-xs sm:text-sm">
            Customize week alignments for streaks and your habit calendar
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4 sm:p-6 pt-2 space-y-5">
          {/* Week Starts On */}
          <div className="space-y-2">
            <Label className="text-xs sm:text-sm font-medium">First Day of the Week</Label>
            <div className="flex gap-2">
              <Button
                type="button"
                variant={selectedWeekStart === 1 ? "default" : "outline"}
                onClick={() => setValue("weekStartsOn", 1, { shouldDirty: true })}
                className="cursor-pointer font-medium text-xs rounded-xl h-9 px-3.5"
              >
                Monday (Standard)
              </Button>
              <Button
                type="button"
                variant={selectedWeekStart === 0 ? "default" : "outline"}
                onClick={() => setValue("weekStartsOn", 0, { shouldDirty: true })}
                className="cursor-pointer font-medium text-xs rounded-xl h-9 px-3.5"
              >
                Sunday
              </Button>
            </div>
            <p className="text-[11px] text-muted-foreground">
              Determines how week boundaries and streak cycles are calculated.
            </p>
          </div>

          {/* Daily Reminder Time */}
          <div className="space-y-2 pt-2 border-t border-border/40">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="reminderTime" className="text-xs sm:text-sm font-medium flex items-center gap-1.5">
                  <Clock className="size-3.5 text-muted-foreground" />
                  <span>Daily Habit Reminder Time</span>
                </Label>
                <p className="text-[11px] text-muted-foreground">
                  Target check-in prompt for your daily routines
                </p>
              </div>
              <Input
                id="reminderTime"
                type="time"
                {...register("dailyReminderTime")}
                className="w-32 text-xs"
              />
            </div>
            {errors.dailyReminderTime && (
              <p className="text-xs text-destructive">{errors.dailyReminderTime.message}</p>
            )}
          </div>

          {/* Enable Notifications */}
          <div className="flex items-center justify-between pt-2 border-t border-border/40">
            <div className="space-y-0.5">
              <Label className="text-xs sm:text-sm font-medium flex items-center gap-1.5">
                <Bell className="size-3.5 text-muted-foreground" />
                <span>Habit Reminder Notifications</span>
              </Label>
              <p className="text-[11px] text-muted-foreground">
                Receive notifications to check off your habits
              </p>
            </div>
            <input
              type="checkbox"
              checked={notificationsEnabled}
              onChange={(e) =>
                setValue("enableNotifications", e.target.checked, { shouldDirty: true })
              }
              className="size-4.5 rounded border-border text-primary accent-primary cursor-pointer"
            />
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end pt-2">
        <Button
          type="submit"
          disabled={isPending}
          className="cursor-pointer font-medium rounded-xl px-5 shadow-xs gap-2"
        >
          {isPending ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              <span>Saving Preferences...</span>
            </>
          ) : (
            <>
              <Save className="size-4" />
              <span>Save Preferences</span>
            </>
          )}
        </Button>
      </div>

      {/* Account & Session Section */}
      <Card className="border-border/60 shadow-xs">
        <CardHeader className="p-4 sm:p-6 pb-2 sm:pb-3">
          <CardTitle className="text-base sm:text-lg font-semibold flex items-center gap-2">
            <User className="size-4 text-primary" />
            <span>Account & Session</span>
          </CardTitle>
          <CardDescription className="text-xs sm:text-sm">
            Manage your active session and sign out across devices
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4 sm:p-6 pt-2 sm:pt-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl border border-border/50 bg-muted/20">
            <div className="flex items-center gap-3 min-w-0">
              <Avatar className="size-10 rounded-xl shrink-0 border border-border/60">
                <AvatarImage src={initialData.image ?? undefined} alt={initialData.name} />
                <AvatarFallback className="rounded-xl font-semibold bg-primary text-primary-foreground">
                  {initialData.name?.slice(0, 2).toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-foreground truncate">
                  {initialData.name || "User"}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {initialData.email}
                </p>
              </div>
            </div>

            <Button
              type="button"
              variant="outline"
              disabled={isSigningOut}
              onClick={handleSignOut}
              className="cursor-pointer font-medium rounded-xl border-destructive/30 text-destructive hover:bg-destructive/10 hover:text-destructive hover:border-destructive/50 transition-colors gap-2 self-start sm:self-auto shrink-0"
            >
              {isSigningOut ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  <span>Signing Out...</span>
                </>
              ) : (
                <>
                  <LogOut className="size-4" />
                  <span>Sign Out</span>
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  );
}
