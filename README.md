# 🚀 Routini

> **Turn high-level ambitions into bite-sized, sustainable daily habits in seconds.**

Routini is an AI-powered goal decomposition and habit-tracking platform built to eliminate the cognitive friction and blank-canvas paralysis of designing sustainable routines. Instead of manually architecting habits and schedules from scratch, users provide a high-level goal (e.g. *"Learn TypeScript"*, *"Run a 5K"*, *"Improve deep work"*), and Routini generates a structured, actionable daily routine through an interactive lock-and-reroll curation board.

---

## ✨ Features

### 🤖 AI Goal Decomposition
Powered by Google Gemini (`@google/genai`), Routini decomposes big ambitions into 3–5 realistic daily habits through an interactive curation board — pin the suggestions you love, and re-roll the rest until the routine fits your life.

<video src="public/assets/demo/demo-ai-goal-creation.mp4" width="100%" autoplay loop muted playsinline></video>


https://github.com/user-attachments/assets/14c22ec1-f205-486b-b15b-5e70c40d4423


### 👋 Frictionless Onboarding
A zero-friction starter flow gets new users from first sign-in to their first active routine in seconds with curated goal templates and instant prefill.

<video src="public/assets/demo/demo-onboarding.mp4" width="100%" autoplay loop muted playsinline></video>


https://github.com/user-attachments/assets/b24a5446-858f-4c89-84dc-74b40ca39ab3


### 📊 Daily Habit Tracking & Optimistic UI
Track daily habits with zero-latency optimistic updates, animated completion progress bars, and instant status filtering (`In Progress`, `Completed`, `All`).

<video src="public/assets/demo/demo-daily-tracking.mp4" width="100%" autoplay loop muted playsinline></video>


https://github.com/user-attachments/assets/232d3748-bd5d-4c2b-9af8-2583109231ca


### 🔥 Consistency Heatmap & Streaks
Visualize long-term momentum with a GitHub-style 365-day consistency calendar, active milestone streaks, and detailed completion breakdowns per habit.

<video src="public/assets/demo/demo-progress-heatmap.mp4" width="100%" autoplay loop muted playsinline></video>


https://github.com/user-attachments/assets/a0605be3-33de-4f71-8a5b-e2cb22328b8c


### ✏️ Goal & Habit Management
Full routine lifecycle control: pause individual habits without breaking streak history, edit schedules and difficulty tiers, or archive completed goals.

<video src="public/assets/demo/demo-edit-goal.mp4" width="100%" autoplay loop muted playsinline></video>


https://github.com/user-attachments/assets/d49e14ce-71a5-4a1f-a8a9-054df0df401f


### 📱 Mobile & Responsive Layout
Built mobile-first with adaptive layouts that transition cleanly from desktop widescreen dashboards to compact mobile viewports with native touch targets and bottom navigation.

<video src="public/assets/demo/demo-responsive-design.mp4" width="100%" autoplay loop muted playsinline></video>


https://github.com/user-attachments/assets/f50416f0-7389-49b4-b449-f8831dec38e8


---

### More at a Glance

- **⚡ Two-Stage Modal Flow**: Minimal-friction creation modal with contextual skeleton loading states and keyboard shortcuts (`Enter`, `Esc`, `Space`).
- **🔐 Secure Authentication**: Integrated with [Better-Auth](https://better-auth.com/), supporting Google and GitHub OAuth with automated account linking.
- **🌓 Dark & Light Mode**: Seamless theme switching with persistent preferences and Tailwind CSS v4 styling.

---

## 🛠️ Tech Stack

| Layer | Technology |
| :--- | :--- |
| **Framework** | [Next.js](https://nextjs.org/) (App Router, React 19, Server Components) |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com/) + `shadcn/ui` + [Radix UI](https://www.radix-ui.com/) |
| **Icons & UI** | [Lucide React](https://lucide.dev/), [Sonner](https://sonner.emilkowal.ski/) (Toasts), `tw-animate-css` |
| **Database & ORM** | [PostgreSQL](https://www.postgresql.org/) (Neon-compatible) with [Prisma ORM v7](https://www.prisma.io/) |
| **Authentication** | [Better-Auth](https://better-auth.com/) (Google & GitHub OAuth) |
| **AI Integration** | [Google Gen AI SDK](https://github.com/google/generative-ai-js) (`@google/genai`) |
| **Validation** | [Zod](https://zod.dev/) |
| **Package Manager** | `pnpm` exclusively |

---

## 📁 Project Structure

```text
routini/
├── actions/                  # Server actions (habit generation, goal actions, progress)
├── app/
│   ├── (protected)/          # Authenticated routes (dashboard, progress, layout)
│   ├── (public)/auth/        # Public auth routes (sign-in, sign-up)
│   ├── api/auth/[...all]/    # Better-Auth route handler
│   ├── globals.css           # Tailwind v4 theme variables & styles
│   ├── layout.tsx            # Root layout with ThemeProvider & Sonner Toaster
│   └── page.tsx              # Marketing landing page
├── components/
│   ├── auth/                 # Sign-in & sign-up forms and hero banners
│   ├── create-goal-modal/    # Goal input and habit lock/re-roll review board
│   ├── dashboard/            # Goal cards, filters, header, and goal lists
│   ├── landing/              # Landing page marketing sections
│   ├── navigation/           # Sidebar, bottom nav, and account dropdown
│   ├── onboarding/           # Onboarding dialogue & starter goal presets
│   ├── progress/             # Heatmap activity calendar & streak analytics
│   └── ui/                   # Reusable shadcn / Radix primitives
├── docs/                     # Product requirements (PRD.md), design system (DESIGN.md), architecture
├── lib/
│   ├── ai/                   # Gemini client initialization and prompt templates
│   ├── auth.ts               # Better-Auth server configuration
│   ├── auth-client.ts        # Better-Auth client instance
│   ├── db.ts                 # Prisma singleton instance
│   └── utils.ts              # Styling utilities (cn helper)
├── prisma/
│   ├── schema.prisma         # Database schema models (Goal, Habit, HabitLog, etc.)
│   └── seed.ts               # Demo data seeder with 100-day heatmap activity
└── types/                    # Shared TypeScript interfaces and domain types
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 20.x or higher
- **pnpm** 9.x or higher (`npm install -g pnpm`)
- A **PostgreSQL** database (e.g. [Neon](https://neon.tech/))
- A **Google Gemini API key** ([Google AI Studio](https://aistudio.google.com/))

### 1. Clone & Install

```bash
git clone https://github.com/your-username/routini.git
cd routini
pnpm install
```

### 2. Configure Environment Variables

Create a `.env` file in the root directory by copying the example:

```bash
cp .env.example .env
```

Fill in the required variables:

| Variable | Description | Example / Default |
| :--- | :--- | :--- |
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@ep-xyz.neon.tech/routini?sslmode=require` |
| `BETTER_AUTH_SECRET` | 32-character secret key for signing auth tokens | Generate with `openssl rand -base64 32` |
| `BETTER_AUTH_URL` | Base URL of the authentication server | `http://localhost:3001` |
| `NEXT_PUBLIC_APP_URL`| Public canonical URL of the application | `http://localhost:3001` |
| `GEMINI_API_KEY` | Google Gemini API Key for habit generation | `AIzaSy...` |
| `GOOGLE_CLIENT_ID` | *(Optional)* Google OAuth client ID | |
| `GOOGLE_CLIENT_SECRET` | *(Optional)* Google OAuth client secret | |
| `GITHUB_CLIENT_ID` | *(Optional)* GitHub OAuth application client ID | |
| `GITHUB_CLIENT_SECRET` | *(Optional)* GitHub OAuth application client secret | |

### 3. Initialize the Database

Generate the Prisma Client, push schema tables, and optionally seed rich demo data:

```bash
pnpm prisma generate
pnpm prisma db push
pnpm db:seed      # Optional: Populates sample goals, active streaks, and 100-day heatmap logs
```

### 4. Run the Development Server

```bash
pnpm dev
```

Open [http://localhost:3001](http://localhost:3001) in your browser.

---

## 📜 Available Scripts

| Script | Command | Purpose |
| :--- | :--- | :--- |
| **Development** | `pnpm dev` | Starts Next.js dev server on port 3001 with hot reloading |
| **Database Seed** | `pnpm db:seed` | Populates goals, streaks, and 100-day heatmap history |
| **Type Check** | `pnpm tsc --noEmit` | Runs TypeScript compiler check without emitting output |
| **Lint** | `pnpm lint` | Runs ESLint across all codebase files |
| **Build** | `pnpm build` | Compiles optimized production bundle |
| **Start** | `pnpm start` | Runs the compiled production application |
| **Prisma Generate** | `pnpm prisma generate` | Regenerates Prisma Client types |
| **Prisma Studio** | `pnpm prisma studio` | Visual database browser on `localhost:5555` |

---

## 🔒 Development Agreements

- **Package Manager**: Use `pnpm` exclusively (never `npm`, `yarn`, or `bun`).
- **Server Actions**: Every action must check sessions server-side (`auth.api.getSession()`), validate arguments with Zod, and scope queries to the authenticated user ID.
- **Verification**: Run `pnpm tsc --noEmit` and `pnpm lint` before pushing changes.
- **Conventions**: Detailed design specifications are located in [`docs/DESIGN.md`](./docs/DESIGN.md) and feature scope in [`docs/PRD.md`](./docs/PRD.md).

---

## 📄 License

This project is licensed under the MIT License.
