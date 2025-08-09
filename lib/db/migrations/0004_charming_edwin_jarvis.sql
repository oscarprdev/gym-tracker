CREATE TABLE "routines_workouts" (
	"routine_id" uuid NOT NULL,
	"workout_id" uuid NOT NULL,
	"created_at" timestamp NOT NULL,
	CONSTRAINT "routines_workouts_routine_id_workout_id_pk" PRIMARY KEY("routine_id","workout_id")
);
--> statement-breakpoint
ALTER TABLE "workouts" DROP CONSTRAINT "workouts_routine_id_routines_id_fk";
--> statement-breakpoint
ALTER TABLE "workouts" ADD COLUMN "user_id" text NOT NULL;--> statement-breakpoint
ALTER TABLE "routines_workouts" ADD CONSTRAINT "routines_workouts_routine_id_routines_id_fk" FOREIGN KEY ("routine_id") REFERENCES "public"."routines"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "routines_workouts" ADD CONSTRAINT "routines_workouts_workout_id_workouts_id_fk" FOREIGN KEY ("workout_id") REFERENCES "public"."workouts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "workouts" ADD CONSTRAINT "workouts_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "workouts" DROP COLUMN "routine_id";--> statement-breakpoint
ALTER TABLE "workouts" DROP COLUMN "order";