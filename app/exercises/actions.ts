'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { requireAuth } from '@/lib/auth/utils';
import { to, toSync, handleValidationError } from '@/lib/utils/error-handler';
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

export async function createExerciseAction(
  prevState: { error?: string; fieldErrors?: Record<string, string[]> },
  formData: FormData
) {
  const [sessionError, session] = await to(requireAuth());
  if (sessionError || !session) return { error: 'Authentication required' };

  const [validationError, validatedData] = toSync(() => parseCreateExercise(formData));
  const validationErrorResult = handleValidationError(validationError, validatedData);

  if (validationErrorResult) return validationErrorResult;
  if (!validatedData) return { error: 'Invalid form data' };

  const [createError, exercise] = await to(
    createExercise({
      name: validatedData.name,
      description: validatedData.description,
      muscleGroups: validatedData.muscleGroups,
      equipment: validatedData.equipment,
      instructions: validatedData.instructions,
      imageUrl: validatedData.imageUrl,
      videoUrl: validatedData.videoUrl,
      isCustom: true,
      createdBy: session.user.id,
    })
  );

  if (createError || !exercise) {
    return { error: createError?.message || 'Failed to create exercise' };
  }

  revalidatePath('/exercises');
  redirect(`/exercises/${exercise.id}`);
}

export async function updateExerciseAction(
  exerciseId: string,
  prevState: { error?: string; fieldErrors?: Record<string, string[]> },
  formData: FormData
) {
  const [sessionError, session] = await to(requireAuth());

  if (sessionError || !session) return { error: 'Authentication required' };

  const [validationError, validatedData] = toSync(() => parseUpdateExercise(formData));

  const validationErrorResult = handleValidationError(validationError, validatedData);
  if (validationErrorResult) return validationErrorResult;
  if (!validatedData) return { error: 'Invalid form data' };

  const [updateError, exercise] = await to(updateExercise(exerciseId, session.user.id, validatedData));

  if (updateError) {
    console.error('Exercise update error:', updateError);
    return { error: updateError.message || 'Failed to update exercise' };
  }

  revalidatePath('/exercises');
  revalidatePath(`/exercises/${exerciseId}`);

  return { success: true, data: exercise };
}

export async function deleteExerciseAction(exerciseId: string) {
  const [sessionError, session] = await to(requireAuth());

  if (sessionError || !session) return { error: 'Authentication required' };

  const [deleteError] = await to(deleteExercise(exerciseId, session.user.id));

  if (deleteError) {
    console.error('Exercise deletion error:', deleteError);
    return { error: deleteError.message || 'Failed to delete exercise' };
  }

  revalidatePath('/exercises');
  redirect('/exercises');
}

export async function searchExercisesAction(params: SearchExercisesInput) {
  const [validationError, validatedParams] = toSync(() => parseSearchExercises(params));

  const validationErrorResult = handleValidationError(validationError, validatedParams);
  if (validationErrorResult) return { error: 'Invalid search parameters' };
  if (!validatedParams) return { error: 'Invalid search parameters' };

  const [searchError, exercises] = await to(searchExercises(validatedParams));

  if (searchError) {
    console.error('Exercise search error:', searchError);
    return { error: 'Failed to search exercises' };
  }

  return { success: true, data: exercises };
}

export async function getAllExercisesAction() {
  const [error, exercises] = await to(getAllExercises());

  if (error) {
    console.error('Get all exercises error:', error);
    return { error: 'Failed to fetch exercises' };
  }

  return { success: true, data: exercises };
}

export async function getUserCustomExercisesAction() {
  const [sessionError, session] = await to(requireAuth());

  if (sessionError || !session) return { error: 'Authentication required' };

  const [error, exercises] = await to(getUserCustomExercises(session.user.id));

  if (error) {
    console.error('Get user custom exercises error:', error);
    return { error: 'Failed to fetch your custom exercises' };
  }

  return { success: true, data: exercises };
}

export async function getBuiltInExercisesAction() {
  const [error, exercises] = await to(getBuiltInExercises());

  if (error) {
    console.error('Get built-in exercises error:', error);
    return { error: 'Failed to fetch built-in exercises' };
  }

  return { success: true, data: exercises };
}
