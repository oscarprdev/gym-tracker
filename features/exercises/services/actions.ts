'use server';

import { revalidatePath } from 'next/cache';
import { to, toSync, handleValidationError, protectedAction } from '@/lib/utils/error-handler';
import { parseCreateExercise, parseUpdateExercise } from '@/features/exercises/validations';
import {
  createExercise,
  updateExercise,
  deleteExercise,
  getExercisesByUserAndMuscleGroups,
  getExercisesByUserDefault,
} from '@/lib/db/queries/exercises';

export const createExerciseAction = protectedAction(
  async (session, prevState: { error: string | null; fieldErrors?: Record<string, string[]> }, formData: FormData) => {
    const [validationError, validatedData] = toSync(() => parseCreateExercise(formData));
    const validationErrorResult = handleValidationError(validationError, validatedData);

    if (validationErrorResult) {
      return { ...validationErrorResult, success: false };
    }

    if (!validatedData) {
      return { error: 'Invalid form data', success: false };
    }

    const [createError, exercise] = await to(
      createExercise({
        name: validatedData.name,
        muscleGroups: validatedData.muscleGroups,
        createdBy: session.user.id,
      })
    );

    if (createError || !exercise) {
      return { error: createError?.message || 'Failed to create exercise', success: false };
    }

    revalidatePath('/exercises');
    return { success: true, error: null };
  }
);

export const updateExerciseAction = protectedAction(
  async (
    session,
    exerciseId: string,
    prevState: { error: string | null; fieldErrors?: Record<string, string[]> },
    formData: FormData
  ) => {
    const [validationError, validatedData] = toSync(() => parseUpdateExercise(formData));
    const validationErrorResult = handleValidationError(validationError, validatedData);

    if (validationErrorResult) {
      return { ...validationErrorResult, success: false };
    }

    if (!validatedData) {
      return { error: 'Invalid form data', success: false };
    }

    const [updateError] = await to(updateExercise(exerciseId, session.user.id, validatedData));

    if (updateError) {
      return { error: updateError.message || 'Failed to update exercise', success: false };
    }

    revalidatePath('/exercises');
    revalidatePath(`/exercises/${exerciseId}`);

    return { success: true, error: null };
  }
);

export const deleteExerciseAction = protectedAction(async (session, exerciseId: string) => {
  const [deleteError] = await to(deleteExercise(exerciseId, session.user.id));

  if (deleteError) {
    return { error: deleteError.message || 'Failed to delete exercise', success: false };
  }

  revalidatePath('/exercises');
  return { success: true, error: null };
});

export const getExercisesByMuscleGroupsAction = protectedAction(async (session, muscleGroups: string[]) => {
  const [fetchError, exercises] = await to(getExercisesByUserAndMuscleGroups(session.user.id, muscleGroups));

  if (fetchError) {
    return { error: fetchError.message || 'Failed to fetch exercises', exercises: [], success: false };
  }

  return { exercises: exercises || [], error: null, success: true };
});

export const getDefaultExercisesAction = protectedAction(async (session) => {
  const [fetchError, exercises] = await to(getExercisesByUserDefault(session.user.id));

  if (fetchError) {
    return { error: fetchError.message || 'Failed to fetch exercises', exercises: [], success: false };
  }

  return { exercises: exercises || [], error: null, success: true };
});
