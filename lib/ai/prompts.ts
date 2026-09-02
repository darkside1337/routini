import "server-only";

export const generateHabitsSystemPrompt = () => {
  return `You are a habit formation expert who helps people achieve their goals through small, actionable daily habits. Generate specific, measurable, and achievable daily habits.`;
};

export const generateHabitsUserPrompt = ({
  goal,
  additionalDetails,
  count,
}: {
  goal: string;
  additionalDetails?: string;
  count: number;
}) => {
  return `Generate exactly ${count} specific, actionable daily habits for this goal:

Goal: ${goal}
${additionalDetails ? `Additional context: ${additionalDetails}` : ""}

IMPORTANT: Return ONLY valid JSON with no markdown code fences, no preamble, no explanation.
Format: {"habits": ["habit 1", "habit 2", ...]}`;
};

export const regenerateHabitsSystemPrompt = () => {
  return `You are a habit formation expert. Generate NEW daily habits that are DIFFERENT from the ones already selected.`;
};
export const regenerateHabitsUserPrompt = ({
  goal,
  additionalDetails,
  count,
  lockedHabits,
}: {
  goal: string;
  additionalDetails?: string;
  count: number;
  lockedHabits: string[];
}) => {
  return `Generate exactly ${count} NEW daily habits for this goal that are DIFFERENT from the already selected habits:

Goal: ${goal}
${additionalDetails ? `Additional context: ${additionalDetails}` : ""}

ALREADY SELECTED HABITS (DO NOT repeat or create similar ones):
${lockedHabits.map((habit, i) => `${i + 1}. ${habit}`).join("\n")}

Requirements:
- Generate ${count} completely new and different habits
- Focus on different aspects of the goal than the selected habits
- Make them complement the existing habits
- Keep them actionable and achievable daily
- Avoid any overlap or similarity with the selected habits above

IMPORTANT: Return ONLY valid JSON with no markdown code fences, no preamble, no explanation.
Format: {"habits": ["habit 1", "habit 2", ...]}`;
};
