// Shared types for routines-new components
// Used by: workout-builder.tsx, create-workout-sidebar.tsx, exercise-edit-sidebar.tsx, weekly-routine-builder.tsx

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

// Exercise reference from database schema - import from actual schema
// export interface Exercise {
//   id: string;
//   name: string;
//   muscleGroups: string[];
// }

// Form state types
export interface FormState {
  error: string | null;
  fieldErrors?: Record<string, string[]>;
}
