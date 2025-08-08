'use server';

import { revalidatePath } from 'next/cache';
import { protectedAction, to, toSync } from '@/features/shared/utils/error-handler';
import { createWorkout } from '@/lib/db/queries/workouts';
import { parseCreateWorkout, type CreateWorkoutData } from '@/features/routines/validations';
import type { WorkoutRecord } from '@/lib/db/queries/workouts/get-routine-workouts';

interface ActionResponse {
  success: boolean;
  error?: string;
  workout?: WorkoutRecord;
}

export const createWorkoutServerAction = protectedAction(
  async (session, data: CreateWorkoutData): Promise<ActionResponse> => {
    const [validationError, validatedData] = toSync(() => parseCreateWorkout(data));

    if (validationError || !validatedData) {
      return {
        success: false,
        error: validationError?.message || 'Invalid data',
      };
    }

    const [dbError, workout] = await to(
      createWorkout({
        routineId: validatedData.routineId,
        name: validatedData.name,
        dayOfWeek: validatedData.dayOfWeek,
      })
    );

    if (dbError || !workout) {
      return {
        success: false,
        error: 'Failed to create workout',
      };
    }

    revalidatePath('/');
    return { success: true, workout };
  }
);
