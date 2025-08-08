import { z } from 'zod';

const MUSCLE_GROUPS = ['Chest', 'Back', 'Shoulders', 'Biceps', 'Triceps', 'Legs', 'Core', 'Glutes'] as const;

export const exerciseIdSchema = z.string().min(1, 'Exercise ID is required');

export const createExerciseSchema = z.object({
  name: z.string().min(1, 'Exercise name is required').max(100, 'Name must be less than 100 characters').trim(),
  muscleGroups: z
    .array(z.enum(MUSCLE_GROUPS))
    .min(1, 'At least one muscle group is required')
    .max(5, 'Maximum 5 muscle groups allowed'),
});

export const updateExerciseSchema = z.object({
  id: exerciseIdSchema,
  name: z
    .string()
    .min(1, 'Exercise name is required')
    .max(100, 'Name must be less than 100 characters')
    .trim()
    .optional(),
  muscleGroups: z
    .array(z.enum(MUSCLE_GROUPS))
    .min(1, 'At least one muscle group is required')
    .max(5, 'Maximum 5 muscle groups allowed')
    .optional(),
});

export const deleteExerciseSchema = z.object({
  id: exerciseIdSchema,
});

export type CreateExerciseFormValues = z.infer<typeof createExerciseSchema>;
export type UpdateExerciseData = z.infer<typeof updateExerciseSchema>;
export type DeleteExerciseData = z.infer<typeof deleteExerciseSchema>;

export function parseCreateExercise(input: CreateExerciseFormValues): CreateExerciseFormValues {
  return createExerciseSchema.parse(input);
}

export function parseUpdateExercise(input: UpdateExerciseData): UpdateExerciseData {
  return updateExerciseSchema.parse(input);
}

export function parseDeleteExercise(input: DeleteExerciseData): DeleteExerciseData {
  return deleteExerciseSchema.parse(input);
}
