// Types for routines-list component

import type { Routine } from '@/lib/types';
import type { Exercise } from '@/lib/db/schema/exercises';

export interface RoutinesListProps {
  routines: Routine[];
  exercises: Exercise[];
}
