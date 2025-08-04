DROP TABLE "exercise_logs" CASCADE;--> statement-breakpoint
DROP TABLE "set_logs" CASCADE;--> statement-breakpoint
ALTER TABLE "exercises" DROP COLUMN "is_custom";--> statement-breakpoint
ALTER TABLE "routines" DROP COLUMN "is_template";--> statement-breakpoint
ALTER TABLE "routines" DROP COLUMN "estimated_duration";--> statement-breakpoint
ALTER TABLE "workout_exercises" DROP COLUMN "notes";--> statement-breakpoint
ALTER TABLE "workouts" DROP COLUMN "estimated_duration";--> statement-breakpoint
ALTER TABLE "workout_sessions" DROP COLUMN "started_at";--> statement-breakpoint
ALTER TABLE "workout_sessions" DROP COLUMN "completed_at";--> statement-breakpoint
ALTER TABLE "workout_sessions" DROP COLUMN "duration";--> statement-breakpoint
ALTER TABLE "workout_sessions" DROP COLUMN "notes";