'use server';

import { revalidatePath } from 'next/cache';
import { to, toSync, handleValidationError, protectedAction } from '@/lib/utils/error-handler';
import {
  parseCreateExercise,
  parseUpdateExercise,
  parseSearchExercises,
  type SearchExercisesInput,
} from '@/lib/validations/exercises';
import {
  createExercise,
  updateExercise,
  deleteExercise,
  searchExercises,
  getAllExercises,
  getUserCustomExercises,
  getBuiltInExercises,
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
        isCustom: true,
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

export async function searchExercisesAction(params: SearchExercisesInput) {
  const [validationError, validatedParams] = toSync(() => parseSearchExercises(params));

  const validationErrorResult = handleValidationError(validationError, validatedParams);

  if (validationErrorResult) {
    return validationErrorResult;
  }

  if (!validatedParams) {
    return { error: 'Invalid search parameters' };
  }

  const [searchError, exercises] = await to(searchExercises(validatedParams));

  if (searchError) {
    return { error: searchError.message || 'Failed to search exercises' };
  }

  return { success: true, data: exercises };
}

export async function getAllExercisesAction() {
  const [error, exercises] = await to(getAllExercises());

  if (error) {
    return { error: 'Failed to fetch exercises' };
  }

  return { success: true, data: exercises };
}

export const getUserCustomExercisesAction = protectedAction(async (session) => {
  const [error, exercises] = await to(getUserCustomExercises(session.user.id));

  if (error) {
    return { error: error.message || 'Failed to fetch your custom exercises' };
  }

  return { success: true, data: exercises };
});

export async function getBuiltInExercisesAction() {
  const [error, exercises] = await to(getBuiltInExercises());

  if (error) {
    return { error: error.message || 'Failed to fetch built-in exercises' };
  }

  return { success: true, data: exercises };
}
