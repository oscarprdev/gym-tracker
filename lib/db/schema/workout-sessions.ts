import { pgTable, text, timestamp, uuid, integer } from 'drizzle-orm/pg-core';
import { users } from './auth';
import { workouts } from './workouts';

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
  scheduledDate: timestamp('scheduled_date'),
  startedAt: timestamp('started_at'),
  completedAt: timestamp('completed_at'),
  durationMinutes: integer('duration_minutes'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export type WorkoutSession = typeof workoutSessions.$inferSelect;
export type NewWorkoutSession = typeof workoutSessions.$inferInsert;
