// Types for weekly-routine-builder components

import type { Exercise } from '@/lib/db/schema/exercises';

export interface WorkoutSetConfig {
  id: string;
  setNumber: number;
  reps?: number;
  weight: number;
}

export interface WorkoutExerciseConfig {
  id: string;
  exerciseId: string;
  name: string;
  muscleGroups: string[];
  position: number;
  sets: WorkoutSetConfig[];
}

export interface WeeklyWorkout {
  id: string;
  name: string;
  dayOfWeek: number; // 0 = Sunday, 1 = Monday, etc.
  exercises: WorkoutExerciseConfig[];
}

export interface WeeklyRoutineFormState {
  error: string | null;
  fieldErrors?: Record<string, string[]>;
}

export interface WorkoutBuilderProps {
  onWorkoutCreated: (workout: { name: string; exercises: WorkoutExerciseConfig[] }) => void;
  trigger?: React.ReactNode;
  initialWorkout?: {
    name: string;
    exercises: WorkoutExerciseConfig[];
  };
}

export type WeeklyRoutineBuilderProps = Record<string, never>;

export interface ExerciseSelectionSidebarProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onExerciseSelected: (exercise: Exercise) => void;
}

export interface CreateWorkoutSidebarProps {
  selectedExercises: WorkoutExerciseConfig[];
  onWorkoutCreated: (workout: { name: string; exercises: WorkoutExerciseConfig[] }) => void;
  trigger?: React.ReactNode;
  onOpenExerciseSidebar: () => void;
  onExerciseRemoved: (exerciseId: string) => void;
  onExerciseReordered: (exercises: WorkoutExerciseConfig[]) => void;
  onOpenEditSidebar: (exercise: WorkoutExerciseConfig) => void;
  initialWorkoutName?: string;
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export interface ExerciseEditSidebarProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  exercise: WorkoutExerciseConfig | null;
  onExerciseUpdated: (exerciseId: string, updates: Partial<WorkoutExerciseConfig>) => void;
}
