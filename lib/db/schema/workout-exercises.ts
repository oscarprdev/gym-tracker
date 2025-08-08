import { pgTable, timestamp, uuid, integer } from 'drizzle-orm/pg-core';
import { workouts } from './workouts';
import { exercises } from './exercises';

export const workoutExercises = pgTable('workout_exercises', {
  id: uuid('id').primaryKey(),
  workoutId: uuid('workout_id')
    .notNull()
    .references(() => workouts.id, { onDelete: 'cascade' }),
  exerciseId: uuid('exercise_id')
    .notNull()
    .references(() => exercises.id, { onDelete: 'cascade' }),
  setNumber: integer('set_number').notNull(), // 1, 2, 3, etc.
  reps: integer('reps'), // Target reps (can be null for time-based exercises)
  weight: integer('weight')
    .$default(() => 0)
    .notNull(), // Weight in the user's preferred unit
  order: integer('order').notNull(), // Order within the workout
  createdAt: timestamp('created_at').notNull(),
});
