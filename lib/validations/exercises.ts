import { z } from 'zod';

export const createExerciseSchema = z.object({
  name: z
    .string()
    .min(1, 'Exercise name is required')
    .min(2, 'Exercise name must be at least 2 characters')
    .max(100, 'Exercise name must be less than 100 characters'),
  description: z
    .string()
    .max(500, 'Description must be less than 500 characters')
    .optional(),
  muscleGroups: z
    .array(z.string())
    .min(1, 'At least one muscle group is required')
    .refine(
      (groups) => groups.every((group) => group.trim().length > 0),
      'Muscle groups cannot be empty'
    ),
  equipment: z
    .string()
    .max(100, 'Equipment must be less than 100 characters')
    .optional(),
  instructions: z
    .array(z.string())
    .optional()
    .refine(
      (instructions) =>
        !instructions ||
        instructions.every((instruction) => instruction.trim().length > 0),
      'Instructions cannot be empty'
    ),
  imageUrl: z
    .string()
    .url('Please enter a valid URL')
    .optional()
    .or(z.literal('')),
  videoUrl: z
    .string()
    .url('Please enter a valid URL')
    .optional()
    .or(z.literal('')),
});

export const addExerciseToRoutineSchema = z
  .object({
    exerciseId: z.string().uuid('Invalid exercise ID'),
    sets: z
      .number()
      .min(1, 'Sets must be at least 1')
      .max(20, 'Sets cannot exceed 20'),
    reps: z
      .number()
      .min(1, 'Reps must be at least 1')
      .max(100, 'Reps cannot exceed 100')
      .optional(),
    repRangeMin: z
      .number()
      .min(1, 'Min reps must be at least 1')
      .max(100, 'Min reps cannot exceed 100')
      .optional(),
    repRangeMax: z
      .number()
      .min(1, 'Max reps must be at least 1')
      .max(100, 'Max reps cannot exceed 100')
      .optional(),
    weight: z
      .number()
      .min(0, 'Weight cannot be negative')
      .max(1000, 'Weight cannot exceed 1000kg')
      .optional(),
    restTime: z
      .number()
      .min(0, 'Rest time cannot be negative')
      .max(600, 'Rest time cannot exceed 10 minutes')
      .optional(),
    notes: z
      .string()
      .max(200, 'Notes must be less than 200 characters')
      .optional(),
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
  equipment: z.string().optional(),
  isCustom: z.boolean().optional(),
  limit: z.number().min(1).max(100).default(20),
  offset: z.number().min(0).default(0),
});

export type CreateExerciseInput = z.infer<typeof createExerciseSchema>;
export type AddExerciseToRoutineInput = z.infer<
  typeof addExerciseToRoutineSchema
>;
export type UpdateExerciseInput = z.infer<typeof updateExerciseSchema>;
export type SearchExercisesInput = z.infer<typeof searchExercisesSchema>;
