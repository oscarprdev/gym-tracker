-- Migration: Refactor routine-workout relationship from one-to-many to many-to-many
-- Date: 2025-01-09
-- Description: Create junction table, add user_id to workouts, migrate existing data, remove routine_id from workouts

BEGIN;

-- Step 1: Create routines_workouts junction table
CREATE TABLE routines_workouts (
  routine_id UUID NOT NULL REFERENCES routines(id) ON DELETE CASCADE,
  workout_id UUID NOT NULL REFERENCES workouts(id) ON DELETE CASCADE,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  PRIMARY KEY (routine_id, workout_id)
);

-- Step 2: Add user_id column to workouts table (nullable first)
ALTER TABLE workouts 
ADD COLUMN user_id TEXT;

-- Step 3: Populate user_id from routine relationships
UPDATE workouts 
SET user_id = (
  SELECT r.user_id 
  FROM routines r 
  WHERE r.id = workouts.routine_id
);

-- Step 4: Migrate existing routine-workout relationships to junction table
INSERT INTO routines_workouts (routine_id, workout_id, created_at)
SELECT routine_id, id, created_at
FROM workouts 
WHERE routine_id IS NOT NULL;

-- Step 5: Make user_id NOT NULL and add foreign key constraint
ALTER TABLE workouts 
ALTER COLUMN user_id SET NOT NULL;

ALTER TABLE workouts 
ADD CONSTRAINT workouts_user_id_users_id_fk 
FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;

-- Step 6: Remove routine_id column and its constraints
ALTER TABLE workouts 
DROP CONSTRAINT workouts_routine_id_routines_id_fk;

ALTER TABLE workouts 
DROP COLUMN routine_id;

-- Step 7: Remove order column as workouts can now belong to multiple routines
ALTER TABLE workouts 
DROP COLUMN "order";

-- Step 8: Create indexes for better performance
CREATE INDEX idx_routines_workouts_routine_id ON routines_workouts(routine_id);
CREATE INDEX idx_routines_workouts_workout_id ON routines_workouts(workout_id);
CREATE INDEX idx_workouts_user_id ON workouts(user_id);

COMMIT;