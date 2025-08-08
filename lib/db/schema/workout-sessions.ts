import { pgTable, text, timestamp, uuid, integer } from 'drizzle-orm/pg-core';
import { users } from './auth';
import { workouts } from './workouts';

export const workoutSessions = pgTable('workout_sessions', {
  id: uuid('id').primaryKey(),
  userId: text('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  workoutId: uuid('workout_id').references(() => workouts.id, {
    onDelete: 'set null', // Allow sessions to exist even if workout is deleted
  }),
  status: text('status')
    .$default(() => 'planned')
    .notNull(), // 'planned', 'in_progress', 'completed', 'skipped'
  scheduledDate: timestamp('scheduled_date'), // When the session was scheduled
  startedAt: timestamp('started_at'), // When the user started the session
  completedAt: timestamp('completed_at'), // When the user completed the session
  durationMinutes: integer('duration_minutes'), // Total duration in minutes
  createdAt: timestamp('created_at').notNull(),
  updatedAt: timestamp('updated_at').notNull(),
});
