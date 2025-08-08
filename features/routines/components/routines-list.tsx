'use client';

import { Plus } from 'lucide-react';
import { Button } from '@/features/shared/components/ui/button';
import { useSidebar } from '@/features/shared/providers/sidebar-provider';
import { SidebarKinds } from '@/features/shared';

export function RoutinesList() {
  const { toggleRoutineSidebar, routines } = useSidebar();

  const onCreateRoutine = () => {
    toggleRoutineSidebar({ isOpen: true, kind: SidebarKinds.create });
  };

  const onRoutineSelect = async (routineId: string) => {
    // TODO: Implement routine select in server action
    console.log('routineId', routineId);
  };

  return (
    <div className="flex-1 bg-white overflow-y-auto">
      <div className="border-b border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold text-black">My routines</h1>
          <Button onClick={onCreateRoutine}>
            <Plus className="w-4 h-4" />
            Create routine
          </Button>
        </div>
      </div>
      <div className="p-4 md:p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {routines?.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600">No routines found</p>
            </div>
          ) : (
            routines.map((routine) => (
              <button
                onClick={() => onRoutineSelect(routine.id)}
                key={routine.id}
                className="bg-white border border-gray-200 rounded-lg p-4"
              >
                <h2 className="text-lg font-semibold text-black">{routine.name}</h2>
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
