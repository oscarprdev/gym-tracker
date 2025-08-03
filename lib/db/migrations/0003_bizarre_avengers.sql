CREATE TABLE "routine_exercise_sets" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"routine_exercise_id" uuid NOT NULL,
	"set_number" integer NOT NULL,
	"reps" integer,
	"weight" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "routine_exercises" ADD COLUMN "notes" text;--> statement-breakpoint
ALTER TABLE "routine_exercise_sets" ADD CONSTRAINT "routine_exercise_sets_routine_exercise_id_routine_exercises_id_fk" FOREIGN KEY ("routine_exercise_id") REFERENCES "public"."routine_exercises"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "routine_exercises" DROP COLUMN "sets";--> statement-breakpoint
ALTER TABLE "routine_exercises" DROP COLUMN "reps";--> statement-breakpoint
ALTER TABLE "routine_exercises" DROP COLUMN "weight";