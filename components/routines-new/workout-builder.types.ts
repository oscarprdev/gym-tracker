// Types specific to workout-builder.tsx component
import type { WorkoutExerciseConfig } from './types';

export interface WorkoutBuilderProps {
  onWorkoutCreated: (workout: { name: string; exercises: WorkoutExerciseConfig[] }) => void;
  trigger?: React.ReactNode;
  initialWorkout?: {
    name: string;
    exercises: WorkoutExerciseConfig[];
  };
}

export type { WorkoutExerciseConfig };
