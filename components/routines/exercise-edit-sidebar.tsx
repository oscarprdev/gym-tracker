'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Plus, X, ArrowLeft } from 'lucide-react';
import { getMuscleGroupColor } from '@/lib/utils/muscle-groups';
import type { WorkoutExerciseConfig, WorkoutSetConfig } from './create-workout-sidebar';

interface ExerciseEditSidebarProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  exercise: WorkoutExerciseConfig | null;
  onExerciseUpdated: (exerciseId: string, updates: Partial<WorkoutExerciseConfig>) => void;
}

export function ExerciseEditSidebar({ isOpen, onOpenChange, exercise, onExerciseUpdated }: ExerciseEditSidebarProps) {
  if (!exercise) return null;

  const updateSet = (setId: string, updates: Partial<WorkoutSetConfig>) => {
    const updatedExercise = {
      ...exercise,
      sets: exercise.sets.map((set) => (set.id === setId ? { ...set, ...updates } : set)),
    };
    onExerciseUpdated(exercise.id, updatedExercise);
  };

  const addSet = () => {
    const newSet: WorkoutSetConfig = {
      id: `${Date.now()}-${Math.random()}`,
      setNumber: exercise.sets.length + 1,
      reps: 10,
      weight: 0,
    };

    const updatedExercise = {
      ...exercise,
      sets: [...exercise.sets, newSet],
    };

    onExerciseUpdated(exercise.id, updatedExercise);
  };

  const removeSet = (setId: string) => {
    const updatedExercise = {
      ...exercise,
      sets: exercise.sets.filter((set) => set.id !== setId).map((set, index) => ({ ...set, setNumber: index + 1 })),
    };

    onExerciseUpdated(exercise.id, updatedExercise);
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
              <SheetTitle>Edit Exercise</SheetTitle>
              <SheetDescription>Configure sets, reps, and weights for {exercise.name}</SheetDescription>
            </div>
          </div>
        </SheetHeader>

        <ScrollArea className="h-full">
          <div className="mt-6 space-y-6 pr-4 pb-6">
            {/* Exercise Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">{exercise.name}</CardTitle>
                <CardDescription>Exercise details and muscle groups</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-1">
                  {exercise.muscleGroups.map((group) => (
                    <Badge key={group} variant="secondary" className={`text-xs ${getMuscleGroupColor(group)}`}>
                      {group}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Sets Configuration */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Sets Configuration</CardTitle>
                    <CardDescription>Configure reps and weights for each set</CardDescription>
                  </div>
                  <Button type="button" variant="outline" size="sm" onClick={addSet}>
                    <Plus className="w-4 h-4 mr-1" />
                    Add Set
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {exercise.sets.map((set) => (
                    <div key={set.id} className="flex items-center gap-3 p-4 border rounded-lg bg-gray-50">
                      <div className="w-12 text-sm font-medium text-gray-600 text-center">Set {set.setNumber}</div>
                      <div className="flex-1 grid grid-cols-2 gap-4">
                        <div>
                          <Label className="text-xs text-gray-600">Reps</Label>
                          <Input
                            type="number"
                            value={set.reps || ''}
                            onChange={(e) =>
                              updateSet(set.id, {
                                reps: e.target.value ? parseInt(e.target.value) : undefined,
                              })
                            }
                            min="1"
                            max="1000"
                            className="h-9"
                          />
                        </div>
                        <div>
                          <Label className="text-xs text-gray-600">Weight (lbs)</Label>
                          <Input
                            type="number"
                            value={set.weight}
                            onChange={(e) =>
                              updateSet(set.id, {
                                weight: parseInt(e.target.value) || 0,
                              })
                            }
                            min="0"
                            max="9999"
                            className="h-9"
                          />
                        </div>
                      </div>
                      {exercise.sets.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeSet(set.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Total Sets</span>
                    <span className="font-medium">{exercise.sets.length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Estimated Time</span>
                    <span className="font-medium">~{exercise.sets.length * 2 + 1} min</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
