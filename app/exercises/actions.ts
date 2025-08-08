'use server';

import { revalidatePath } from 'next/cache';
import { protectedAction, to, toSync } from '@/features/shared/utils/error-handler';
import { Nullable } from '@/features/shared';
import { createExercise, deleteExercise } from '@/lib/db/queries/exercises';
import { parseCreateExercise, parseDeleteExercise } from '@/features/exercises/validations';
import type { CreateExerciseFormValues, DeleteExerciseData } from '@/features/exercises/validations';

interface ActionResponse {
  error: Nullable<string>;
}

interface ActionResponseWithData<T> {
  error: Nullable<string>;
  data: T | null;
}

export const createExerciseServerAction = protectedAction(
  async (session, input: CreateExerciseFormValues): Promise<ActionResponseWithData<{ id: string }>> => {
    const [validationError, validatedData] = toSync(() => parseCreateExercise(input));

    if (validationError || !validatedData) {
      return { error: validationError?.message || 'Invalid data', data: null };
    }

    const [dbError, result] = await to(
      createExercise({
        name: validatedData.name,
        muscleGroups: validatedData.muscleGroups,
        userId: session.userId,
      })
    );

    if (dbError || !result) {
      return { error: 'Failed to create exercise', data: null };
    }

    revalidatePath('/exercises');
    return { error: null, data: { id: result.id } };
  }
);

export const deleteExerciseServerAction = protectedAction(
  async (session, input: DeleteExerciseData): Promise<ActionResponse> => {
    const [validationError, validatedData] = toSync(() => parseDeleteExercise(input));

    if (validationError || !validatedData) {
      return { error: validationError?.message || 'Invalid data' };
    }

    const [dbError] = await to(deleteExercise(validatedData.id, session.userId));

    if (dbError) {
      return { error: 'Failed to delete exercise' };
    }

    revalidatePath('/exercises');
    return { error: null };
  }
);
