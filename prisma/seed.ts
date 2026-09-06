import "dotenv/config";
import prisma from "../lib/db";
import {
  GoalStatus,
  GoalPriority,
  HabitFrequency,
  HabitStatus,
  HabitDifficulty,
} from "../lib/generated/prisma/client";


const DEFAULT_EMAIL = process.env.SEED_USER_EMAIL || "medini.ali.2000@gmail.com";

function getUtcDay(daysAgo: number): Date {
  const now = new Date();
  const d = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() - daysAgo));
  return d;
}

async function main() {
  console.log(`🌱 Resolving target user for seeding...`);

  // Target preferred user, fallback to latest existing user, or create demo user
  let user = await prisma.user.findUnique({
    where: { email: DEFAULT_EMAIL },
  });

  if (!user) {
    user = await prisma.user.findFirst({
      orderBy: { createdAt: "desc" },
    });
  }

  if (!user) {
    console.log("No user found in database. Creating default demo user...");
    user = await prisma.user.create({
      data: {
        id: "demo-user-routini",
        email: "demo@routini.app",
        name: "Demo User",
        username: "demouser",
      },
    });
  }

  console.log(`Found target user: ${user.name ?? user.email} (${user.id})`);


  // Clean existing goals and related habits/logs for fresh demo state
  console.log("🧹 Clearing previous stale goals and habit logs...");
  await prisma.goal.deleteMany({
    where: { userId: user.id },
  });

  console.log("✨ Creating varied goals and habits...");

  // 1. CRITICAL PRIORITY: Engineering & AI
  const goalAi = await prisma.goal.create({
    data: {
      userId: user.id,
      title: "Master Full-Stack Next.js & AI Engineering",
      description: "Ship production-grade web applications using App Router, PostgreSQL, and Gemini generative models.",
      status: GoalStatus.IN_PROGRESS,
      priority: GoalPriority.CRITICAL,
      startDate: getUtcDay(90),
      aiGenerated: true,
      aiPrompt: "Become a proficient Full-Stack Next.js and AI Engineer capable of shipping scalable products",
      habits: {
        create: [
          {
            name: "Deep-dive Next.js Server Actions & Caching",
            description: "Practice architecture patterns, revalidation tags, and optimistic mutations.",
            frequency: HabitFrequency.DAILY,
            targetDuration: 30,
            status: HabitStatus.ACTIVE,
            difficulty: HabitDifficulty.MEDIUM,
            aiGenerated: true,
            aiReasoning: "Consistent daily implementation cements server-side paradigm understanding.",
            order: 0,
          },
          {
            name: "Implement 1 AI feature with Gemini API",
            description: "Work on structured JSON outputs, function calling, or multi-turn chat workflows.",
            frequency: HabitFrequency.DAILY,
            targetDuration: 25,
            status: HabitStatus.ACTIVE,
            difficulty: HabitDifficulty.HARD,
            aiGenerated: true,
            aiReasoning: "Hands-on model orchestration transforms conceptual knowledge into production competence.",
            order: 1,
          },
          {
            name: "Review & refactor TypeScript types strictly",
            description: "Ensure zero `any` types, exhaustive discrimination, and clean generic interfaces.",
            frequency: HabitFrequency.DAILY,
            targetDuration: 15,
            status: HabitStatus.ACTIVE,
            difficulty: HabitDifficulty.EASY,
            aiGenerated: true,
            aiReasoning: "Strict typing upfront prevents production runtime anomalies.",
            order: 2,
          },
        ],
      },
    },
    include: { habits: true },
  });

  // 2. HIGH PRIORITY: Fitness & Endurance
  const goalFitness = await prisma.goal.create({
    data: {
      userId: user.id,
      title: "Run a Half Marathon in 12 Weeks",
      description: "Progressive cardiovascular endurance program targeting 21.1 km with sub-2-hour pacing.",
      status: GoalStatus.IN_PROGRESS,
      priority: GoalPriority.HIGH,
      startDate: getUtcDay(75),
      aiGenerated: true,
      aiPrompt: "Train for a sub-2-hour half marathon in 12 weeks with injury prevention",
      habits: {
        create: [
          {
            name: "Morning 5K progressive tempo run",
            description: "Maintain steady zone 2-3 aerobic heart rate with cadence above 170 spm.",
            frequency: HabitFrequency.DAILY,
            targetDuration: 30,
            status: HabitStatus.ACTIVE,
            difficulty: HabitDifficulty.MEDIUM,
            aiGenerated: true,
            aiReasoning: "Daily base mileage develops mitochondrial density and aerobic threshold.",
            order: 0,
          },
          {
            name: "Post-run dynamic hip mobility & foam rolling",
            description: "Focus on IT bands, calves, hip flexors, and ankle dorsiflexion.",
            frequency: HabitFrequency.DAILY,
            targetDuration: 15,
            status: HabitStatus.ACTIVE,
            difficulty: HabitDifficulty.EASY,
            aiGenerated: true,
            aiReasoning: "Active recovery and myofascial release drastically reduces shin splints and tendonitis.",
            order: 1,
          },
          {
            name: "Hydration target: 3L filtered water daily",
            description: "Track water intake with electrolytes before and after training.",
            frequency: HabitFrequency.DAILY,
            targetDuration: 5,
            status: HabitStatus.ACTIVE,
            difficulty: HabitDifficulty.EASY,
            aiGenerated: true,
            aiReasoning: "Optimal hydration accelerates muscle recovery and cognitive stamina.",
            order: 2,
          },
          {
            name: "Strength & core stability cross-training",
            description: "Single-leg squats, planks, glute bridges, and lunges.",
            frequency: HabitFrequency.WEEKLY,
            targetCount: 3,
            targetDuration: 25,
            status: HabitStatus.ACTIVE,
            difficulty: HabitDifficulty.HARD,
            aiGenerated: true,
            aiReasoning: "Kinetic chain strength prevents biomechanical breakdown during long runs.",
            order: 3,
          },
        ],
      },
    },
    include: { habits: true },
  });

  // 3. MEDIUM PRIORITY: Focus & Mindset
  const goalDetox = await prisma.goal.create({
    data: {
      userId: user.id,
      title: "Digital Detox & Cognitive Deep Work",
      description: "Eliminate algorithmic dopamine loops, protect morning focus blocks, and read daily.",
      status: GoalStatus.IN_PROGRESS,
      priority: GoalPriority.MEDIUM,
      startDate: getUtcDay(60),
      aiGenerated: true,
      aiPrompt: "Reduce screen time, overcome phone addiction, and read physical books",
      habits: {
        create: [
          {
            name: "No screen time before 8:00 AM",
            description: "Keep phone outside bedroom in charging dock until morning routine is done.",
            frequency: HabitFrequency.DAILY,
            targetDuration: 60,
            status: HabitStatus.ACTIVE,
            difficulty: HabitDifficulty.MEDIUM,
            aiGenerated: true,
            aiReasoning: "Protecting the first hour prevents cortisol spikes and reactive mindsets.",
            order: 0,
          },
          {
            name: "Read 25 pages of non-fiction book",
            description: "Read books on systems thinking, psychology, or software architecture.",
            frequency: HabitFrequency.DAILY,
            targetDuration: 30,
            status: HabitStatus.ACTIVE,
            difficulty: HabitDifficulty.EASY,
            aiGenerated: true,
            aiReasoning: "Long-form reading rebuilds sustained attentional focus.",
            order: 1,
          },
          {
            name: "Evening reflection & next-day 3 priority plan",
            description: "Write 3 must-win tasks for tomorrow before closing work laptop.",
            frequency: HabitFrequency.DAILY,
            targetDuration: 10,
            status: HabitStatus.ACTIVE,
            difficulty: HabitDifficulty.EASY,
            aiGenerated: true,
            aiReasoning: "Pre-committing to daily priorities prevents morning cognitive fatigue.",
            order: 2,
          },
        ],
      },
    },
    include: { habits: true },
  });

  // 4. LOW PRIORITY: Finance
  const goalFinance = await prisma.goal.create({
    data: {
      userId: user.id,
      title: "Systematic Portfolio DCA & Market Analysis",
      description: "Disciplined spot analysis, risk-managed dollar-cost averaging, and macroeconomic journal.",
      status: GoalStatus.IN_PROGRESS,
      priority: GoalPriority.LOW,
      startDate: getUtcDay(45),
      aiGenerated: false,
      habits: {
        create: [
          {
            name: "Bitcoin & market liquidity metrics review",
            description: "Review funding rates, ETF net flows, and key support levels.",
            frequency: HabitFrequency.DAILY,
            targetDuration: 10,
            status: HabitStatus.ACTIVE,
            difficulty: HabitDifficulty.EASY,
            order: 0,
          },
          {
            name: "Log weekly portfolio thesis & risk management rules",
            description: "Document allocations, thesis invalidation points, and lessons learned.",
            frequency: HabitFrequency.WEEKLY,
            targetCount: 1,
            targetDuration: 20,
            status: HabitStatus.ACTIVE,
            difficulty: HabitDifficulty.MEDIUM,
            order: 1,
          },
        ],
      },
    },
    include: { habits: true },
  });

  // 5. COMPLETED STATUS: Scuba Certification
  const goalScuba = await prisma.goal.create({
    data: {
      userId: user.id,
      title: "PADI Open Water Scuba Diver Certification",
      description: "Master underwater buoyancy control, emergency protocols, and dive computer physics.",
      status: GoalStatus.COMPLETED,
      priority: GoalPriority.HIGH,
      startDate: getUtcDay(110),
      completedAt: getUtcDay(12),
      aiGenerated: true,
      habits: {
        create: [
          {
            name: "Diaphragmatic breathwork & lung capacity holds",
            frequency: HabitFrequency.DAILY,
            targetDuration: 10,
            status: HabitStatus.COMPLETED,
            difficulty: HabitDifficulty.MEDIUM,
            order: 0,
          },
          {
            name: "Dive gear assembly & regulator safety drills",
            frequency: HabitFrequency.WEEKLY,
            targetCount: 2,
            targetDuration: 45,
            status: HabitStatus.COMPLETED,
            difficulty: HabitDifficulty.HARD,
            order: 1,
          },
        ],
      },
    },
    include: { habits: true },
  });

  // 6. ON_HOLD STATUS: Language Learning (with PAUSED habits)
  await prisma.goal.create({
    data: {
      userId: user.id,
      title: "Conversational Spanish Fluency (B2)",
      description: "Temporarily paused while prioritizing high-intensity engineering deadlines.",
      status: GoalStatus.ON_HOLD,
      priority: GoalPriority.LOW,
      startDate: getUtcDay(120),
      aiGenerated: false,
      habits: {
        create: [
          {
            name: "15-min conversational audio drills",
            frequency: HabitFrequency.DAILY,
            targetDuration: 15,
            status: HabitStatus.PAUSED,
            difficulty: HabitDifficulty.MEDIUM,
            order: 0,
          },
          {
            name: "Anki spaced-repetition vocabulary review (30 cards)",
            frequency: HabitFrequency.DAILY,
            targetDuration: 10,
            status: HabitStatus.PAUSED,
            difficulty: HabitDifficulty.EASY,
            order: 1,
          },
        ],
      },
    },
  });

  console.log("📊 Generating 100-day realistic activity logs for consistency heatmap...");

  // Primary habits to generate logs for:
  const activeHabits = [
    ...goalAi.habits,
    ...goalFitness.habits.slice(0, 3), // daily ones
    ...goalDetox.habits.slice(0, 2),
    ...goalFinance.habits.slice(0, 1),
    ...goalScuba.habits,
  ];

  const logEntries: { habitId: string; date: Date; completed: boolean }[] = [];

  // Generate logs over the past 100 days
  // Days 0..18 (Last ~19 days): UNBROKEN active streak for top habits!
  // Days 19..75: 5-6 active days per week with vibrant density (varying between 2 to 5 completions per day)
  // Days 76..100: Moderate ramp-up (2-3 completions per day)

  const habitAiCoding = goalAi.habits[0].id;
  const habitAiFeature = goalAi.habits[1].id;
  const habitAiTypes = goalAi.habits[2].id;
  const habitRunning = goalFitness.habits[0].id;
  const habitMobility = goalFitness.habits[1].id;
  const habitHydration = goalFitness.habits[2].id;
  const habitNoScreen = goalDetox.habits[0].id;
  const habitReading = goalDetox.habits[1].id;
  const habitBtc = goalFinance.habits[0].id;
  const habitScuba1 = goalScuba.habits[0].id;

  for (let daysAgo = 100; daysAgo >= 0; daysAgo--) {
    const date = getUtcDay(daysAgo);

    if (daysAgo <= 18) {
      // Current active uninterrupted streak!
      // Top habits are completed every single day:
      logEntries.push({ habitId: habitAiCoding, date, completed: true });
      logEntries.push({ habitId: habitRunning, date, completed: true });
      logEntries.push({ habitId: habitHydration, date, completed: true });

      // Sub-habits completed on most days:
      if (daysAgo % 7 !== 0) {
        logEntries.push({ habitId: habitAiFeature, date, completed: true });
        logEntries.push({ habitId: habitReading, date, completed: true });
      }
      if (daysAgo % 3 !== 0) {
        logEntries.push({ habitId: habitAiTypes, date, completed: true });
        logEntries.push({ habitId: habitMobility, date, completed: true });
        logEntries.push({ habitId: habitNoScreen, date, completed: true });
      }
      if (daysAgo % 2 === 0) {
        logEntries.push({ habitId: habitBtc, date, completed: true });
      }
    } else if (daysAgo <= 75) {
      // Vibrant historical activity (5-6 days per week)
      const dayOfWeek = date.getUTCDay(); // 0=Sun, 6=Sat
      const isRestDay = dayOfWeek === 0 && daysAgo % 2 === 0;

      if (!isRestDay) {
        logEntries.push({ habitId: habitAiCoding, date, completed: true });
        logEntries.push({ habitId: habitHydration, date, completed: true });

        if (dayOfWeek !== 6) {
          logEntries.push({ habitId: habitRunning, date, completed: true });
          logEntries.push({ habitId: habitReading, date, completed: true });
        }
        if (daysAgo % 2 === 1) {
          logEntries.push({ habitId: habitAiFeature, date, completed: true });
          logEntries.push({ habitId: habitNoScreen, date, completed: true });
        }
        if (daysAgo % 3 === 1) {
          logEntries.push({ habitId: habitAiTypes, date, completed: true });
          logEntries.push({ habitId: habitMobility, date, completed: true });
          logEntries.push({ habitId: habitBtc, date, completed: true });
        }
      }
    } else {
      // Days 76..100: Scuba prep + initial ramp up
      if (daysAgo % 2 === 0) {
        logEntries.push({ habitId: habitScuba1, date, completed: true });
        logEntries.push({ habitId: habitAiCoding, date, completed: true });
        logEntries.push({ habitId: habitHydration, date, completed: true });
      }
      if (daysAgo % 3 === 0) {
        logEntries.push({ habitId: habitRunning, date, completed: true });
        logEntries.push({ habitId: habitReading, date, completed: true });
      }
    }
  }

  // Insert habit logs in chunks
  console.log(`Inserting ${logEntries.length} habit logs into database...`);
  const chunkSize = 100;
  for (let i = 0; i < logEntries.length; i += chunkSize) {
    const chunk = logEntries.slice(i, i + chunkSize);
    await prisma.habitLog.createMany({
      data: chunk,
      skipDuplicates: true,
    });
  }

  console.log("\n=========================================");
  console.log("🎉 Seeding completed successfully!");
  console.log(`User: ${user.email}`);
  console.log("Goals created: 6 (CRITICAL, HIGH, MEDIUM, LOW, COMPLETED, ON_HOLD)");

  console.log(`Total Habit Logs: ${logEntries.length} across past 100 days`);
  console.log("Current Streak: ~19 days active");
  console.log("=========================================\n");
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
