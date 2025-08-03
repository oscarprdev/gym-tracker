import { z } from 'zod';
import { authIdSchema } from './auth';

export const createRoutineSchema = z.object({
  userId: authIdSchema,
  name: z.string().min(1, 'Routine name is required').max(100, 'Routine name must be less than 100 characters'),
  description: z.string().max(500, 'Description must be less than 500 characters').optional(),
});

export const updateRoutineSchema = createRoutineSchema.partial();

// Workout schemas
export const createWorkoutSchema = z.object({
  routineId: z.uuid('Invalid routine ID'),
  name: z.string().min(1, 'Workout name is required').max(100, 'Workout name must be less than 100 characters'),
  description: z.string().max(500, 'Description must be less than 500 characters').optional(),
  dayOfWeek: z.number().min(0).max(6).optional(), // 0 = Sunday, 6 = Saturday
  order: z.number().min(1, 'Order must be at least 1').max(7, 'Order cannot exceed 7'),
  estimatedDuration: z
    .number()
    .min(1, 'Duration must be at least 1 minute')
    .max(480, 'Duration cannot exceed 8 hours')
    .optional(),
});

export const updateWorkoutSchema = createWorkoutSchema.partial();

// Workout exercise schemas
export const addExerciseToWorkoutSchema = z.object({
  workoutId: z.uuid('Invalid workout ID'),
  exerciseId: z.uuid('Invalid exercise ID'),
  order: z.number().min(0, 'Order must be non-negative'),
  notes: z.string().max(500, 'Notes must be less than 500 characters').optional(),
});

export const updateWorkoutExerciseSchema = z.object({
  id: z.uuid('Invalid workout exercise ID'),
  order: z.number().min(0, 'Order must be non-negative').optional(),
  notes: z.string().max(500, 'Notes must be less than 500 characters').optional(),
});

// Set schemas
export const setConfigSchema = z.object({
  id: z.string().min(1, 'Set config ID is required'),
  setNumber: z.number().min(1, 'Set number must be at least 1'),
  reps: z.number().min(1, 'At least 1 rep is required').max(1000, 'Maximum 1000 reps allowed').optional(),
  weight: z.number().min(0, 'Weight cannot be negative').max(9999, 'Weight must be less than 9999'),
  restTime: z.number().min(0, 'Rest time cannot be negative').max(3600, 'Rest time cannot exceed 1 hour').optional(),
  isWarmup: z.boolean().optional(),
});

export const workoutExerciseSchema = z.object({
  exerciseId: z.uuid('Invalid exercise ID'),
  sets: z.array(setConfigSchema).min(1, 'At least 1 set is required').max(50, 'Maximum 50 sets allowed'),
  notes: z.string().max(500, 'Notes must be less than 500 characters').optional(),
});

export const exerciseConfigSchema = z.object({
  id: z.string().min(1, 'Exercise config ID is required'),
  exerciseId: z.uuid('Invalid exercise ID'),
  name: z.string().min(1, 'Exercise name is required'),
  muscleGroups: z.array(z.string()).min(1, 'At least one muscle group is required'),
  sets: z.array(setConfigSchema).min(1, 'At least 1 set is required').max(50, 'Maximum 50 sets allowed'),
  notes: z.string().max(500, 'Notes must be less than 500 characters').optional(),
});

export const exercisesArraySchema = z.array(exerciseConfigSchema).min(1, 'At least one exercise is required');

export const updateWorkoutExerciseSetSchema = z.object({
  id: z.uuid('Invalid set ID'),
  reps: z.number().min(1, 'At least 1 rep is required').max(1000, 'Maximum 1000 reps allowed').optional(),
  weight: z.number().min(0, 'Weight cannot be negative').max(9999, 'Weight must be less than 9999').optional(),
  restTime: z.number().min(0, 'Rest time cannot be negative').max(3600, 'Rest time cannot exceed 1 hour').optional(),
  isWarmup: z.boolean().optional(),
});

export const reorderWorkoutsSchema = z.object({
  routineId: z.uuid('Invalid routine ID'),
  workoutOrders: z.array(
    z.object({
      id: z.uuid('Invalid workout ID'),
      order: z.number().min(1, 'Order must be at least 1').max(7, 'Order cannot exceed 7'),
    })
  ),
});

export const reorderWorkoutExercisesSchema = z.object({
  workoutId: z.uuid('Invalid workout ID'),
  exerciseOrders: z.array(
    z.object({
      id: z.uuid('Invalid exercise ID'),
      order: z.number().min(0, 'Order must be non-negative'),
    })
  ),
});

// Type exports
export type CreateRoutineInput = z.infer<typeof createRoutineSchema>;
export type UpdateRoutineInput = z.infer<typeof updateRoutineSchema>;
export type CreateWorkoutInput = z.infer<typeof createWorkoutSchema>;
export type UpdateWorkoutInput = z.infer<typeof updateWorkoutSchema>;
export type SetConfigInput = z.infer<typeof setConfigSchema>;
export type WorkoutExerciseInput = z.infer<typeof workoutExerciseSchema>;
export type ExerciseConfigInput = z.infer<typeof exerciseConfigSchema>;
export type AddExerciseToWorkoutInput = z.infer<typeof addExerciseToWorkoutSchema>;
export type UpdateWorkoutExerciseInput = z.infer<typeof updateWorkoutExerciseSchema>;
export type UpdateWorkoutExerciseSetInput = z.infer<typeof updateWorkoutExerciseSetSchema>;
export type ReorderWorkoutsInput = z.infer<typeof reorderWorkoutsSchema>;
export type ReorderWorkoutExercisesInput = z.infer<typeof reorderWorkoutExercisesSchema>;

// Parsing functions
export function parseCreateRoutine(formData: FormData): CreateRoutineInput {
  return createRoutineSchema.parse({
    userId: formData.get('userId'),
    name: formData.get('name'),
    description: formData.get('description') || undefined,
  });
}

export function parseCreateWorkout(formData: FormData): CreateWorkoutInput {
  return createWorkoutSchema.parse({
    routineId: formData.get('routineId'),
    name: formData.get('name'),
    description: formData.get('description') || undefined,
    dayOfWeek: formData.get('dayOfWeek') ? Number(formData.get('dayOfWeek')) : undefined,
    order: Number(formData.get('order')),
    estimatedDuration: formData.get('estimatedDuration') ? Number(formData.get('estimatedDuration')) : undefined,
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
