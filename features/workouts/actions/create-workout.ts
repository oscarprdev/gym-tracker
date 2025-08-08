'use server';

import { parseCreateWorkout } from '@/features/routines/validations';
import { protectedAction, to, toSync } from '@/features/shared/utils';
import { createWorkout, CreateWorkoutData } from '@/lib/db/queries';
import { revalidatePath } from 'next/cache';

export const createWorkoutAction = protectedAction(async (session, input: CreateWorkoutData) => {
  const [validationError, validatedData] = toSync(() => parseCreateWorkout(input));

  if (validationError || !validatedData) {
    return { error: validationError?.message || 'Invalid data' };
  }

  const [dbError, result] = await to(createWorkout(validatedData));

  if (dbError || !result) {
    return { error: 'Failed to create workout' };
  }

  revalidatePath('/');
});
