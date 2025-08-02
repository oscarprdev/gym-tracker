import { z } from 'zod';

export const createExerciseSchema = z.object({
  name: z
    .string()
    .min(1, 'Exercise name is required')
    .min(2, 'Exercise name must be at least 2 characters')
    .max(100, 'Exercise name must be less than 100 characters'),
  muscleGroups: z
    .array(z.string())
    .min(1, 'At least one muscle group is required')
    .refine((groups) => groups.every((group) => group.trim().length > 0), 'Muscle groups cannot be empty'),
});

export const addExerciseToRoutineSchema = z
  .object({
    exerciseId: z.string().uuid('Invalid exercise ID'),
    sets: z.number().min(1, 'Sets must be at least 1').max(20, 'Sets cannot exceed 20'),
    reps: z.number().min(1, 'Reps must be at least 1').max(100, 'Reps cannot exceed 100').optional(),
    repRangeMin: z.number().min(1, 'Min reps must be at least 1').max(100, 'Min reps cannot exceed 100').optional(),
    repRangeMax: z.number().min(1, 'Max reps must be at least 1').max(100, 'Max reps cannot exceed 100').optional(),
    weight: z.number().min(0, 'Weight cannot be negative').max(1000, 'Weight cannot exceed 1000kg').optional(),
    restTime: z
      .number()
      .min(0, 'Rest time cannot be negative')
      .max(600, 'Rest time cannot exceed 10 minutes')
      .optional(),
    notes: z.string().max(200, 'Notes must be less than 200 characters').optional(),
  })
  .refine(
    (data) => {
      if (data.repRangeMin && data.repRangeMax) {
        return data.repRangeMin <= data.repRangeMax;
      }
      return true;
    },
    {
      message: 'Min reps cannot be greater than max reps',
      path: ['repRangeMax'],
    }
  );

export const updateExerciseSchema = createExerciseSchema.partial();

export const searchExercisesSchema = z.object({
  query: z.string().max(100, 'Search query too long').optional(),
  muscleGroups: z.array(z.string()).optional(),
  isCustom: z.boolean().optional(),
  limit: z.number().min(1).max(100).default(20),
  offset: z.number().min(0).default(0),
});

export type CreateExerciseInput = z.infer<typeof createExerciseSchema>;
export type AddExerciseToRoutineInput = z.infer<typeof addExerciseToRoutineSchema>;
export type UpdateExerciseInput = z.infer<typeof updateExerciseSchema>;
export type SearchExercisesInput = z.infer<typeof searchExercisesSchema>;

// Parsing functions
export function parseCreateExercise(formData: FormData): CreateExerciseInput {
  return createExerciseSchema.parse({
    name: formData.get('name'),
    muscleGroups: JSON.parse((formData.get('muscleGroups') as string) || '[]'),
  });
}

export function parseUpdateExercise(formData: FormData): UpdateExerciseInput {
  return updateExerciseSchema.parse({
    name: formData.get('name') || undefined,
    muscleGroups: formData.get('muscleGroups') ? JSON.parse(formData.get('muscleGroups') as string) : undefined,
  });
}

export function parseAddExerciseToRoutine(formData: FormData): AddExerciseToRoutineInput {
  return addExerciseToRoutineSchema.parse({
    exerciseId: formData.get('exerciseId'),
    sets: Number(formData.get('sets')),
    reps: formData.get('reps') ? Number(formData.get('reps')) : undefined,
    repRangeMin: formData.get('repRangeMin') ? Number(formData.get('repRangeMin')) : undefined,
    repRangeMax: formData.get('repRangeMax') ? Number(formData.get('repRangeMax')) : undefined,
    weight: formData.get('weight') ? Number(formData.get('weight')) : undefined,
    restTime: formData.get('restTime') ? Number(formData.get('restTime')) : undefined,
    notes: formData.get('notes') || undefined,
  });
}

export function parseSearchExercises(data: SearchExercisesInput): SearchExercisesInput {
  return searchExercisesSchema.parse(data);
}
