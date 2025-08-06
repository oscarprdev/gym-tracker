// Types specific to edit-routine.tsx component
import type { WeeklyWorkout, FormState } from './types';

export interface EditRoutineProps {
  routineName: string;
  routineId: string;
  weeklyWorkouts: WeeklyWorkout[];
}

export type { FormState };
