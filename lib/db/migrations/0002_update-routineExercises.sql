ALTER TABLE "routine_exercises" ALTER COLUMN "weight" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "routine_exercises" DROP COLUMN "rep_range_min";--> statement-breakpoint
ALTER TABLE "routine_exercises" DROP COLUMN "rep_range_max";--> statement-breakpoint
ALTER TABLE "routine_exercises" DROP COLUMN "rest_time";--> statement-breakpoint
ALTER TABLE "routine_exercises" DROP COLUMN "notes";