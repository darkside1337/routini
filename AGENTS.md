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

## UI & Design Conventions

- **Mobile-First Design:** Always build and style components mobile-first:
  - Base Tailwind classes must target small mobile screens (320px–420px) without cramped padding, accidental horizontal overflow, or rigid fixed heights.
  - Progressive enhancement: layer `sm:`, `md:`, and `lg:` for tablet and desktop viewports.
  - Form dialogs and cards must use responsive padding (`p-4 sm:p-6`), wrap long text (`break-words`), use `min-w-0` on flex items, and support responsive minimum heights (`min-h-[...] sm:min-h-[...]`).
  - Touch targets for interactive elements (buttons, dropdowns, inputs, checkboxes) must be comfortable on touch devices (at least 36px–40px).

## Progressive Disclosure

Refer to these guides when working in their respective areas:

- Architecture & Server Actions: [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)
- Database & Data Integrity: [docs/DATABASE.md](docs/DATABASE.md)
- AI Habit Generation Flow: [docs/AI_GENERATION.md](docs/AI_GENERATION.md)
- Product Requirements: [docs/PRD.md](docs/PRD.md)
- UI & Design System: [docs/DESIGN.md](docs/DESIGN.md)
