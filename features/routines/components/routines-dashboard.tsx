'use client';

import { RoutinesList } from './routines-list';
import type { RoutineRecord } from '@/lib/db/queries/routines/get-user-routines';

interface RoutinesDashboardProps {
  routines: RoutineRecord[];
}

export function RoutinesDashboard({ routines }: RoutinesDashboardProps) {
  if (!routines || routines.length === 0) {
    return (
      <div className="routines-light-theme min-h-screen bg-white">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-black mb-2">My Routines</h1>
              <p className="text-gray-600">Manage and track your workout routines</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="routines-light-theme min-h-screen bg-white flex">
      <RoutinesList routines={routines} />
    </div>
  );
}
