import { z } from 'zod';
import { workoutIdSchema } from '../../workouts/validations';

// Base schemas
export const routineIdSchema = z.string().min(1, 'Routine ID is required');

// Routine schemas
export const createRoutineSchema = z.object({
  name: z.string().min(1, 'Routine name is required').max(100, 'Name must be less than 100 characters'),
  workoutIds: z.array(workoutIdSchema),
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

// Type exports
export type CreateRoutineFormValues = z.infer<typeof createRoutineSchema>;
export type UpdateRoutineData = z.infer<typeof updateRoutineSchema>;
export type DeleteRoutineData = z.infer<typeof deleteRoutineSchema>;
export type SetActiveRoutineData = z.infer<typeof setActiveRoutineSchema>;

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
