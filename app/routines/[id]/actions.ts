'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { protectedAction, to, toSync, handleValidationError } from '@/lib/utils/error-handler';
import { deleteRoutine, updateRoutine } from '@/lib/db/queries/routines';
import {
  deleteWorkoutsByRoutine,
  createWorkout,
  addExerciseToWorkout,
  addSetsToWorkoutExercise,
} from '@/lib/db/queries/workouts';
import { parseWeeklyRoutineData } from '@/lib/validations/routines';

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

const DEFAULT_ACTION_STATE = {
  error: null,
  fieldErrors: {},
};

export const updateRoutineAction = protectedAction(
  async (session, prevState: { error: string | null; fieldErrors?: Record<string, string[]> }, formData: FormData) => {
    const routineId = formData.get('routineId') as string;

    if (!routineId) {
      return { error: 'Routine ID is required' };
    }

    // Parse and validate the routine data
    const [validationError, validatedData] = toSync(() => parseWeeklyRoutineData(formData));
    const validationResult = handleValidationError(validationError, validatedData);

    if (validationResult || !validatedData) {
      return { ...DEFAULT_ACTION_STATE, ...validationResult };
    }

    // Update the routine name
    const [updateError] = await to(updateRoutine(routineId, { name: validatedData.name }));

    if (updateError) {
      return { ...DEFAULT_ACTION_STATE, error: 'Failed to update routine' };
    }

    // Delete all existing workouts for this routine
    const [deleteError] = await to(deleteWorkoutsByRoutine(routineId));

    if (deleteError) {
      return { ...DEFAULT_ACTION_STATE, error: 'Failed to update workouts' };
    }

    // Create new workouts
    await Promise.all(
      validatedData.workouts.map(async (workoutData) => {
        const [workoutError, workout] = await to(
          createWorkout({
            routineId: routineId,
            name: workoutData.name,
            dayOfWeek: workoutData.dayOfWeek,
            order: workoutData.dayOfWeek === 0 ? 7 : workoutData.dayOfWeek, // Sunday = 7, Monday = 1, etc.
          })
        );

        if (workoutError || !workout) {
          return { ...DEFAULT_ACTION_STATE, error: 'Failed to create workout' };
        }

        // Add exercises to the workout
        await Promise.all(
          workoutData.exercises.map(async (exerciseData) => {
            const [exerciseError, workoutExercise] = await to(
              addExerciseToWorkout({
                workoutId: workout.id,
                exerciseId: exerciseData.exerciseId,
                order: exerciseData.position - 1, // Convert to 0-based index
              })
            );

            if (exerciseError || !workoutExercise) {
              return { ...DEFAULT_ACTION_STATE, error: 'Failed to add exercises to workout' };
            }

            // Add sets for this exercise
            const setsData = exerciseData.sets.map((set) => ({
              setNumber: set.setNumber,
              reps: set.reps,
              weight: set.weight,
            }));

            const [setsError] = await to(addSetsToWorkoutExercise(workoutExercise.id, setsData));

            if (setsError) {
              return { ...DEFAULT_ACTION_STATE, error: 'Failed to add sets to exercise' };
            }
          })
        );
      })
    );

    revalidatePath(`/routines/${routineId}`);
    revalidatePath('/routines');
    redirect(`/routines/${routineId}`);
  }
);
