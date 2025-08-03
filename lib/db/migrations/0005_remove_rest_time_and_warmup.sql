-- Remove rest_time and is_warmup columns from workout_exercise_sets table
ALTER TABLE workout_exercise_sets DROP COLUMN IF EXISTS rest_time;
ALTER TABLE workout_exercise_sets DROP COLUMN IF EXISTS is_warmup; 