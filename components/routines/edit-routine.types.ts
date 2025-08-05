// Types specific to edit-routine.tsx component
import type { WeeklyWorkout, FormState } from './types';
import type { Exercise } from '@/lib/db/schema/exercises';

export interface EditRoutineProps {
  routineName: string;
  routineId: string;
  weeklyWorkouts: WeeklyWorkout[];
  exercises: Exercise[];
}

export type { FormState };
