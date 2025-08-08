'use client';

import { useState } from 'react';
import { Plus, MoreVertical, Trash2 } from 'lucide-react';
import { Button } from '@/features/shared/components/ui/button';
import { Badge } from '@/features/shared/components/ui/badge';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/features/shared/components/ui/sheet';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/features/shared/components/ui/dropdown-menu';
import { CreateExerciseForm } from './create-exercise-form';
import { useDeleteExercise } from '../hooks/use-exercises';
import { getMuscleGroupColor } from '@/features/shared/utils/muscle-groups';
import type { ExerciseRecord } from '@/lib/db/queries/exercises/get-user-exercises';

interface ExercisesSidebarProps {
  exercises: ExerciseRecord[];
  selectedExerciseId?: string;
  onExerciseSelect: (exerciseId: string) => void;
}

export function ExercisesSidebar({ exercises, selectedExerciseId, onExerciseSelect }: ExercisesSidebarProps) {
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const deleteExerciseMutation = useDeleteExercise();

  const handleCreateSuccess = () => {
    setIsSheetOpen(false);
  };

  const handleDeleteExercise = async (exercise: ExerciseRecord) => {
    if (window.confirm(`Are you sure you want to delete "${exercise.name}"?`)) {
      await deleteExerciseMutation.mutateAsync(exercise.id);
    }
  };

  return (
    <div className="w-80 bg-gray-50 border-r border-black min-h-screen flex flex-col hidden md:flex">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-black mb-4">My Exercises</h2>

        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
          <SheetTrigger asChild>
            <Button className="w-full bg-black text-white hover:bg-gray-800 border border-black">
              <Plus className="w-4 h-4 mr-2" />
              Create Exercise
            </Button>
          </SheetTrigger>
          <SheetContent className="exercises-light-theme bg-white border-l border-black">
            <SheetHeader>
              <SheetTitle className="text-black">Create New Exercise</SheetTitle>
            </SheetHeader>
            <CreateExerciseForm onSuccess={handleCreateSuccess} />
          </SheetContent>
        </Sheet>
      </div>

      {/* Exercises List */}
      <div className="flex-1 overflow-y-auto">
        {exercises.length === 0 ? (
          <div className="p-6 text-center">
            <p className="text-gray-600 mb-4">No exercises yet</p>
            <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" className="border-black text-black hover:bg-gray-100">
                  <Plus className="w-4 h-4 mr-2" />
                  Create First Exercise
                </Button>
              </SheetTrigger>
            </Sheet>
          </div>
        ) : (
          <div className="p-4 space-y-2">
            {exercises.map((exercise) => (
              <div
                key={exercise.id}
                className={`group flex items-center justify-between p-3 rounded-lg border transition-colors cursor-pointer ${
                  selectedExerciseId === exercise.id
                    ? 'bg-white border-black shadow-sm'
                    : 'border-gray-200 hover:bg-white hover:border-gray-300'
                }`}
                onClick={() => onExerciseSelect(exercise.id)}
              >
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-black truncate">{exercise.name}</h3>
                  <div className="flex flex-wrap gap-1 mt-1 mb-2">
                    {exercise.muscleGroups.slice(0, 3).map((group) => (
                      <Badge key={group} variant="secondary" className={`text-xs ${getMuscleGroupColor(group)}`}>
                        {group}
                      </Badge>
                    ))}
                    {exercise.muscleGroups.length > 3 && (
                      <Badge variant="secondary" className="text-xs bg-gray-100 text-gray-600">
                        +{exercise.muscleGroups.length - 3}
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-gray-600">Created {exercise.createdAt.toLocaleDateString()}</p>
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
                  <DropdownMenuContent align="end" className="exercises-light-theme bg-white border border-black">
                    <DropdownMenuItem
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteExercise(exercise);
                      }}
                      className="text-red-600 hover:bg-red-50 hover:text-red-700"
                      disabled={deleteExerciseMutation.isPending}
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
