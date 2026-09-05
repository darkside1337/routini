# Routini

Routini is an AI-powered goal breakdown and habit-tracking web app built with Next.js App Router, Prisma ORM, and Tailwind CSS.

## Tooling & Commands

- **Package Manager:** Use `pnpm` exclusively (never `npm`, `yarn`, or `bun`).
- **Development:** `pnpm dev`
- **Typecheck:** `pnpm tsc --noEmit`
- **Lint:** `pnpm lint`
- **Prisma Generate:** `pnpm prisma generate` (run after updating `prisma/schema.prisma`)

## Critical Invariants

- **Database Safety:** Never run destructive database commands (such as `prisma migrate reset` or manual table drops) without explicit user confirmation.

## Progressive Disclosure

Refer to these guides when working in their respective areas:

- Architecture & Server Actions: [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)
- Database & Data Integrity: [docs/DATABASE.md](docs/DATABASE.md)
- AI Habit Generation Flow: [docs/AI_GENERATION.md](docs/AI_GENERATION.md)
- Product Requirements: [docs/PRD.md](docs/PRD.md)
- UI & Design System: [docs/DESIGN.md](docs/DESIGN.md)
