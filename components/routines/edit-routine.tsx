'use client';

import { useActionState, useState } from 'react';
import { Button } from '@/components/ui/button';
import { WeeklyRoutinePresentation, type WeeklyWorkout } from './weekly-routine-presentation';
import { updateRoutineAction } from '@/app/routines/[id]/actions';
import { type WorkoutExerciseConfig } from '../routines-new/workout-builder';
import { RoutineDetail } from '@/lib/types/routines';
import type { Exercise } from '@/lib/db/schema/exercises';

interface EditRoutineProps {
  routineDetail: RoutineDetail;
  exercises: Exercise[];
}

type FormState = {
  error: string | null;
  fieldErrors?: Record<string, string[]>;
};

const initialState: FormState = {
  error: null,
  fieldErrors: {},
};

export function EditRoutine({ routineDetail, exercises }: EditRoutineProps) {
  const [routineName, setRoutineName] = useState(routineDetail.name);
  const [weeklyWorkouts, setWeeklyWorkouts] = useState<WeeklyWorkout[]>([]);

  const wrappedAction = async (prevState: FormState, formData: FormData): Promise<FormState> => {
    formData.append(
      'routineData',
      JSON.stringify({
        name: routineName,
        workouts: weeklyWorkouts,
      })
    );
    formData.append('routineId', routineDetail.id);
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
      <WeeklyRoutinePresentation
        exercises={exercises}
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
