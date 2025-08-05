// Types specific to create-routine.tsx component
import type { FormState } from './types';
import type { Exercise } from '@/lib/db/schema/exercises';

export interface CreateRoutineProps {
  exercises: Exercise[];
}

export type { FormState };
