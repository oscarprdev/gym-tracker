export interface ApiResponse<T = unknown> {
  data?: T;
  error?: string;
  success: boolean;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface SelectOption {
  value: string;
  label: string;
}

export type Prettify<T> = {
  [K in keyof T]: T[K];
} & {};

export type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

export type RequiredBy<T, K extends keyof T> = T & Required<Pick<T, K>>;

// Routine-related types
export interface RoutineStats {
  muscleGroups: string[];
  totalExercises: number;
  totalSets: number;
}

export interface Routine {
  id: string;
  name: string;
  description?: string | null;
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
  notes?: string;
}

export interface RoutineData {
  name: string;
  description: string;
  estimatedDuration: number | undefined;
}
