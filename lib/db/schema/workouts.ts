import { pgTable, text, timestamp, uuid, integer } from 'drizzle-orm/pg-core';
import { routines } from './routines';

export const workouts = pgTable('workouts', {
  id: uuid('id').primaryKey(),
  routineId: uuid('routine_id')
    .notNull()
    .references(() => routines.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  dayOfWeek: integer('day_of_week'), // 0-6 for Sunday-Saturday, null for unscheduled
  order: integer('order').notNull(), // Order within the routine
  createdAt: timestamp('created_at').notNull(),
  updatedAt: timestamp('updated_at').notNull(),
});
