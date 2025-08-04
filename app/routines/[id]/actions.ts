'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { protectedAction } from '@/lib/utils/error-handler';
import { deleteRoutine } from '@/lib/db/queries/routines';
import { to } from '@/lib/utils/error-handler';

export const deleteRoutineAction = protectedAction(
  async (session, prevState: { error: string | null }, formData: FormData) => {
    const routineId = formData.get('routineId') as string;

    if (!routineId) {
      return { error: 'Routine ID is required' };
    }

    const [error] = await to(deleteRoutine(routineId));

    if (error) {
      return { error: 'Failed to delete routine' };
    }

    revalidatePath('/routines');
    redirect('/routines');
  }
);
