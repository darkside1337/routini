-- AlterTable
ALTER TABLE "UserPreferences" ADD COLUMN IF NOT EXISTS "hasCompletedOnboarding" BOOLEAN NOT NULL DEFAULT false;

-- DropTable
DROP TABLE IF EXISTS "Milestone" CASCADE;
