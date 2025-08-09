'use server';

import { protectedAction } from '@/features/shared/utils/error-handler';
import { ActionResponse } from '@/features/shared/types';
import { revalidatePath } from 'next/cache';
import { deleteRoutine } from '@/lib/db/queries';
import { to } from '@/features/shared/utils/error-handler';

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
