import { pgTable, text, timestamp, integer, decimal, boolean, uuid } from 'drizzle-orm/pg-core';
import { users } from './auth';
import { workouts } from './workouts';
import { exercises } from './exercises';

export const workoutSessions = pgTable('workout_sessions', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: text('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  workoutId: uuid('workout_id').references(() => workouts.id, {
    onDelete: 'set null',
  }),
  name: text('name').notNull(),
  status: text('status', {
    enum: ['planned', 'in_progress', 'completed', 'skipped'],
  }).default('planned'),
  startedAt: timestamp('started_at'),
  completedAt: timestamp('completed_at'),
  duration: integer('duration'), // in seconds
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const exerciseLogs = pgTable('exercise_logs', {
  id: uuid('id').defaultRandom().primaryKey(),
  sessionId: uuid('session_id')
    .notNull()
    .references(() => workoutSessions.id, { onDelete: 'cascade' }),
  exerciseId: uuid('exercise_id')
    .notNull()
    .references(() => exercises.id, { onDelete: 'cascade' }),
  order: integer('order').notNull(),
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const setLogs = pgTable('set_logs', {
  id: uuid('id').defaultRandom().primaryKey(),
  exerciseLogId: uuid('exercise_log_id')
    .notNull()
    .references(() => exerciseLogs.id, { onDelete: 'cascade' }),
  setNumber: integer('set_number').notNull(),
  reps: integer('reps'),
  weight: decimal('weight', { precision: 5, scale: 2 }),
  isCompleted: boolean('is_completed').default(false),
  isWarmup: boolean('is_warmup').default(false),
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
