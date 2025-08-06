'use client';

import { useActionState, useState } from 'react';
import { Button } from '@/features/shared/components/ui/button';
import { TrelloWeeklyRoutine } from '../trello-weekly-routine';
import { updateRoutineAction } from '@/features/routines/services/actions';
import type { EditRoutineProps, FormState } from './types';
import type { WeeklyWorkout, WorkoutExerciseConfig } from '../types';

const initialState: FormState = {
  error: null,
  fieldErrors: {},
};

export function EditRoutine({
  routineName: initialRoutineName,
  routineId,
  weeklyWorkouts: initialWeeklyWorkouts,
}: EditRoutineProps) {
  const [routineName, setRoutineName] = useState(initialRoutineName);
  const [weeklyWorkouts, setWeeklyWorkouts] = useState<WeeklyWorkout[]>(initialWeeklyWorkouts);

  const wrappedAction = async (prevState: FormState, formData: FormData): Promise<FormState> => {
    formData.append(
      'routineData',
      JSON.stringify({
        name: routineName,
        workouts: weeklyWorkouts,
      })
    );
    formData.append('routineId', routineId);
    return await updateRoutineAction(prevState, formData);
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
      <TrelloWeeklyRoutine
        routineName={routineName}
        onRoutineNameChange={setRoutineName}
        weeklyWorkouts={weeklyWorkouts}
        onWeeklyWorkoutsChange={setWeeklyWorkouts}
        onWorkoutUpdated={handleWorkoutUpdated}
        onWorkoutRemoved={handleWorkoutRemoved}
        isPending={isPending}
        mode="edit"
      />

      {/* Save Button */}
      <form action={formAction}>
        <Button
          type="submit"
          disabled={isPending || !routineName.trim() || weeklyWorkouts.length === 0}
          className="w-full"
        >
          {isPending ? 'Updating...' : 'Update Routine'}
        </Button>
        {state?.error && <p className="text-sm text-red-600 mt-2 text-center">{state.error}</p>}
      </form>
    </div>
  );
}
