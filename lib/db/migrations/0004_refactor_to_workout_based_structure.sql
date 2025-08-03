-- Migration: Refactor to workout-based structure
-- This migration implements the new business logic where routines contain workouts

-- Create new workouts table
CREATE TABLE IF NOT EXISTS "workouts" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "routine_id" uuid NOT NULL REFERENCES "routines"("id") ON DELETE CASCADE,
  "name" text NOT NULL,
  "description" text,
  "day_of_week" integer,
  "order" integer NOT NULL,
  "estimated_duration" integer,
  "created_at" timestamp DEFAULT now() NOT NULL,
  "updated_at" timestamp DEFAULT now() NOT NULL
);

-- Create new workout_exercises table
CREATE TABLE IF NOT EXISTS "workout_exercises" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "workout_id" uuid NOT NULL REFERENCES "workouts"("id") ON DELETE CASCADE,
  "exercise_id" uuid NOT NULL REFERENCES "exercises"("id") ON DELETE CASCADE,
  "order" integer NOT NULL,
  "notes" text,
  "created_at" timestamp DEFAULT now() NOT NULL
);

-- Create new workout_exercise_sets table
CREATE TABLE IF NOT EXISTS "workout_exercise_sets" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "workout_exercise_id" uuid NOT NULL REFERENCES "workout_exercises"("id") ON DELETE CASCADE,
  "set_number" integer NOT NULL,
  "reps" integer,
  "weight" integer NOT NULL DEFAULT 0,
  "rest_time" integer,
  "is_warmup" boolean DEFAULT false,
  "created_at" timestamp DEFAULT now() NOT NULL
);

-- Add workout_id column to workout_sessions table
ALTER TABLE "workout_sessions" ADD COLUMN IF NOT EXISTS "workout_id" uuid REFERENCES "workouts"("id") ON DELETE SET NULL;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS "workouts_routine_id_idx" ON "workouts"("routine_id");
CREATE INDEX IF NOT EXISTS "workouts_order_idx" ON "workouts"("order");
CREATE INDEX IF NOT EXISTS "workout_exercises_workout_id_idx" ON "workout_exercises"("workout_id");
CREATE INDEX IF NOT EXISTS "workout_exercises_order_idx" ON "workout_exercises"("order");
CREATE INDEX IF NOT EXISTS "workout_exercise_sets_workout_exercise_id_idx" ON "workout_exercise_sets"("workout_exercise_id");
CREATE INDEX IF NOT EXISTS "workout_sessions_workout_id_idx" ON "workout_sessions"("workout_id");

-- Add constraint to ensure workouts are limited to 7 per routine
ALTER TABLE "workouts" ADD CONSTRAINT "workouts_routine_limit" CHECK (
  (SELECT COUNT(*) FROM "workouts" w2 WHERE w2.routine_id = workouts.routine_id) <= 7
);

-- Add constraint to ensure workout exercises have at least one set
ALTER TABLE "workout_exercises" ADD CONSTRAINT "workout_exercises_require_sets" CHECK (
  EXISTS (SELECT 1 FROM "workout_exercise_sets" WHERE workout_exercise_id = workout_exercises.id)
); 