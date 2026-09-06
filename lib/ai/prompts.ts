import "server-only";

export const generateHabitsSystemPrompt = (tone?: string | null) => {
  const toneInstruction = tone
    ? `Adopt a ${tone} tone in your descriptions and rationales.`
    : "";
  return `You are a behavioral psychologist and habit formation expert. You help people achieve their goals through small, actionable daily habits. Generate specific, measurable, bite-sized daily habits with clear duration, difficulty, and rationale. ${toneInstruction}`.trim();
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
  return `Generate exactly ${count} specific, actionable habits for this goal:

Goal: ${goal}
${additionalDetails ? `Additional context: ${additionalDetails}` : ""}

Requirements for each habit:
- "name": Concise, actionable action title (e.g. "15-min Morning Zone 2 Jog")
- "frequency": "DAILY", "WEEKLY", or "MONTHLY" (default to "DAILY")
- "targetDuration": Recommended duration in minutes as an integer (e.g. 5, 15, 30)
- "difficulty": "EASY", "MEDIUM", or "HARD"
- "aiReasoning": 1 concise sentence explaining why this habit directly supports the goal

IMPORTANT: Return ONLY valid JSON with no markdown code fences, no preamble, no explanation.
Format:
{
  "habits": [
    {
      "name": "string",
      "frequency": "DAILY",
      "targetDuration": 15,
      "difficulty": "EASY",
      "aiReasoning": "string"
    }
  ]
}`;
};

export const regenerateHabitsSystemPrompt = (tone?: string | null) => {
  const toneInstruction = tone
    ? `Adopt a ${tone} tone in your descriptions and rationales.`
    : "";
  return `You are a behavioral psychologist and habit formation expert. Generate NEW habits that are distinctly DIFFERENT from existing ones, providing actionable duration, difficulty, and rationale. ${toneInstruction}`.trim();
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
  return `Generate exactly ${count} NEW habits for this goal that are DIFFERENT from the already selected habits:

Goal: ${goal}
${additionalDetails ? `Additional context: ${additionalDetails}` : ""}

ALREADY SELECTED HABITS (DO NOT repeat or duplicate these):
${lockedHabits.map((habit, i) => `${i + 1}. ${habit}`).join("\n")}

Requirements:
- Generate ${count} completely new, fresh habits
- Complement the existing habits rather than repeating them
- "name": Concise, actionable action title
- "frequency": "DAILY", "WEEKLY", or "MONTHLY" (default to "DAILY")
- "targetDuration": Recommended duration in minutes as an integer (e.g. 5, 15, 30)
- "difficulty": "EASY", "MEDIUM", or "HARD"
- "aiReasoning": 1 concise sentence explaining why this habit directly supports the goal

IMPORTANT: Return ONLY valid JSON with no markdown code fences, no preamble, no explanation.
Format:
{
  "habits": [
    {
      "name": "string",
      "frequency": "DAILY",
      "targetDuration": 15,
      "difficulty": "EASY",
      "aiReasoning": "string"
    }
  ]
}`;
};
