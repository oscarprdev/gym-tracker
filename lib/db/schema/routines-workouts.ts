import { pgTable, uuid, timestamp, primaryKey } from 'drizzle-orm/pg-core';
import { routines } from './routines';
import { workouts } from './workouts';

export const routinesWorkouts = pgTable(
  'routines_workouts',
  {
    routineId: uuid('routine_id')
      .notNull()
      .references(() => routines.id, { onDelete: 'cascade' }),
    workoutId: uuid('workout_id')
      .notNull()
      .references(() => workouts.id, { onDelete: 'cascade' }),
    createdAt: timestamp('created_at').notNull(),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.routineId, table.workoutId] }),
  })
);
