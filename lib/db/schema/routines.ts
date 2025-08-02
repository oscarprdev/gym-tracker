import { pgTable, text, timestamp, integer, real } from 'drizzle-orm/pg-core';
import { users } from './users';
import { exercises } from './exercises';

export const routines = pgTable('routines', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description'),
  userId: text('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  isTemplate: integer('is_template').default(0), // 0 = personal, 1 = template
  estimatedDuration: integer('estimated_duration'), // in minutes
  lastUsed: timestamp('last_used'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at')
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});

export const routineExercises = pgTable('routine_exercises', {
  id: text('id').primaryKey(),
  routineId: text('routine_id')
    .notNull()
    .references(() => routines.id, { onDelete: 'cascade' }),
  exerciseId: text('exercise_id')
    .notNull()
    .references(() => exercises.id, { onDelete: 'cascade' }),
  order: integer('order').notNull(),
  sets: integer('sets').notNull(),
  reps: text('reps'), // Can be a range like "8-12" or specific like "10"
  weight: real('weight'), // Default weight suggestion
  restTime: integer('rest_time'), // in seconds
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export type Routine = typeof routines.$inferSelect;
export type NewRoutine = typeof routines.$inferInsert;
export type RoutineExercise = typeof routineExercises.$inferSelect;
export type NewRoutineExercise = typeof routineExercises.$inferInsert;
