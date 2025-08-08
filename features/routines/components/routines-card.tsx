'use client';

import { MoreVertical, Trash2 } from 'lucide-react';
import { Button } from '@/features/shared/components/ui/button';
import { Card } from '@/features/shared/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/features/shared/components/ui/dropdown-menu';
import { useDeleteRoutine } from '../hooks/use-routines';
import type { RoutineRecord } from '@/lib/db/queries/routines';

interface RoutineCardProps {
  routine: RoutineRecord;
}

export function RoutinesCard({ routine }: RoutineCardProps) {
  const deleteRoutineMutation = useDeleteRoutine();

  const handleDeleteRoutine = async () => {
    if (window.confirm(`Are you sure you want to delete "${routine.name}"?`)) {
      await deleteRoutineMutation.mutateAsync(routine.id);
    }
  };

  return (
    <Card className="bg-white border border-black hover:shadow-md transition-shadow duration-200">
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <h3 className="text-lg font-semibold text-black line-clamp-2">{routine.name}</h3>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-black hover:bg-gray-100">
                <MoreVertical className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="routines-light-theme bg-white border border-black">
              <DropdownMenuItem
                onClick={handleDeleteRoutine}
                className="text-red-600 hover:bg-red-50 hover:text-red-700"
                disabled={deleteRoutineMutation.isPending}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="space-y-3">
          <div className="text-sm text-gray-600">Created: {routine.createdAt.toLocaleDateString()}</div>

          <Button variant="outline" className="w-full border-black text-black hover:bg-gray-100" disabled>
            Add Workouts
          </Button>
        </div>
      </div>
    </Card>
  );
}
