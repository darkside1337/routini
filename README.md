# 🚀 Routini

> **Turn high-level ambitions into bite-sized, sustainable daily habits in seconds.**

Routini is an AI-powered goal decomposition and habit-tracking platform designed to eliminate the cognitive friction and blank-canvas paralysis of building sustainable routines. Instead of struggling to manually architect habits and schedules from scratch, users provide high-level goals (e.g. *"Learn TypeScript"*, *"Run a 5K"*, *"Improve deep work"*), and Routini generates structured, actionable daily routines with an interactive lock-and-reroll curation board.

---

## ✨ Features

- **🤖 AI Goal Decomposition**: Powered by Google Gemini (`@google/genai`), decomposing big ambitions into 3–5 realistic daily habits.
- **🔒 Interactive Lock & Re-roll Board**: Pin and lock habit suggestions you love, re-roll the rest until the routine fits your life perfectly.
- **⚡ Two-Stage Modal Flow**: Minimal-friction creation modal with contextual loading states and keyboard shortcuts.
- **📊 Modern Dashboard**: Track daily habits, monitor streaks, filter goals by status, and visualize progress.
- **🔐 Secure Authentication**: Integrated with [Better-Auth](https://better-auth.com/) supporting email/password as well as Google and GitHub OAuth.
- **🌓 Dark & Light Mode**: Seamless theme switching with persistent preferences and Tailwind CSS v4 styling.

---

## 🛠️ Tech Stack

| Layer | Technology |
| :--- | :--- |
| **Framework** | [Next.js](https://nextjs.org/) (App Router, React 19, Server Components) |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com/) + `shadcn/ui` + [Radix UI](https://www.radix-ui.com/) |
| **Icons & UI** | [Lucide React](https://lucide.dev/), [Sonner](https://sonner.emilkowal.ski/) (Toasts), `tw-animate-css` |
| **Database & ORM** | [PostgreSQL](https://www.postgresql.org/) (Neon-compatible) with [Prisma ORM v7](https://www.prisma.io/) |
| **Authentication** | [Better-Auth](https://better-auth.com/) |
| **AI Integration** | [Google Gen AI SDK](https://github.com/google/generative-ai-js) (`@google/genai`) |
| **Validation** | [Zod](https://zod.dev/) |
| **Package Manager** | `pnpm` exclusively |

---

## 📁 Project Structure

```text
routini/
├── actions/                  # Server actions (habit generation, goal actions)
├── app/
│   ├── (protected)/          # Authenticated routes (dashboard, layout, bottom-bar)
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
│   └── ui/                   # Reusable shadcn / Radix primitives
├── docs/                     # Product requirements (PRD.md) & design system (DESIGN.md)
├── lib/
│   ├── ai/                   # Gemini client initialization and prompt templates
│   ├── auth.ts               # Better-Auth server configuration
│   ├── auth-client.ts        # Better-Auth client instance
│   ├── db.ts                 # Prisma singleton instance
│   └── utils.ts              # Styling utilities (cn helper)
├── prisma/
│   └── schema.prisma         # Database schema models (Goal, Habit, HabitLog, etc.)
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
| `BETTER_AUTH_URL` | Base URL of the authentication server | `http://localhost:3000` |
| `NEXT_PUBLIC_APP_URL`| Public canonical URL of the application | `http://localhost:3000` |
| `GEMINI_API_KEY` | Google Gemini API Key for habit generation | `AIzaSy...` |
| `GOOGLE_CLIENT_ID` | *(Optional)* Google OAuth client ID | |
| `GOOGLE_CLIENT_SECRET` | *(Optional)* Google OAuth client secret | |
| `GITHUB_CLIENT_ID` | *(Optional)* GitHub OAuth application client ID | |
| `GITHUB_CLIENT_SECRET` | *(Optional)* GitHub OAuth application client secret | |

### 3. Initialize the Database

Generate the Prisma Client and apply migrations:

```bash
pnpm prisma generate
pnpm prisma db push
```

### 4. Run the Development Server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📜 Available Scripts

| Script | Command | Purpose |
| :--- | :--- | :--- |
| **Development** | `pnpm dev` | Starts Next.js development server with hot reloading |
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
