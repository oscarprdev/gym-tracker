// Shared types for routine components
// Used by: edit-routine.tsx, create-routine.tsx, weekly-routine-presentation.tsx

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

// Database routine structure (for pages and server components)
export interface WorkoutExerciseSet {
  id: string;
  setNumber: number;
  reps: number | null;
  weight: number;
}

export interface WorkoutExercise {
  id: string;
  order: number;
  exercise: {
    id: string;
    name: string;
    muscleGroups: string[];
  };
  sets: WorkoutExerciseSet[];
}

export interface Workout {
  id: string;
  name: string;
  dayOfWeek: number | null;
  order: number;
  exercises: WorkoutExercise[];
}

export interface RoutineDetail {
  id: string;
  userId: string;
  name: string;
  description: string | null;
  color: string | null;
  createdAt: Date;
  updatedAt: Date;
  workouts: Workout[];
}

// Form state types
export interface FormState {
  error: string | null;
  fieldErrors?: Record<string, string[]>;
}
