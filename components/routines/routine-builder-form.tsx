'use client';

import { useActionState, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { GripVertical, Plus, X, Dumbbell, Target, Trash2 } from 'lucide-react';
import { createRoutineWithExercisesAction } from '@/app/routines/actions';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { getMuscleGroupColor } from '@/lib/utils/muscle-groups';
import type { ExerciseConfig, SetConfig } from '@/lib/types';
import type { Exercise } from '@/lib/db/schema/exercises';

type FormState = {
  error: string | null;
  fieldErrors?: Record<string, string[]>;
};

interface RoutineBuilderFormProps {
  exercises: Exercise[];
  userId: string;
}

export function RoutineBuilderForm({ exercises, userId }: RoutineBuilderFormProps) {
  const [selectedExercises, setSelectedExercises] = useState<ExerciseConfig[]>([]);
  const [isExerciseDialogOpen, setIsExerciseDialogOpen] = useState(false);

  const wrappedAction = async (prevState: FormState, formData: FormData): Promise<FormState> => {
    formData.append('exercises', JSON.stringify(selectedExercises));
    formData.append('userId', userId);
    return await createRoutineWithExercisesAction(prevState, formData);
  };

  const [state, formAction, isPending] = useActionState(wrappedAction, {
    error: null,
    fieldErrors: {},
  });

  const createDefaultSets = (count: number): SetConfig[] => {
    return Array.from({ length: count }, (_, index) => ({
      id: `${Date.now()}-${Math.random()}-${index}`,
      setNumber: index + 1,
      reps: 10,
      weight: 0,
    }));
  };

  const addExercise = (exercise: Exercise) => {
    const newExercise: ExerciseConfig = {
      id: `${Date.now()}-${Math.random()}`,
      exerciseId: exercise.id,
      name: exercise.name,
      muscleGroups: exercise.muscleGroups,
      sets: createDefaultSets(3),
      notes: '',
    };

    setSelectedExercises((prev) => [...prev, newExercise]);
    setIsExerciseDialogOpen(false);
  };

  const updateExercise = (id: string, updates: Partial<ExerciseConfig>) => {
    setSelectedExercises((prev) =>
      prev.map((exercise) => (exercise.id === id ? { ...exercise, ...updates } : exercise))
    );
  };

  const updateSet = (exerciseId: string, setId: string, updates: Partial<SetConfig>) => {
    setSelectedExercises((prev) =>
      prev.map((exercise) =>
        exercise.id === exerciseId
          ? {
              ...exercise,
              sets: exercise.sets.map((set) => (set.id === setId ? { ...set, ...updates } : set)),
            }
          : exercise
      )
    );
  };

  const addSet = (exerciseId: string) => {
    setSelectedExercises((prev) =>
      prev.map((exercise) =>
        exercise.id === exerciseId
          ? {
              ...exercise,
              sets: [
                ...exercise.sets,
                {
                  id: `${Date.now()}-${Math.random()}`,
                  setNumber: exercise.sets.length + 1,
                  reps: 10,
                  weight: 0,
                },
              ],
            }
          : exercise
      )
    );
  };

  const removeSet = (exerciseId: string, setId: string) => {
    setSelectedExercises((prev) =>
      prev.map((exercise) =>
        exercise.id === exerciseId
          ? {
              ...exercise,
              sets: exercise.sets
                .filter((set) => set.id !== setId)
                .map((set, index) => ({ ...set, setNumber: index + 1 })),
            }
          : exercise
      )
    );
  };

  const removeExercise = (id: string) => {
    setSelectedExercises((prev) => prev.filter((exercise) => exercise.id !== id));
  };

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const items = Array.from(selectedExercises);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setSelectedExercises(items);
  };

  return (
    <form action={formAction} className="max-w-4xl mx-auto space-y-6">
      {/* Routine Details Form */}
      <Card>
        <CardHeader>
          <CardTitle>Routine Details</CardTitle>
          <CardDescription>Basic information about your routine</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Routine Name</Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="e.g., Upper Body Push"
                  required
                  disabled={isPending}
                  className={'fieldErrors' in state && state.fieldErrors?.name ? 'border-red-500' : ''}
                />
                {'fieldErrors' in state && state.fieldErrors?.name && (
                  <p className="text-sm text-red-500">{state.fieldErrors.name[0]}</p>
                )}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description (optional)</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Describe your routine..."
                rows={3}
                disabled={isPending}
                className={'fieldErrors' in state && state.fieldErrors?.description ? 'border-red-500' : ''}
              />
              {'fieldErrors' in state && state.fieldErrors?.description && (
                <p className="text-sm text-red-500">{state.fieldErrors.description[0]}</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Exercise Selection */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Exercises</CardTitle>
              <CardDescription>Add and configure exercises for your routine</CardDescription>
            </div>
            <Dialog open={isExerciseDialogOpen} onOpenChange={setIsExerciseDialogOpen}>
              <DialogTrigger asChild>
                <Button type="button">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Exercise
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Select Exercise</DialogTitle>
                  <DialogDescription>Choose an exercise to add to your routine</DialogDescription>
                </DialogHeader>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {exercises.map((exercise) => (
                    <Card
                      key={exercise.id}
                      className="cursor-pointer hover:shadow-md transition-shadow"
                      onClick={() => addExercise(exercise)}
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
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          {selectedExercises.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Dumbbell className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>No exercises added yet. Click &quot;Add Exercise&quot; to get started.</p>
            </div>
          ) : (
            <DragDropContext onDragEnd={handleDragEnd}>
              <Droppable droppableId="exercises">
                {(provided) => (
                  <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-3">
                    {selectedExercises.map((exercise, index) => (
                      <Draggable key={exercise.id} draggableId={exercise.id} index={index}>
                        {(provided) => (
                          <div ref={provided.innerRef} {...provided.draggableProps}>
                            <div {...provided.dragHandleProps}>
                              <div className="border rounded-lg p-4 bg-white">
                                <div className="flex items-center gap-3">
                                  <div>
                                    <GripVertical className="w-5 h-5 text-gray-400 cursor-grab" />
                                  </div>
                                  <div className="flex-1">
                                    <h4 className="font-semibold">{exercise.name}</h4>
                                    <div className="flex flex-wrap gap-1 mt-1">
                                      {exercise.muscleGroups.map((group) => (
                                        <Badge
                                          key={group}
                                          variant="secondary"
                                          className={`text-xs ${getMuscleGroupColor(group)}`}
                                        >
                                          {group}
                                        </Badge>
                                      ))}
                                    </div>
                                  </div>
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => removeExercise(exercise.id)}
                                    disabled={isPending}
                                  >
                                    <X className="w-4 h-4" />
                                  </Button>
                                </div>

                                {/* Sets Configuration */}
                                <div className="mt-4 space-y-3">
                                  <div className="flex items-center justify-between">
                                    <Label className="text-sm font-medium">Sets Configuration</Label>
                                    <Button
                                      type="button"
                                      variant="outline"
                                      size="sm"
                                      onClick={() => addSet(exercise.id)}
                                      disabled={isPending}
                                    >
                                      <Plus className="w-4 h-4 mr-1" />
                                      Add Set
                                    </Button>
                                  </div>

                                  <div className="space-y-2">
                                    {exercise.sets.map((set) => (
                                      <div
                                        key={set.id}
                                        className="flex items-center gap-2 p-2 border rounded bg-gray-50"
                                      >
                                        <div className="w-8 text-sm font-medium text-gray-600">Set {set.setNumber}</div>
                                        <div className="flex-1 grid grid-cols-2 gap-2">
                                          <div>
                                            <Label className="text-xs text-gray-600">Reps</Label>
                                            <Input
                                              type="number"
                                              value={set.reps || ''}
                                              onChange={(e) =>
                                                updateSet(exercise.id, set.id, {
                                                  reps: e.target.value ? parseInt(e.target.value) : undefined,
                                                })
                                              }
                                              min="1"
                                              max="1000"
                                              className="h-8"
                                              disabled={isPending}
                                            />
                                          </div>
                                          <div>
                                            <Label className="text-xs text-gray-600">Weight (lbs)</Label>
                                            <Input
                                              type="number"
                                              value={set.weight}
                                              onChange={(e) =>
                                                updateSet(exercise.id, set.id, {
                                                  weight: parseInt(e.target.value) || 0,
                                                })
                                              }
                                              min="0"
                                              max="9999"
                                              className="h-8"
                                              disabled={isPending}
                                            />
                                          </div>
                                        </div>
                                        {exercise.sets.length > 1 && (
                                          <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => removeSet(exercise.id, set.id)}
                                            disabled={isPending}
                                            className="text-red-500 hover:text-red-700"
                                          >
                                            <Trash2 className="w-4 h-4" />
                                          </Button>
                                        )}
                                      </div>
                                    ))}
                                  </div>
                                </div>

                                {/* Notes */}
                                <div className="mt-4">
                                  <Label className="text-xs text-gray-600">Notes (optional)</Label>
                                  <Textarea
                                    value={exercise.notes || ''}
                                    onChange={(e) => updateExercise(exercise.id, { notes: e.target.value })}
                                    placeholder="Add notes for this exercise..."
                                    rows={2}
                                    className="mt-1"
                                    disabled={isPending}
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          )}
        </CardContent>
      </Card>

      {/* Summary */}
      {selectedExercises.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Routine Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center gap-2">
                <Target className="w-5 h-5 text-gray-500" />
                <span className="text-sm text-gray-600">{selectedExercises.length} exercises</span>
              </div>
              <div className="flex items-center gap-2">
                <Dumbbell className="w-5 h-5 text-gray-500" />
                <span className="text-sm text-gray-600">
                  {selectedExercises.reduce((total, ex) => total + ex.sets.length, 0)} total sets
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Error Display */}
      {'error' in state && state.error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">{state.error}</div>
      )}

      {/* Submit Button */}
      <div className="flex justify-end">
        <Button type="submit" disabled={isPending || selectedExercises.length === 0} size="lg">
          {isPending ? 'Creating...' : 'Create Routine'}
        </Button>
      </div>
    </form>
  );
}
