import { z } from 'zod';

export const createRoutineSchema = z.object({
  userId: z.uuid('Invalid user ID'),
  name: z.string().min(1, 'Routine name is required').max(100, 'Routine name must be less than 100 characters'),
  description: z.string().max(500, 'Description must be less than 500 characters').optional(),
});

export const updateRoutineSchema = createRoutineSchema.partial();

export const routineExerciseSchema = z.object({
  exerciseId: z.uuid('Invalid exercise ID'),
  sets: z.number().min(1, 'At least 1 set is required').max(50, 'Maximum 50 sets allowed'),
  reps: z.number().min(1, 'At least 1 rep is required').max(1000, 'Maximum 1000 reps allowed').optional(),
  repRangeMin: z.number().min(1, 'Minimum reps must be at least 1').optional(),
  repRangeMax: z.number().min(1, 'Maximum reps must be at least 1').optional(),
  weight: z.number().min(0, 'Weight cannot be negative').max(9999, 'Weight must be less than 9999').optional(),
  restTime: z
    .number()
    .min(0, 'Rest time cannot be negative')
    .max(3600, 'Rest time must be less than 1 hour')
    .optional(),
  notes: z.string().max(500, 'Notes must be less than 500 characters').optional(),
});

export const exerciseConfigSchema = z.object({
  id: z.string().min(1, 'Exercise config ID is required'),
  exerciseId: z.uuid('Invalid exercise ID'),
  name: z.string().min(1, 'Exercise name is required'),
  muscleGroups: z.array(z.string()).min(1, 'At least one muscle group is required'),
  sets: z.number().min(1, 'At least 1 set is required').max(50, 'Maximum 50 sets allowed'),
  reps: z.number().min(1, 'At least 1 rep is required').max(1000, 'Maximum 1000 reps allowed').optional(),
  repRangeMin: z.number().min(1, 'Minimum reps must be at least 1').optional(),
  repRangeMax: z.number().min(1, 'Maximum reps must be at least 1').optional(),
  weight: z.number().min(0, 'Weight cannot be negative').max(9999, 'Weight must be less than 9999').optional(),
  restTime: z
    .number()
    .min(0, 'Rest time cannot be negative')
    .max(3600, 'Rest time must be less than 1 hour')
    .optional(),
  notes: z.string().max(500, 'Notes must be less than 500 characters').optional(),
});

export const exercisesArraySchema = z.array(exerciseConfigSchema).min(1, 'At least one exercise is required');

export const addExerciseToRoutineSchema = routineExerciseSchema.extend({
  routineId: z.uuid('Invalid routine ID'),
  order: z.number().min(0, 'Order must be non-negative'),
});

export const updateRoutineExerciseSchema = routineExerciseSchema.partial().extend({
  id: z.uuid('Invalid routine exercise ID'),
});

export const reorderExercisesSchema = z.object({
  routineId: z.uuid('Invalid routine ID'),
  exerciseOrders: z.array(
    z.object({
      id: z.uuid('Invalid exercise ID'),
      order: z.number().min(0, 'Order must be non-negative'),
    })
  ),
});

export type CreateRoutineInput = z.infer<typeof createRoutineSchema>;
export type UpdateRoutineInput = z.infer<typeof updateRoutineSchema>;
export type RoutineExerciseInput = z.infer<typeof routineExerciseSchema>;
export type ExerciseConfigInput = z.infer<typeof exerciseConfigSchema>;
export type AddExerciseToRoutineInput = z.infer<typeof addExerciseToRoutineSchema>;
export type UpdateRoutineExerciseInput = z.infer<typeof updateRoutineExerciseSchema>;
export type ReorderExercisesInput = z.infer<typeof reorderExercisesSchema>;

// Parsing functions
export function parseCreateRoutine(formData: FormData): CreateRoutineInput {
  return createRoutineSchema.parse({
    userId: formData.get('userId'),
    name: formData.get('name'),
    description: formData.get('description') || undefined,
  });
}

export function parseExercisesData(formData: FormData): ExerciseConfigInput[] {
  const exercisesData = formData.get('exercises');

  if (!exercisesData || typeof exercisesData !== 'string') {
    throw new Error('Exercises data is required and must be a string');
  }

  let parsedData: unknown;
  try {
    parsedData = JSON.parse(exercisesData);
  } catch {
    throw new Error('Invalid JSON format for exercises data');
  }

  return exercisesArraySchema.parse(parsedData);
}
