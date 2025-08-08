'use server';

import { protectedAction, to, toSync } from '@/features/shared/utils';
import { createRoutine } from '@/lib/db/queries';
import { revalidatePath } from 'next/cache';
import { CreateRoutineFormValues, parseCreateRoutine } from '../validations';
import { ActionResponse } from '@/features/shared/types';

export const createRoutineAction = protectedAction(
  async (session, input: CreateRoutineFormValues): Promise<ActionResponse | void> => {
    const [validationError, validatedData] = toSync(() => parseCreateRoutine(input));

    if (validationError || !validatedData) {
      return { error: validationError?.message || 'Invalid data' };
    }

    const [dbError, result] = await to(
      createRoutine({
        ...validatedData,
        userId: session.userId,
      })
    );

    if (dbError || !result) {
      return { error: 'Failed to create routine' };
    }

    revalidatePath('/');
  }
);
