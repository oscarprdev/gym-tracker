// Types specific to weekly-routine-presentation.tsx component
import type { WeeklyWorkout, WorkoutExerciseConfig } from './types';

export interface WeeklyRoutinePresentationProps {
  routineName: string;
  onRoutineNameChange: (name: string) => void;
  weeklyWorkouts: WeeklyWorkout[];
  onWeeklyWorkoutsChange: (workouts: WeeklyWorkout[]) => void;
  onWorkoutUpdated: (workoutId: string, workout: { name: string; exercises: WorkoutExerciseConfig[] }) => void;
  onWorkoutRemoved: (workoutId: string) => void;
  isPending?: boolean;
  mode: 'create' | 'edit';
}

export type { WeeklyWorkout, WorkoutExerciseConfig };
