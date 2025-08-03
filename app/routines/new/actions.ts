'use server';

import { createRoutine } from '@/lib/db/queries/routines';
import { createWorkout, addExerciseToWorkout, addSetsToWorkoutExercise } from '@/lib/db/queries/workouts';
import { parseWeeklyRoutineData } from '@/lib/validations/routines';
import { to, toSync, handleValidationError, protectedAction } from '@/lib/utils/error-handler';
import { redirect } from 'next/navigation';

const DEFAULT_ACTION_STATE = {
  error: null,
  fieldErrors: {},
};

export const createWeeklyRoutineAction = protectedAction(
  async (session, prevState: { error: string | null; fieldErrors?: Record<string, string[]> }, formData: FormData) => {
    const [validationError, validatedData] = toSync(() => parseWeeklyRoutineData(formData));
    const validationResult = handleValidationError(validationError, validatedData);

    if (validationResult || !validatedData) {
      return { ...DEFAULT_ACTION_STATE, ...validationResult };
    }

    // Create the routine
    const [routineError, routine] = await to(
      createRoutine({
        userId: session.user.id,
        name: validatedData.name,
      })
    );

    if (routineError || !routine) {
      return { ...DEFAULT_ACTION_STATE, error: 'Failed to create routine' };
    }

    // Create workouts for each day
    await Promise.all(
      validatedData.workouts.map(async (workoutData) => {
        const [workoutError, workout] = await to(
          createWorkout({
            routineId: routine.id,
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

    redirect('/routines');
  }
);
