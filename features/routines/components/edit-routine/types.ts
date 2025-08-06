// Types specific to edit-routine.tsx component
import type { WeeklyWorkout } from '../types';

export interface FormState {
  error: string | null;
  fieldErrors?: Record<string, string[]>;
}

export interface EditRoutineProps {
  routineName: string;
  routineId: string;
  weeklyWorkouts: WeeklyWorkout[];
}
