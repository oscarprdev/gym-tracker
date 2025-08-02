import { relations } from 'drizzle-orm';
import { users } from './users';
import { exercises } from './exercises';
import { routines, routineExercises, weeklySchedule } from './routines';
import { workoutSessions, exerciseLogs, setLogs } from './workout-sessions';

// User relations
export const usersRelations = relations(users, ({ many }) => ({
  routines: many(routines),
  workoutSessions: many(workoutSessions),
  weeklySchedule: many(weeklySchedule),
  customExercises: many(exercises),
}));

// Exercise relations
export const exercisesRelations = relations(exercises, ({ one, many }) => ({
  createdBy: one(users, {
    fields: [exercises.createdBy],
    references: [users.id],
  }),
  routineExercises: many(routineExercises),
  exerciseLogs: many(exerciseLogs),
}));

// Routine relations
export const routinesRelations = relations(routines, ({ one, many }) => ({
  user: one(users, {
    fields: [routines.userId],
    references: [users.id],
  }),
  exercises: many(routineExercises),
  workoutSessions: many(workoutSessions),
  weeklySchedule: many(weeklySchedule),
}));

export const routineExercisesRelations = relations(
  routineExercises,
  ({ one }) => ({
    routine: one(routines, {
      fields: [routineExercises.routineId],
      references: [routines.id],
    }),
    exercise: one(exercises, {
      fields: [routineExercises.exerciseId],
      references: [exercises.id],
    }),
  })
);

export const weeklyScheduleRelations = relations(weeklySchedule, ({ one }) => ({
  user: one(users, {
    fields: [weeklySchedule.userId],
    references: [users.id],
  }),
  routine: one(routines, {
    fields: [weeklySchedule.routineId],
    references: [routines.id],
  }),
}));

// Workout session relations
export const workoutSessionsRelations = relations(
  workoutSessions,
  ({ one, many }) => ({
    user: one(users, {
      fields: [workoutSessions.userId],
      references: [users.id],
    }),
    routine: one(routines, {
      fields: [workoutSessions.routineId],
      references: [routines.id],
    }),
    exerciseLogs: many(exerciseLogs),
  })
);

export const exerciseLogsRelations = relations(
  exerciseLogs,
  ({ one, many }) => ({
    session: one(workoutSessions, {
      fields: [exerciseLogs.sessionId],
      references: [workoutSessions.id],
    }),
    exercise: one(exercises, {
      fields: [exerciseLogs.exerciseId],
      references: [exercises.id],
    }),
    sets: many(setLogs),
  })
);

export const setLogsRelations = relations(setLogs, ({ one }) => ({
  exerciseLog: one(exerciseLogs, {
    fields: [setLogs.exerciseLogId],
    references: [exerciseLogs.id],
  }),
}));
