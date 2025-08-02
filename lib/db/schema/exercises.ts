import { pgTable, text, timestamp, integer } from 'drizzle-orm/pg-core';

export const exercises = pgTable('exercises', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description'),
  instructions: text('instructions'),
  muscleGroups: text('muscle_groups').array(),
  equipment: text('equipment'),
  category: text('category').notNull(),
  isCustom: integer('is_custom').default(0), // 0 = default, 1 = custom
  createdBy: text('created_by').references(() => users.id),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at')
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});

import { users } from './users';

export type Exercise = typeof exercises.$inferSelect;
export type NewExercise = typeof exercises.$inferInsert;
