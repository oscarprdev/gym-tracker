import { pgTable, text, timestamp, uuid, integer } from 'drizzle-orm/pg-core';
import { users } from './auth';

export const workouts = pgTable('workouts', {
  id: uuid('id').primaryKey(),
  userId: text('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  muscleGroups: text('muscle_groups').array().notNull(),
  dayOfWeek: integer('day_of_week'), // 0-6 for Sunday-Saturday, null for unscheduled
  createdAt: timestamp('created_at').notNull(),
  updatedAt: timestamp('updated_at').notNull(),
});
