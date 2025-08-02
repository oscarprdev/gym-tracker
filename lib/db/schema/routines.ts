import {
  pgTable,
  text,
  timestamp,
  integer,
  decimal,
  boolean,
  uuid,
} from 'drizzle-orm/pg-core';
import { users } from './users';
import { exercises } from './exercises';

export const routines = pgTable('routines', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: text('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  description: text('description'),
  isTemplate: boolean('is_template').default(false),
  color: text('color'),
  estimatedDuration: integer('estimated_duration'), // in minutes
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const routineExercises = pgTable('routine_exercises', {
  id: uuid('id').defaultRandom().primaryKey(),
  routineId: uuid('routine_id')
    .notNull()
    .references(() => routines.id, { onDelete: 'cascade' }),
  exerciseId: uuid('exercise_id')
    .notNull()
    .references(() => exercises.id, { onDelete: 'cascade' }),
  order: integer('order').notNull(),
  sets: integer('sets').notNull(),
  reps: integer('reps'),
  repRangeMin: integer('rep_range_min'),
  repRangeMax: integer('rep_range_max'),
  weight: decimal('weight', { precision: 5, scale: 2 }),
  restTime: integer('rest_time'), // in seconds
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Weekly schedule table for routine scheduling
export const weeklySchedule = pgTable('weekly_schedule', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: text('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  routineId: uuid('routine_id')
    .notNull()
    .references(() => routines.id, { onDelete: 'cascade' }),
  dayOfWeek: integer('day_of_week').notNull(), // 0 = Sunday, 1 = Monday, etc.
  time: text('time'), // HH:MM format
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export type Routine = typeof routines.$inferSelect;
export type NewRoutine = typeof routines.$inferInsert;
export type RoutineExercise = typeof routineExercises.$inferSelect;
export type NewRoutineExercise = typeof routineExercises.$inferInsert;
export type WeeklySchedule = typeof weeklySchedule.$inferSelect;
export type NewWeeklySchedule = typeof weeklySchedule.$inferInsert;
