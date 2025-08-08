import { pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import { users } from './auth';

export const exercises = pgTable('exercises', {
  id: uuid('id').primaryKey(),
  name: text('name').notNull(),
  muscleGroups: text('muscle_groups').array().notNull(),
  createdBy: text('created_by').references(() => users.id, {
    onDelete: 'set null',
  }),
  createdAt: timestamp('created_at').notNull(),
  updatedAt: timestamp('updated_at').notNull(),
});
