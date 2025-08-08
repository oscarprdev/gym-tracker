'use client';

import { RoutineCard } from './routine-card';
import type { RoutineRecord } from '@/lib/db/queries/routines';

interface RoutinesListProps {
  routines: RoutineRecord[];
}

export function RoutinesList({ routines }: RoutinesListProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {routines.map((routine) => (
        <RoutineCard key={routine.id} routine={routine} />
      ))}
    </div>
  );
}
