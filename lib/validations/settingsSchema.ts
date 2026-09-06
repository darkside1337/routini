import * as z from "zod";

export const UserSettingsSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(50, "Name is too long"),
  preferredTone: z.enum(["motivational", "direct", "casual", "empathetic"]),
  weekStartsOn: z.number().int().min(0).max(1),
  dailyReminderTime: z
    .string()
    .regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Please enter a valid time (HH:MM)"),
  enableNotifications: z.boolean(),
});

export type UserSettingsInput = z.infer<typeof UserSettingsSchema>;
