DROP TABLE "exercises" CASCADE;--> statement-breakpoint
DROP TABLE "routines" CASCADE;--> statement-breakpoint
DROP TABLE "weekly_schedule" CASCADE;--> statement-breakpoint
DROP TABLE "workout_exercise_sets" CASCADE;--> statement-breakpoint
DROP TABLE "workout_exercises" CASCADE;--> statement-breakpoint
DROP TABLE "workouts" CASCADE;--> statement-breakpoint
DROP TABLE "workout_sessions" CASCADE;--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "routine_assigned";