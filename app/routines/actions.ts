'use server';

import { createRoutine, addExerciseToRoutine, addSetsToRoutineExercise } from '@/lib/db/queries/routines';
import { parseCreateRoutine, parseExercisesData } from '@/lib/validations/routines';
import { to, toSync, handleValidationError, protectedAction } from '@/lib/utils/error-handler';
import { redirect } from 'next/navigation';
import type { ExerciseConfigInput } from '@/lib/validations/routines';

const DEFAULT_ACTION_STATE = {
  error: null,
  fieldErrors: {},
};

export const createRoutineWithExercisesAction = protectedAction(
  async (session, prevState: { error: string | null; fieldErrors?: Record<string, string[]> }, formData: FormData) => {
    const [validationError, validatedData] = toSync(() => parseCreateRoutine(formData));
    const validationResult = handleValidationError(validationError, validatedData);

    if (validationResult || !validatedData) {
      return { ...DEFAULT_ACTION_STATE, ...validationResult };
    }

    const [error, routine] = await to(createRoutine(validatedData));

    if (error || !routine) {
      return { ...DEFAULT_ACTION_STATE, error: 'Failed to create routine' };
    }

    const [exercisesValidationError, exercises] = toSync(() => parseExercisesData(formData));
    const exercisesValidationResult = handleValidationError(exercisesValidationError, exercises);

    if (exercisesValidationResult || !exercises) {
      return { ...DEFAULT_ACTION_STATE, ...exercisesValidationResult };
    }

    await Promise.all(
      exercises.map(async (exercise: ExerciseConfigInput, index: number) => {
        const [exerciseError, routineExercise] = await to(
          addExerciseToRoutine({
            routineId: routine.id,
            exerciseId: exercise.exerciseId,
            order: index,
            notes: exercise.notes,
          })
        );

        if (exerciseError || !routineExercise) {
          return { ...DEFAULT_ACTION_STATE, error: 'Failed to add exercises to routine' };
        }

        // Add sets for this exercise
        const setsData = exercise.sets.map((set) => ({
          setNumber: set.setNumber,
          reps: set.reps,
          weight: set.weight,
        }));

        const [setsError] = await to(addSetsToRoutineExercise(routineExercise.id, setsData));

        if (setsError) {
          return { ...DEFAULT_ACTION_STATE, error: 'Failed to add sets to exercise' };
        }
      })
    );

    redirect('/routines');
  }
);
