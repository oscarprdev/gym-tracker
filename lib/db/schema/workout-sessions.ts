import { pgTable, text, timestamp, integer } from 'drizzle-orm/pg-core';
import { users } from './users';
import { routines } from './routines';
import { exercises } from './exercises';

export const workoutSessions = pgTable('workout_sessions', {
  id: text('id').primaryKey(),
  userId: text('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  routineId: text('routine_id').references(() => routines.id),
  name: text('name').notNull(),
  status: text('status', {
    enum: ['planned', 'in_progress', 'completed', 'skipped'],
  }).default('planned'),
  startedAt: timestamp('started_at'),
  completedAt: timestamp('completed_at'),
  duration: integer('duration'), // in seconds
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at')
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});

export const exerciseLogs = pgTable('exercise_logs', {
  id: text('id').primaryKey(),
  sessionId: text('session_id')
    .notNull()
    .references(() => workoutSessions.id, { onDelete: 'cascade' }),
  exerciseId: text('exercise_id')
    .notNull()
    .references(() => exercises.id, { onDelete: 'cascade' }),
  order: integer('order').notNull(),
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const setLogs = pgTable('set_logs', {
  id: text('id').primaryKey(),
  exerciseLogId: text('exercise_log_id')
    .notNull()
    .references(() => exerciseLogs.id, { onDelete: 'cascade' }),
  setNumber: integer('set_number').notNull(),
  reps: integer('reps').notNull(),
  weight: text('weight').notNull(), // Stored as text to handle different units
  isCompleted: integer('is_completed').default(1), // 0 = false, 1 = true
  isWarmup: integer('is_warmup').default(0), // 0 = false, 1 = true
  restTime: integer('rest_time'), // actual rest time in seconds
  rpe: integer('rpe'), // Rate of Perceived Exertion (1-10)
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export type WorkoutSession = typeof workoutSessions.$inferSelect;
export type NewWorkoutSession = typeof workoutSessions.$inferInsert;
export type ExerciseLog = typeof exerciseLogs.$inferSelect;
export type NewExerciseLog = typeof exerciseLogs.$inferInsert;
export type SetLog = typeof setLogs.$inferSelect;
export type NewSetLog = typeof setLogs.$inferInsert;
