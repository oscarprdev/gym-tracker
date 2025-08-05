'use client';

import { useActionState, useState } from 'react';
import { Button } from '@/components/ui/button';
import { WeeklyRoutinePresentation } from './weekly-routine-presentation';
import { createWeeklyRoutineAction } from '@/app/routines/new/actions';
import type { CreateRoutineProps, FormState } from './create-routine.types';
import type { WeeklyWorkout, WorkoutExerciseConfig } from './types';

const initialState: FormState = {
  error: null,
  fieldErrors: {},
};

export function CreateRoutine({ exercises }: CreateRoutineProps) {
  const [routineName, setRoutineName] = useState('');
  const [weeklyWorkouts, setWeeklyWorkouts] = useState<WeeklyWorkout[]>([]);

  const wrappedAction = async (prevState: FormState, formData: FormData): Promise<FormState> => {
    formData.append(
      'routineData',
      JSON.stringify({
        name: routineName,
        workouts: weeklyWorkouts,
      })
    );
    return await createWeeklyRoutineAction(prevState, formData);
  };

  const [state, formAction, isPending] = useActionState(wrappedAction, initialState);

  const handleWorkoutUpdated = (workoutId: string, workout: { name: string; exercises: WorkoutExerciseConfig[] }) => {
    setWeeklyWorkouts((prev) =>
      prev.map((w) =>
        w.id === workoutId
          ? {
              ...w,
              name: workout.name,
              exercises: workout.exercises,
            }
          : w
      )
    );
  };

  const handleWorkoutRemoved = (workoutId: string) => {
    setWeeklyWorkouts((prev) => prev.filter((w) => w.id !== workoutId));
  };

  return (
    <div className="space-y-6">
      <WeeklyRoutinePresentation
        exercises={exercises}
        routineName={routineName}
        onRoutineNameChange={setRoutineName}
        weeklyWorkouts={weeklyWorkouts}
        onWeeklyWorkoutsChange={setWeeklyWorkouts}
        onWorkoutUpdated={handleWorkoutUpdated}
        onWorkoutRemoved={handleWorkoutRemoved}
        isPending={isPending}
        mode="create"
      />

      {/* Save Button */}
      <form action={formAction}>
        <Button
          type="submit"
          disabled={isPending || !routineName.trim() || weeklyWorkouts.length === 0}
          className="w-full"
        >
          {isPending ? 'Creating...' : 'Create Routine'}
        </Button>
        {state?.error && <p className="text-sm text-red-600 mt-2 text-center">{state.error}</p>}
      </form>
    </div>
  );
}
