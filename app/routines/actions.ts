'use server';

import { revalidatePath } from 'next/cache';
import { protectedAction, to, toSync } from '@/features/shared/utils/error-handler';
import { Nullable } from '@/features/shared';
import { createRoutine, deleteRoutine } from '@/lib/db/queries/routines';
import { parseCreateRoutine } from '@/features/routines/validations';
import type { CreateRoutineFormValues } from '@/features/routines/validations';

interface ActionResponse {
  error: Nullable<string>;
}

export const createRoutineServerAction = protectedAction(
  async (session, input: CreateRoutineFormValues): Promise<ActionResponse | void> => {
    const [validationError, validatedData] = toSync(() => parseCreateRoutine(input));

    if (validationError || !validatedData) {
      return { error: validationError?.message || 'Invalid data' };
    }

    const [dbError, result] = await to(
      createRoutine({
        name: validatedData.name,
        userId: session.userId,
      })
    );

    if (dbError || !result) {
      return { error: 'Failed to create routine' };
    }

    revalidatePath('/');
  }
);

export const deleteRoutineServerAction = protectedAction(
  async (session, routineId: string): Promise<ActionResponse | void> => {
    if (!routineId) {
      return { error: 'Routine ID is required' };
    }

    const [dbError] = await to(deleteRoutine(routineId, session.userId));

    if (dbError) {
      return { error: 'Failed to delete routine' };
    }

    revalidatePath('/');
  }
);
