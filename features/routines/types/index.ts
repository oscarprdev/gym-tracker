// Routine-related types
export interface RoutineStats {
  muscleGroups: string[];
  totalExercises: number;
  totalSets: number;
}

export interface Routine {
  id: string;
  name: string;
  estimatedDuration?: number | null;
  color?: string | null;
  stats?: RoutineStats;
}

export interface SetConfig {
  id: string;
  setNumber: number;
  reps?: number;
  weight: number;
}

export interface ExerciseConfig {
  id: string;
  exerciseId: string;
  name: string;
  muscleGroups: string[];
  sets: SetConfig[];
}

export interface RoutineData {
  name: string;
  description: string;
  estimatedDuration: number | undefined;
}
