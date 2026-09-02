# Antigravity AI Agent Rules - Routini

## 1. Tech Stack & Environment

- **Framework:** Next.js (App Router, React 19, React Server Components by default).
- **Package Manager:** `pnpm` exclusively (never use `npm`, `yarn`, or `bun`).
- **Styling:** Tailwind CSS v4 + `shadcn/ui` / Radix UI components + `tw-animate-css`.
- **Design Approach:** Mobile‑first using Tailwind CSS utilities (build for small screens first, then scale up).
- **Theming & Feedback:** `next-themes` (Dark/Light mode) and `sonner` for toast notifications.
- **Database:** PostgreSQL with Prisma ORM v7 (Client generated at `@/lib/generated/prisma`, instantiated in `@/lib/db.ts`).
- **Authentication:** Better-Auth (`@/lib/auth.ts` on server, `@/lib/auth-client.ts` on client).
- **Validation:** Zod schemas for all forms, actions, and API payloads.
- **Icons:** `lucide-react` (primary) and `react-icons` when necessary.
- **Language:** TypeScript in strict mode (no `any`, explicit return types for actions and utilities).

---

## 2. Code Quality & Mandatory Verification

- **Type Checking:** Run `pnpm tsc --noEmit` after significant edits, refactors, or new files to guarantee zero type errors.
- **Build & Lint Verification:** Ensure `pnpm lint` passes without introducing new errors or warnings.
- **Prisma Synchronization:** Whenever `prisma/schema.prisma` is updated, immediately run `pnpm prisma generate` to sync `@/lib/generated/prisma`.
- **Zero Residual Breakages:** Never leave broken imports, unhandled Promise rejections, or type mismatches before concluding a task.

---

## 3. Architecture & Code Conventions

- **Server vs Client Components:**
  - Default to **React Server Components (RSC)** for data fetching, layouts, and static UI.
  - Use `'use client'` strictly when using React hooks (`useState`, `useEffect`, `useTransition`), browser APIs, or interactive event listeners.
  - Keep client components as leaves at the edge of the component tree to maximize server rendering.
- **Imports & Aliasing:**
  - Always use path aliases: `@/components/...`, `@/lib/...`, `@/actions/...`, `@/hooks/...`, `@/types/...`, `@/app/...`.
  - Import the database client from `@/lib/db` (never instantiate `new PrismaClient()` directly in routes/actions).
- **Mutations & Server Actions:**
  - Place server actions inside `@/actions/` or alongside route modules with `'use server'`.
  - Validate all input data using Zod before querying or writing to the database.
  - Return typed error/success structures (e.g. `{ success: boolean; data?: T; error?: string }`) for clean consumption by UI components.
  - **Auth Boundaries:**
    - Always verify the session server-side inside the action itself (`auth.api.getSession()` or equivalent) — never trust a client-passed `userId` or rely solely on middleware.
    - Scope every database query to the authenticated user's own records (e.g. `where: { userId: session.user.id }`) to prevent IDOR-style access to other users' goals/habits.
- **Naming Conventions:**
  - Files and directories: `kebab-case` (e.g., `goal-card.tsx`, `habit-actions.ts`).
  - React components: `PascalCase` (e.g., `GoalCard`, `DashboardHeader`).
  - Functions, utilities, and variables: `camelCase`.
  - Types and Interfaces: `PascalCase` with descriptive names (e.g., `GoalWithHabits`, `ActionResponse<T>`).

---

## 4. Database Safety & Data Integrity

- **Non-Destructive Operations:** Never run destructive commands like `pnpm prisma migrate reset` or drop tables without explicit user confirmation.
- **Date & Time Normalization:** For habit check-ins, streaks, and date-based logs, ensure dates are normalized (UTC / `@db.Date`) to prevent client timezone drift.
- **Relational Integrity:** Use Prisma cascade deletes or explicit transaction blocks (`db.$transaction`) when mutating parent-child relationships (e.g., Goals and associated Habits/Logs).
- **Cache Revalidation:** After any mutation (create/update/delete), explicitly call `revalidatePath` or `revalidateTag` for affected routes. Never assume the UI will reflect a mutation without it.

---

## 5. UI/UX, Accessibility & Aesthetics

- **Design Standard:** Deliver modern, polished, and accessible UI with subtle micro-interactions, clean hover states, and smooth transitions.
- **Accessibility:** Use semantic HTML tags (`<main>`, `<nav>`, `<article>`, `<header>`), correct ARIA attributes for dynamic elements, and keyboard-accessible modal/dialog patterns.
- **Toasts & Feedback:** Use `sonner` toasts (`toast.success`, `toast.error`, `toast.promise`) to give immediate visual feedback on user mutations.
- **Clean Code:** Write self-documenting code with clear variable and function names. Avoid redundant or obvious comments.

---

## 6. Secrets & Environment Variables

- **No Hardcoding:** Never hardcode API keys, database URLs, or auth secrets. Always reference via `process.env.VAR_NAME`.
- **Validation:** Validate required env vars at startup (e.g. via a typed `@/lib/env.ts` using Zod) so missing config fails fast instead of surfacing as a runtime error deep in a server action.
- **No Logging Secrets:** Never `console.log` full env values, session tokens, or API keys — even in development.

---

## 7. AI Generation (Habit Creation)

- **Timeouts:** All LLM calls in `generateHabits`/`regenerateHabits` must have an explicit timeout and fail gracefully into the typed `{ success: false, error }` shape — never let a hung request leave the UI stuck on a loading state indefinitely.
- **Failure States:** Every AI-generation UI flow must implement a visible error/retry state, not just success and loading. Do not skip this when implementing modals or review screens.
- **Rate Limiting:** Guard generation/regeneration actions against rapid repeated calls per user (e.g. simple in-memory or DB-backed throttle) to control LLM cost.
- **Output Validation:** Validate LLM output against a Zod schema before it reaches the UI — never pass raw LLM JSON directly to the database or UI state.
