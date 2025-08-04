'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { protectedAction } from '@/lib/utils/error-handler';
import { deleteRoutine, updateRoutine } from '@/lib/db/queries/routines';
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

export const updateRoutineAction = protectedAction(
  async (session, prevState: { error: string | null }, formData: FormData) => {
    const routineId = formData.get('routineId') as string;
    const routineData = formData.get('routineData') as string;

    if (!routineId || !routineData) {
      return { error: 'Routine ID and data are required' };
    }

    const { name } = JSON.parse(routineData);

    // Update the routine name
    const [updateError] = await to(updateRoutine(routineId, { name }));

    if (updateError) {
      return { error: 'Failed to update routine' };
    }

    // TODO: Handle workout updates, deletions, and additions
    // This would require more complex logic to sync the workouts
    // For now, we'll just update the routine name

    revalidatePath(`/routines/${routineId}`);
    revalidatePath('/routines');
    redirect(`/routines/${routineId}`);
  }
);
