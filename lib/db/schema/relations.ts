import { relations } from 'drizzle-orm';
import { users } from './auth';
import { exercises } from './exercises';
import { routines, weeklySchedule } from './routines';
import { workouts, workoutExercises, workoutExerciseSets } from './workouts';
import { workoutSessions } from './workout-sessions';

// User relations
export const userRelations = relations(users, ({ many }) => ({
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
  workoutExercises: many(workoutExercises),
}));

// Routine relations
export const routinesRelations = relations(routines, ({ one, many }) => ({
  user: one(users, {
    fields: [routines.userId],
    references: [users.id],
  }),
  workouts: many(workouts),
  weeklySchedule: many(weeklySchedule),
}));

// Workout relations
export const workoutsRelations = relations(workouts, ({ one, many }) => ({
  routine: one(routines, {
    fields: [workouts.routineId],
    references: [routines.id],
  }),
  workoutExercises: many(workoutExercises),
  workoutSessions: many(workoutSessions),
}));

// WorkoutExercise relations
export const workoutExercisesRelations = relations(workoutExercises, ({ one, many }) => ({
  workout: one(workouts, {
    fields: [workoutExercises.workoutId],
    references: [workouts.id],
  }),
  exercise: one(exercises, {
    fields: [workoutExercises.exerciseId],
    references: [exercises.id],
  }),
  sets: many(workoutExerciseSets),
}));

// WorkoutExerciseSet relations
export const workoutExerciseSetsRelations = relations(workoutExerciseSets, ({ one }) => ({
  workoutExercise: one(workoutExercises, {
    fields: [workoutExerciseSets.workoutExerciseId],
    references: [workoutExercises.id],
  }),
}));

// Weekly schedule relations
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
