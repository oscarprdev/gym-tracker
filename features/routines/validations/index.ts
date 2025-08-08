import { z } from 'zod';

// Base schemas
export const routineIdSchema = z.string().min(1, 'Routine ID is required');
export const workoutIdSchema = z.string().min(1, 'Workout ID is required');
export const exerciseIdSchema = z.string().min(1, 'Exercise ID is required');

// Routine schemas
export const createRoutineSchema = z.object({
  name: z.string().min(1, 'Routine name is required').max(100, 'Name must be less than 100 characters'),
});

export const updateRoutineSchema = z.object({
  id: routineIdSchema,
  name: z.string().min(1, 'Routine name is required').max(100, 'Name must be less than 100 characters'),
});

export const deleteRoutineSchema = z.object({
  id: routineIdSchema,
});

export const setActiveRoutineSchema = z.object({
  routineId: routineIdSchema.nullable(),
});

// Workout schemas
export const createWorkoutSchema = z.object({
  routineId: routineIdSchema,
  name: z.string().min(1, 'Workout name is required').max(100, 'Name must be less than 100 characters'),
  dayOfWeek: z.number().int().min(0).max(6).nullable().optional(),
});

export const updateWorkoutSchema = z.object({
  id: workoutIdSchema,
  name: z.string().min(1, 'Workout name is required').max(100, 'Name must be less than 100 characters').optional(),
  dayOfWeek: z.number().int().min(0).max(6).nullable().optional(),
});

export const deleteWorkoutSchema = z.object({
  id: workoutIdSchema,
});

export const reorderWorkoutsSchema = z.object({
  routineId: routineIdSchema,
  workoutIds: z.array(workoutIdSchema).min(1, 'At least one workout ID is required'),
});

// Workout exercise schemas
export const addExerciseToWorkoutSchema = z.object({
  workoutId: workoutIdSchema,
  exerciseId: exerciseIdSchema,
  setNumber: z.number().int().min(1, 'Set number must be at least 1'),
  reps: z.number().int().min(1, 'Reps must be at least 1').nullable().optional(),
  weight: z.number().int().min(0, 'Weight cannot be negative').default(0),
});

export const updateWorkoutExerciseSchema = z.object({
  id: z.string().min(1, 'Workout exercise ID is required'),
  setNumber: z.number().int().min(1, 'Set number must be at least 1').optional(),
  reps: z.number().int().min(1, 'Reps must be at least 1').nullable().optional(),
  weight: z.number().int().min(0, 'Weight cannot be negative').optional(),
});

export const removeExerciseFromWorkoutSchema = z.object({
  id: z.string().min(1, 'Workout exercise ID is required'),
});

export const reorderWorkoutExercisesSchema = z.object({
  workoutId: workoutIdSchema,
  exerciseIds: z.array(z.string().min(1, 'Exercise ID is required')).min(1, 'At least one exercise ID is required'),
});

// Type exports
export type CreateRoutineFormValues = z.infer<typeof createRoutineSchema>;
export type UpdateRoutineData = z.infer<typeof updateRoutineSchema>;
export type DeleteRoutineData = z.infer<typeof deleteRoutineSchema>;
export type SetActiveRoutineData = z.infer<typeof setActiveRoutineSchema>;
export type CreateWorkoutData = z.infer<typeof createWorkoutSchema>;
export type UpdateWorkoutData = z.infer<typeof updateWorkoutSchema>;
export type DeleteWorkoutData = z.infer<typeof deleteWorkoutSchema>;
export type ReorderWorkoutsData = z.infer<typeof reorderWorkoutsSchema>;
export type AddExerciseToWorkoutData = z.infer<typeof addExerciseToWorkoutSchema>;
export type UpdateWorkoutExerciseData = z.infer<typeof updateWorkoutExerciseSchema>;
export type RemoveExerciseFromWorkoutData = z.infer<typeof removeExerciseFromWorkoutSchema>;
export type ReorderWorkoutExercisesData = z.infer<typeof reorderWorkoutExercisesSchema>;

// Parsing functions
export function parseCreateRoutine(input: CreateRoutineFormValues): CreateRoutineFormValues {
  return createRoutineSchema.parse(input);
}

export function parseUpdateRoutine(input: UpdateRoutineData): UpdateRoutineData {
  return updateRoutineSchema.parse(input);
}

export function parseDeleteRoutine(input: DeleteRoutineData): DeleteRoutineData {
  return deleteRoutineSchema.parse(input);
}

export function parseSetActiveRoutine(input: SetActiveRoutineData): SetActiveRoutineData {
  return setActiveRoutineSchema.parse(input);
}

export function parseCreateWorkout(input: CreateWorkoutData): CreateWorkoutData {
  return createWorkoutSchema.parse(input);
}

export function parseUpdateWorkout(input: UpdateWorkoutData): UpdateWorkoutData {
  return updateWorkoutSchema.parse(input);
}

export function parseDeleteWorkout(input: DeleteWorkoutData): DeleteWorkoutData {
  return deleteWorkoutSchema.parse(input);
}

export function parseReorderWorkouts(input: ReorderWorkoutsData): ReorderWorkoutsData {
  return reorderWorkoutsSchema.parse(input);
}

export function parseAddExerciseToWorkout(input: AddExerciseToWorkoutData): AddExerciseToWorkoutData {
  return addExerciseToWorkoutSchema.parse(input);
}

export function parseUpdateWorkoutExercise(input: UpdateWorkoutExerciseData): UpdateWorkoutExerciseData {
  return updateWorkoutExerciseSchema.parse(input);
}

export function parseRemoveExerciseFromWorkout(input: RemoveExerciseFromWorkoutData): RemoveExerciseFromWorkoutData {
  return removeExerciseFromWorkoutSchema.parse(input);
}

export function parseReorderWorkoutExercises(input: ReorderWorkoutExercisesData): ReorderWorkoutExercisesData {
  return reorderWorkoutExercisesSchema.parse(input);
}
