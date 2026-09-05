# Database & Data Integrity

Guidelines for database access, Prisma ORM, and mutation handling in Routini.

## Client & Connection

- Import the Prisma client exclusively from `@/lib/db`. Never instantiate `new PrismaClient()` in actions or route handlers.

## Data Normalization & Integrity

- **Date Normalization:** For habit check-ins, logs, and streak calculations, normalize dates (UTC / `@db.Date`) to prevent client timezone drift.
- **Transactions:** Use explicit Prisma transactions (`db.$transaction`) or cascading operations when mutating parent-child entities (e.g., Goals and associated Habits/Logs).

## Cache Revalidation

- After any mutation (create, update, delete), call `revalidatePath` or `revalidateTag` for affected routes to ensure the UI stays synchronized with database state.
