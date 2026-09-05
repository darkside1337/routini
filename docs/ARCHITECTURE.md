# Architecture & Conventions

Guidelines for application structure, component boundaries, and server actions in Routini.

## Component Boundaries

- **Default to React Server Components (RSC):** Use RSC for data fetching, static layouts, and page shells.
- **Client Components (`'use client'`):** Keep client components as leaves at the edges of the component tree. Only use `'use client'` when state (`useState`), effects (`useEffect`), transitions (`useTransition`), browser APIs, or event handlers are required.

## Server Actions & Data Mutations

- **Location:** Place actions in `@/actions/` or alongside route modules with `'use server'`.
- **Validation:** Always validate input arguments using Zod schemas before database queries or mutations.
- **Return Type:** Return typed response structures (e.g., `{ success: boolean; data?: T; error?: string }`).
- **Session Verification:** Authenticate requests server-side inside the action (e.g., using Better-Auth `auth.api.getSession()`). Never trust a client-supplied `userId`.
- **User Scoping:** Scope every query to the authenticated user (e.g., `where: { userId: session.user.id }`) to prevent IDOR vulnerabilities.

## Code Conventions

- **Path Aliases:** Use `@/*` imports (e.g., `@/components/...`, `@/lib/...`, `@/actions/...`, `@/hooks/...`, `@/types/...`).
- **Naming Conventions:**
  - Files and directories: `kebab-case` (e.g., `goal-card.tsx`, `habit-actions.ts`).
  - React components: `PascalCase` (e.g., `GoalCard`, `DashboardHeader`).
  - Functions and variables: `camelCase`.
  - Types and interfaces: `PascalCase` (e.g., `GoalWithHabits`, `ActionResponse<T>`).
