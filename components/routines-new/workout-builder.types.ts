// Types specific to workout-builder.tsx component
import type { WorkoutExerciseConfig } from './types';
import type { Exercise } from '@/lib/db/schema/exercises';

export interface WorkoutBuilderProps {
  exercises: Exercise[];
  onWorkoutCreated: (workout: { name: string; exercises: WorkoutExerciseConfig[] }) => void;
  trigger?: React.ReactNode;
  initialWorkout?: {
    name: string;
    exercises: WorkoutExerciseConfig[];
  };
}

export type { WorkoutExerciseConfig };
