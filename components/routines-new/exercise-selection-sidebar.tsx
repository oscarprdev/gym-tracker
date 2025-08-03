'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ArrowLeft } from 'lucide-react';
import { getMuscleGroupColor } from '@/lib/utils/muscle-groups';
import type { Exercise } from '@/lib/db/schema/exercises';

interface ExerciseSelectionSidebarProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  exercises: Exercise[];
  onExerciseSelected: (exercise: Exercise) => void;
}

export function ExerciseSelectionSidebar({
  isOpen,
  onOpenChange,
  exercises,
  onExerciseSelected,
}: ExerciseSelectionSidebarProps) {
  const handleExerciseClick = (exercise: Exercise) => {
    onExerciseSelected(exercise);
    onOpenChange(false);
  };

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent side="right">
        <SheetHeader>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onOpenChange(false)}
              className="p-1 h-8 w-8 rounded-md hover:bg-gray-100 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div>
              <SheetTitle>Select Exercise</SheetTitle>
              <SheetDescription>Choose an exercise to add to your workout</SheetDescription>
            </div>
          </div>
        </SheetHeader>

        <ScrollArea className="h-full">
          <div className="mt-6 space-y-4 pr-4 pb-6">
            {exercises.map((exercise) => (
              <Card
                key={exercise.id}
                className="cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => handleExerciseClick(exercise)}
              >
                <CardContent className="p-4">
                  <h4 className="font-semibold mb-2">{exercise.name}</h4>
                  <div className="flex flex-wrap gap-1">
                    {exercise.muscleGroups.map((group: string) => (
                      <Badge key={group} variant="secondary" className={`text-xs ${getMuscleGroupColor(group)}`}>
                        {group}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
