'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { GripVertical, Plus, X, Dumbbell, Target, Move, ChevronDown, ChevronUp } from 'lucide-react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { getMuscleGroupColor } from '@/lib/utils/muscle-groups';
import type { Exercise } from '@/lib/db/schema/exercises';

export interface WorkoutExerciseConfig {
  id: string;
  exerciseId: string;
  name: string;
  muscleGroups: string[];
  position: number;
  sets: WorkoutSetConfig[];
}

export interface WorkoutSetConfig {
  id: string;
  setNumber: number;
  reps?: number;
  weight: number;
}

interface CreateWorkoutModalProps {
  exercises: Exercise[];
  onWorkoutCreated: (workout: { name: string; exercises: WorkoutExerciseConfig[] }) => void;
  trigger?: React.ReactNode;
}

export function CreateWorkoutModal({ exercises, onWorkoutCreated, trigger }: CreateWorkoutModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [workoutName, setWorkoutName] = useState('');
  const [selectedExercises, setSelectedExercises] = useState<WorkoutExerciseConfig[]>([]);
  const [isExerciseDialogOpen, setIsExerciseDialogOpen] = useState(false);
  const [expandedExercises, setExpandedExercises] = useState<Set<string>>(new Set());

  const createDefaultSets = (count: number): WorkoutSetConfig[] => {
    return Array.from({ length: count }, (_, index) => ({
      id: `${Date.now()}-${Math.random()}-${index}`,
      setNumber: index + 1,
      reps: 10,
      weight: 0,
    }));
  };

  const addExercise = (exercise: Exercise) => {
    const newExercise: WorkoutExerciseConfig = {
      id: `${Date.now()}-${Math.random()}`,
      exerciseId: exercise.id,
      name: exercise.name,
      muscleGroups: exercise.muscleGroups,
      position: selectedExercises.length + 1,
      sets: createDefaultSets(3),
    };

    setSelectedExercises((prev) => [...prev, newExercise]);
    setIsExerciseDialogOpen(false);
  };

  const updateSet = (exerciseId: string, setId: string, updates: Partial<WorkoutSetConfig>) => {
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
    setSelectedExercises((prev) => {
      const filtered = prev.filter((exercise) => exercise.id !== id);
      // Update positions after removal
      return filtered.map((exercise, index) => ({
        ...exercise,
        position: index + 1,
      }));
    });
  };

  const toggleExerciseExpansion = (exerciseId: string) => {
    setExpandedExercises((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(exerciseId)) {
        newSet.delete(exerciseId);
      } else {
        newSet.add(exerciseId);
      }
      return newSet;
    });
  };

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const items = Array.from(selectedExercises);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    // Update positions after reordering
    const updatedItems = items.map((item, index) => ({
      ...item,
      position: index + 1,
    }));

    setSelectedExercises(updatedItems);
  };

  const handleCreateWorkout = () => {
    if (!workoutName.trim() || selectedExercises.length === 0) return;

    onWorkoutCreated({
      name: workoutName,
      exercises: selectedExercises,
    });

    // Reset form
    setWorkoutName('');
    setSelectedExercises([]);
    setExpandedExercises(new Set());
    setIsOpen(false);
  };

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      // Reset form when closing
      setWorkoutName('');
      setSelectedExercises([]);
      setExpandedExercises(new Set());
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {trigger || (
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Create Workout
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-6xl max-h-[95vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Workout</DialogTitle>
          <DialogDescription>
            Build your workout by adding exercises and configuring sets, reps, and weights.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Workout Details */}
          <Card>
            <CardHeader>
              <CardTitle>Workout Details</CardTitle>
              <CardDescription>Basic information about your workout</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="workoutName">Workout Name</Label>
                  <Input
                    id="workoutName"
                    value={workoutName}
                    onChange={(e) => setWorkoutName(e.target.value)}
                    placeholder="e.g., Push Day, Upper Body"
                    required
                  />
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
                  <CardDescription>Add and configure exercises for your workout</CardDescription>
                </div>
                <Dialog open={isExerciseDialogOpen} onOpenChange={setIsExerciseDialogOpen}>
                  <DialogTrigger asChild>
                    <Button type="button">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Exercise
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Select Exercise</DialogTitle>
                      <DialogDescription>Choose an exercise to add to your workout</DialogDescription>
                    </DialogHeader>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
                                <Badge
                                  key={group}
                                  variant="secondary"
                                  className={`text-xs ${getMuscleGroupColor(group)}`}
                                >
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
                                  <Card className="border-2 border-gray-200">
                                    <CardContent className="p-4">
                                      <div className="flex items-center gap-3">
                                        <div>
                                          <GripVertical className="w-5 h-5 text-gray-400 cursor-grab" />
                                        </div>
                                        <div className="flex-1">
                                          <div className="flex items-center gap-2">
                                            <Badge variant="outline" className="text-xs">
                                              #{exercise.position}
                                            </Badge>
                                            <h4 className="font-semibold">{exercise.name}</h4>
                                          </div>
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
                                        <div className="flex items-center gap-2">
                                          <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => toggleExerciseExpansion(exercise.id)}
                                          >
                                            {expandedExercises.has(exercise.id) ? (
                                              <ChevronUp className="w-4 h-4" />
                                            ) : (
                                              <ChevronDown className="w-4 h-4" />
                                            )}
                                          </Button>
                                          <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => removeExercise(exercise.id)}
                                          >
                                            <X className="w-4 h-4" />
                                          </Button>
                                        </div>
                                      </div>

                                      {/* Expandable Sets Configuration */}
                                      {expandedExercises.has(exercise.id) && (
                                        <div className="mt-4 space-y-3 border-t pt-4">
                                          <div className="flex items-center justify-between">
                                            <Label className="text-sm font-medium">Sets Configuration</Label>
                                            <Button
                                              type="button"
                                              variant="outline"
                                              size="sm"
                                              onClick={() => addSet(exercise.id)}
                                            >
                                              <Plus className="w-4 h-4 mr-1" />
                                              Add Set
                                            </Button>
                                          </div>

                                          <div className="space-y-2">
                                            {exercise.sets.map((set) => (
                                              <div
                                                key={set.id}
                                                className="flex items-center gap-2 p-3 border rounded bg-gray-50"
                                              >
                                                <div className="w-8 text-sm font-medium text-gray-600">
                                                  Set {set.setNumber}
                                                </div>
                                                <div className="flex-1 grid grid-cols-2 gap-3">
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
                                                    />
                                                  </div>
                                                </div>
                                                {exercise.sets.length > 1 && (
                                                  <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => removeSet(exercise.id, set.id)}
                                                    className="text-red-500 hover:text-red-700"
                                                  >
                                                    <X className="w-4 h-4" />
                                                  </Button>
                                                )}
                                              </div>
                                            ))}
                                          </div>
                                        </div>
                                      )}
                                    </CardContent>
                                  </Card>
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
                <CardTitle>Workout Summary</CardTitle>
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
                  <div className="flex items-center gap-2">
                    <Move className="w-5 h-5 text-gray-500" />
                    <span className="text-sm text-gray-600">
                      {selectedExercises.reduce((total, ex) => total + ex.sets.length, 0)} working sets
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => handleOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateWorkout} disabled={!workoutName.trim() || selectedExercises.length === 0}>
              Create Workout
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
