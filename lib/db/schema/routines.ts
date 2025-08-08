import { pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import { users } from './auth';

export const routines = pgTable('routines', {
  id: uuid('id').primaryKey(),
  userId: text('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  createdAt: timestamp('created_at').notNull(),
  updatedAt: timestamp('updated_at').notNull(),
});
