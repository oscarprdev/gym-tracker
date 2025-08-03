import { pgTable, text, timestamp, integer, uuid } from 'drizzle-orm/pg-core';
import { routines } from './routines';
import { exercises } from './exercises';

export const workouts = pgTable('workouts', {
  id: uuid('id').defaultRandom().primaryKey(),
  routineId: uuid('routine_id')
    .notNull()
    .references(() => routines.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  description: text('description'),
  dayOfWeek: integer('day_of_week'), // 0 = Sunday, 1 = Monday, etc. (optional for flexible scheduling)
  order: integer('order').notNull(), // Order within the routine (1-7)
  estimatedDuration: integer('estimated_duration'), // in minutes
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const workoutExercises = pgTable('workout_exercises', {
  id: uuid('id').defaultRandom().primaryKey(),
  workoutId: uuid('workout_id')
    .notNull()
    .references(() => workouts.id, { onDelete: 'cascade' }),
  exerciseId: uuid('exercise_id')
    .notNull()
    .references(() => exercises.id, { onDelete: 'cascade' }),
  order: integer('order').notNull(),
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const workoutExerciseSets = pgTable('workout_exercise_sets', {
  id: uuid('id').defaultRandom().primaryKey(),
  workoutExerciseId: uuid('workout_exercise_id')
    .notNull()
    .references(() => workoutExercises.id, { onDelete: 'cascade' }),
  setNumber: integer('set_number').notNull(),
  reps: integer('reps'),
  weight: integer('weight').notNull().default(0),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export type Workout = typeof workouts.$inferSelect;
export type NewWorkout = typeof workouts.$inferInsert;
export type WorkoutExercise = typeof workoutExercises.$inferSelect;
export type NewWorkoutExercise = typeof workoutExercises.$inferInsert;
export type WorkoutExerciseSet = typeof workoutExerciseSets.$inferSelect;
export type NewWorkoutExerciseSet = typeof workoutExerciseSets.$inferInsert;
