import { z } from 'zod';

export const assignActiveRoutineSchema = z.object({
  routineId: z.string().uuid({
    message: 'Please select a valid routine',
  }),
});

export const createWorkoutSessionSchema = z.object({
  workoutId: z.string().uuid().optional(),
  name: z
    .string()
    .min(1, {
      message: 'Workout name is required',
    })
    .max(100, {
      message: 'Workout name must be less than 100 characters',
    }),
  scheduledDate: z.string().datetime().optional().or(z.date().optional()),
});

export const workoutSessionActionSchema = z.object({
  sessionId: z.string().uuid({
    message: 'Please select a valid workout session',
  }),
});

export const completeWorkoutSessionSchema = z.object({
  sessionId: z.string().uuid({
    message: 'Please select a valid workout session',
  }),
  durationMinutes: z.number().int().positive().optional(),
});

export const quickWorkoutFormSchema = z.object({
  name: z
    .string()
    .min(1, {
      message: 'Workout name is required',
    })
    .max(100, {
      message: 'Workout name must be less than 100 characters',
    }),
  scheduledDate: z
    .string()
    .optional()
    .refine(
      (date) => {
        if (!date) return true;
        const parsedDate = new Date(date);
        return !isNaN(parsedDate.getTime());
      },
      {
        message: 'Please enter a valid date',
      }
    ),
});

export const dashboardStatsFilterSchema = z.object({
  days: z.number().int().positive().max(365).default(30),
});

// Parse functions for form data
export function parseAssignActiveRoutineData(formData: FormData) {
  const data = {
    routineId: formData.get('routineId'),
  };

  return assignActiveRoutineSchema.parse(data);
}

export function parseCreateWorkoutSessionData(formData: FormData) {
  const data = {
    workoutId: formData.get('workoutId') || undefined,
    name: formData.get('name'),
    scheduledDate: formData.get('scheduledDate') || undefined,
  };

  return createWorkoutSessionSchema.parse(data);
}

export function parseWorkoutSessionActionData(formData: FormData) {
  const data = {
    sessionId: formData.get('sessionId'),
  };

  return workoutSessionActionSchema.parse(data);
}

export function parseCompleteWorkoutSessionData(formData: FormData) {
  const data = {
    sessionId: formData.get('sessionId'),
    durationMinutes: formData.get('durationMinutes')
      ? parseInt(formData.get('durationMinutes') as string, 10)
      : undefined,
  };

  return completeWorkoutSessionSchema.parse(data);
}

export function parseQuickWorkoutFormData(formData: FormData) {
  const data = {
    name: formData.get('name'),
    scheduledDate: formData.get('scheduledDate') || undefined,
  };

  return quickWorkoutFormSchema.parse(data);
}

export function parseDashboardStatsFilterData(formData: FormData) {
  const data = {
    days: formData.get('days') ? parseInt(formData.get('days') as string, 10) : 30,
  };

  return dashboardStatsFilterSchema.parse(data);
}

// Type exports
export type AssignActiveRoutineData = z.infer<typeof assignActiveRoutineSchema>;
export type CreateWorkoutSessionData = z.infer<typeof createWorkoutSessionSchema>;
export type WorkoutSessionActionData = z.infer<typeof workoutSessionActionSchema>;
export type CompleteWorkoutSessionData = z.infer<typeof completeWorkoutSessionSchema>;
export type QuickWorkoutFormData = z.infer<typeof quickWorkoutFormSchema>;
export type DashboardStatsFilterData = z.infer<typeof dashboardStatsFilterSchema>;
