'use client';

import { useState } from 'react';
import { Plus, MoreVertical, Trash2, Dumbbell } from 'lucide-react';
import { Button } from '@/features/shared/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/features/shared/components/ui/sheet';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/features/shared/components/ui/dropdown-menu';
import { CreateWorkoutForm } from './create-workout-form';
import type { WorkoutRecord } from '@/lib/db/queries/workouts';

interface WorkoutsSidebarProps {
  routineId: string;
  routineName: string;
  workouts: WorkoutRecord[];
  selectedWorkoutId?: string;
  onWorkoutSelect: (workoutId: string) => void;
}

export function WorkoutsSidebar({
  routineId,
  routineName,
  workouts,
  selectedWorkoutId,
  onWorkoutSelect,
}: WorkoutsSidebarProps) {
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const handleCreateSuccess = () => {
    setIsSheetOpen(false);
  };

  const handleDeleteWorkout = async (workout: WorkoutRecord) => {
    if (window.confirm(`Are you sure you want to delete "${workout.name}"?`)) {
      // TODO: Implement delete workout mutation
      console.log('Delete workout:', workout.id);
    }
  };

  return (
    <div className="w-80 bg-gray-50 border-r border-black min-h-screen flex flex-col hidden md:flex">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-black mb-2">{routineName}</h2>
        <p className="text-sm text-gray-600 mb-4">Workouts</p>

        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
          <SheetTrigger asChild>
            <Button className="w-full bg-black text-white hover:bg-gray-800 border border-black">
              <Plus className="w-4 h-4 mr-2" />
              Create Workout
            </Button>
          </SheetTrigger>
          <SheetContent className="routines-light-theme bg-white border-l border-black">
            <SheetHeader>
              <SheetTitle className="text-black">Create New Workout</SheetTitle>
            </SheetHeader>
            <CreateWorkoutForm routineId={routineId} onSuccess={handleCreateSuccess} />
          </SheetContent>
        </Sheet>
      </div>

      {/* Workouts List */}
      <div className="flex-1 overflow-y-auto">
        {workouts.length === 0 ? (
          <div className="p-6 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Dumbbell className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-600 mb-4">No workouts yet</p>
            <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" className="border-black text-black hover:bg-gray-100">
                  <Plus className="w-4 h-4 mr-2" />
                  Create First Workout
                </Button>
              </SheetTrigger>
            </Sheet>
          </div>
        ) : (
          <div className="p-4 space-y-2">
            {workouts.map((workout) => (
              <div
                key={workout.id}
                className={`group flex items-center justify-between p-3 rounded-lg border transition-colors cursor-pointer ${
                  selectedWorkoutId === workout.id
                    ? 'bg-white border-black shadow-sm'
                    : 'border-gray-200 hover:bg-white hover:border-gray-300'
                }`}
                onClick={() => onWorkoutSelect(workout.id)}
              >
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-black truncate">{workout.name}</h3>
                  <p className="text-sm text-gray-600">
                    {workout.dayOfWeek !== null ? `Day ${workout.dayOfWeek + 1}` : 'Unscheduled'} • Order{' '}
                    {workout.order}
                  </p>
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
                        handleDeleteWorkout(workout);
                      }}
                      className="text-red-600 hover:bg-red-50 hover:text-red-700"
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
