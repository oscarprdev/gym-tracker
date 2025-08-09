import { relations } from 'drizzle-orm';
import { users, sessions, accounts } from './auth';
import { exercises } from './exercises';
import { routines } from './routines';
import { workouts } from './workouts';
import { routinesWorkouts } from './routines-workouts';
import { workoutExercises } from './workout-exercises';
import { workoutSessions } from './workout-sessions';

// Auth relations
export const usersRelations = relations(users, ({ many, one }) => ({
  sessions: many(sessions),
  accounts: many(accounts),
  // Gym tracker relations
  routines: many(routines),
  workouts: many(workouts),
  createdExercises: many(exercises),
  workoutSessions: many(workoutSessions),
  // Active routine relation
  activeRoutine: one(routines, {
    fields: [users.activeRoutineId],
    references: [routines.id],
  }),
}));

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, {
    fields: [sessions.userId],
    references: [users.id],
  }),
}));

export const accountsRelations = relations(accounts, ({ one }) => ({
  user: one(users, {
    fields: [accounts.userId],
    references: [users.id],
  }),
}));

// Exercise relations
export const exercisesRelations = relations(exercises, ({ one, many }) => ({
  createdBy: one(users, {
    fields: [exercises.createdBy],
    references: [users.id],
  }),
  workoutExercises: many(workoutExercises),
}));

// Routine relations
export const routinesRelations = relations(routines, ({ one, many }) => ({
  user: one(users, {
    fields: [routines.userId],
    references: [users.id],
  }),
  routinesWorkouts: many(routinesWorkouts),
  // Users who have this routine as active
  activeForUsers: many(users),
}));

// Workout relations
export const workoutsRelations = relations(workouts, ({ one, many }) => ({
  user: one(users, {
    fields: [workouts.userId],
    references: [users.id],
  }),
  routinesWorkouts: many(routinesWorkouts),
  workoutExercises: many(workoutExercises),
  workoutSessions: many(workoutSessions),
}));

// Workout exercise relations
export const workoutExercisesRelations = relations(workoutExercises, ({ one }) => ({
  workout: one(workouts, {
    fields: [workoutExercises.workoutId],
    references: [workouts.id],
  }),
  exercise: one(exercises, {
    fields: [workoutExercises.exerciseId],
    references: [exercises.id],
  }),
}));

// Workout session relations
export const workoutSessionsRelations = relations(workoutSessions, ({ one }) => ({
  user: one(users, {
    fields: [workoutSessions.userId],
    references: [users.id],
  }),
  workout: one(workouts, {
    fields: [workoutSessions.workoutId],
    references: [workouts.id],
  }),
}));

// Routines-workouts junction table relations
export const routinesWorkoutsRelations = relations(routinesWorkouts, ({ one }) => ({
  routine: one(routines, {
    fields: [routinesWorkouts.routineId],
    references: [routines.id],
  }),
  workout: one(workouts, {
    fields: [routinesWorkouts.workoutId],
    references: [workouts.id],
  }),
}));
