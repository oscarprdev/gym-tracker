-- Migration: Add routine_exercise_sets table and update routine_exercises
-- This migration separates sets into their own table to allow individual set configuration

-- Create the new routine_exercise_sets table
CREATE TABLE IF NOT EXISTS "routine_exercise_sets" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "routine_exercise_id" uuid NOT NULL REFERENCES "routine_exercises"("id") ON DELETE CASCADE,
  "set_number" integer NOT NULL,
  "reps" integer,
  "weight" integer NOT NULL DEFAULT 0,
  "created_at" timestamp DEFAULT now() NOT NULL
);

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS "routine_exercise_sets_routine_exercise_id_idx" ON "routine_exercise_sets"("routine_exercise_id");
CREATE INDEX IF NOT EXISTS "routine_exercise_sets_set_number_idx" ON "routine_exercise_sets"("set_number");

-- Remove the old columns from routine_exercises table
ALTER TABLE "routine_exercises" DROP COLUMN IF EXISTS "sets";
ALTER TABLE "routine_exercises" DROP COLUMN IF EXISTS "reps";
ALTER TABLE "routine_exercises" DROP COLUMN IF EXISTS "weight";

-- Add notes column to routine_exercises if it doesn't exist
ALTER TABLE "routine_exercises" ADD COLUMN IF NOT EXISTS "notes" text; 