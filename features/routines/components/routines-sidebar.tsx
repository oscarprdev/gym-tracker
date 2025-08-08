'use client';

import { useState } from 'react';
import { Plus, MoreVertical, Trash2 } from 'lucide-react';
import { Button } from '@/features/shared/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/features/shared/components/ui/sheet';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/features/shared/components/ui/dropdown-menu';
import { CreateRoutineForm } from './create-routine-form';
import { useDeleteRoutine } from '../hooks/use-routines';
import type { RoutineRecord } from '@/lib/db/queries/routines/get-user-routines';

interface RoutinesSidebarProps {
  routines: RoutineRecord[];
  selectedRoutineId?: string;
  onRoutineSelect: (routineId: string) => void;
}

export function RoutinesSidebar({ routines, selectedRoutineId, onRoutineSelect }: RoutinesSidebarProps) {
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const deleteRoutineMutation = useDeleteRoutine();

  const handleCreateSuccess = () => {
    setIsSheetOpen(false);
  };

  const handleDeleteRoutine = async (routine: RoutineRecord) => {
    if (window.confirm(`Are you sure you want to delete "${routine.name}"?`)) {
      await deleteRoutineMutation.mutateAsync(routine.id);
    }
  };

  return (
    <div className="w-80 bg-gray-50 border-r border-black min-h-screen flex flex-col hidden md:flex">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-black mb-4">My Routines</h2>

        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
          <SheetTrigger asChild>
            <Button className="w-full bg-black text-white hover:bg-gray-800 border border-black">
              <Plus className="w-4 h-4 mr-2" />
              Create Routine
            </Button>
          </SheetTrigger>
          <SheetContent className="routines-light-theme bg-white border-l border-black">
            <SheetHeader>
              <SheetTitle className="text-black">Create New Routine</SheetTitle>
            </SheetHeader>
            <CreateRoutineForm onSuccess={handleCreateSuccess} />
          </SheetContent>
        </Sheet>
      </div>

      {/* Routines List */}
      <div className="flex-1 overflow-y-auto">
        {routines.length === 0 ? (
          <div className="p-6 text-center">
            <p className="text-gray-600 mb-4">No routines yet</p>
            <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" className="border-black text-black hover:bg-gray-100">
                  <Plus className="w-4 h-4 mr-2" />
                  Create First Routine
                </Button>
              </SheetTrigger>
            </Sheet>
          </div>
        ) : (
          <div className="p-4 space-y-2">
            {routines.map((routine) => (
              <div
                key={routine.id}
                className={`group flex items-center justify-between p-3 rounded-lg border transition-colors cursor-pointer ${
                  selectedRoutineId === routine.id
                    ? 'bg-white border-black shadow-sm'
                    : 'border-gray-200 hover:bg-white hover:border-gray-300'
                }`}
                onClick={() => onRoutineSelect(routine.id)}
              >
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-black truncate">{routine.name}</h3>
                  <p className="text-sm text-gray-600">Created {routine.createdAt.toLocaleDateString()}</p>
                </div>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 text-gray-400 hover:text-black hover:bg-gray-100 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="routines-light-theme bg-white border border-black">
                    <DropdownMenuItem
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteRoutine(routine);
                      }}
                      className="text-red-600 hover:bg-red-50 hover:text-red-700"
                      disabled={deleteRoutineMutation.isPending}
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
