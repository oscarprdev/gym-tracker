'use server';

import { createRoutine } from '@/lib/db/queries/routines';
import { createWorkout, addExerciseToWorkout, addSetsToWorkoutExercise } from '@/lib/db/queries/workouts';
import { parseCreateRoutine, parseExercisesData } from '@/lib/validations/routines';
import { to, toSync, handleValidationError, protectedAction } from '@/lib/utils/error-handler';
import { redirect } from 'next/navigation';
import type { ExerciseConfigInput } from '@/lib/validations/routines';

const DEFAULT_ACTION_STATE = {
  error: null,
  fieldErrors: {},
};

export const createRoutineWithWorkoutsAction = protectedAction(
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

    // Group exercises by workout (for now, create one workout with all exercises)
    // In the future, this could be enhanced to support multiple workouts
    const workoutName = (formData.get('workoutName') as string) || 'Workout 1';

    const [workoutError, workout] = await to(
      createWorkout({
        routineId: routine.id,
        name: workoutName,
        order: 1,
        description: `Workout for ${routine.name}`,
      })
    );

    if (workoutError || !workout) {
      return { ...DEFAULT_ACTION_STATE, error: 'Failed to create workout' };
    }

    await Promise.all(
      exercises.map(async (exercise: ExerciseConfigInput, index: number) => {
        const [exerciseError, workoutExercise] = await to(
          addExerciseToWorkout({
            workoutId: workout.id,
            exerciseId: exercise.exerciseId,
            order: index,
            notes: exercise.notes,
          })
        );

        if (exerciseError || !workoutExercise) {
          return { ...DEFAULT_ACTION_STATE, error: 'Failed to add exercises to workout' };
        }

        // Add sets for this exercise
        const setsData = exercise.sets.map((set) => ({
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

    redirect('/routines');
  }
);
