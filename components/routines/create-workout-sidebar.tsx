'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import { GripVertical, Plus, X, Dumbbell, Target, Move, Edit } from 'lucide-react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { getMuscleGroupColor } from '@/lib/utils/muscle-groups';

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

interface CreateWorkoutSidebarProps {
  selectedExercises: WorkoutExerciseConfig[];
  onWorkoutCreated: (workout: { name: string; exercises: WorkoutExerciseConfig[] }) => void;
  trigger?: React.ReactNode;
  onOpenExerciseSidebar: () => void;
  onExerciseRemoved: (exerciseId: string) => void;
  onExerciseReordered: (exercises: WorkoutExerciseConfig[]) => void;
  onOpenEditSidebar: (exercise: WorkoutExerciseConfig) => void;
}

export function CreateWorkoutSidebar({
  selectedExercises,
  onWorkoutCreated,
  trigger,
  onOpenExerciseSidebar,
  onExerciseRemoved,
  onExerciseReordered,
  onOpenEditSidebar,
}: CreateWorkoutSidebarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [workoutName, setWorkoutName] = useState('');

  const removeExercise = (id: string) => {
    onExerciseRemoved(id);
  };

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const items = Array.from(selectedExercises);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    const updatedItems = items.map((item, index) => ({
      ...item,
      position: index + 1,
    }));

    onExerciseReordered(updatedItems);
  };

  const handleCreateWorkout = () => {
    if (!workoutName.trim() || selectedExercises.length === 0) return;

    onWorkoutCreated({
      name: workoutName,
      exercises: selectedExercises,
    });

    setWorkoutName('');
    setIsOpen(false);
  };

  const handleSidebarOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      setWorkoutName('');
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={handleSidebarOpenChange}>
      <SheetTrigger asChild>
        {trigger || (
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Create Workout
          </Button>
        )}
      </SheetTrigger>
      <SheetContent side="right">
        <SheetHeader>
          <SheetTitle>Create New Workout</SheetTitle>
          <SheetDescription>
            Build your workout by adding exercises and configuring sets, reps, and weights.
          </SheetDescription>
        </SheetHeader>

        <ScrollArea className="h-full">
          <div className="space-y-6 mt-6 pr-4">
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
                  <Button type="button" onClick={onOpenExerciseSidebar}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Exercise
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {selectedExercises?.length === 0 ? (
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
                                              onClick={() => onOpenEditSidebar(exercise)}
                                            >
                                              <Edit className="w-4 h-4" />
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

                                        {/* Exercise Summary */}
                                        <div className="mt-3 pt-3 border-t">
                                          <div className="flex items-center justify-between text-sm text-gray-600">
                                            <span>{exercise.sets.length} sets</span>
                                            <span>~{exercise.sets.length * 2 + 1} min</span>
                                          </div>
                                        </div>
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
                  <div className="grid grid-cols-1 gap-4">
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
            <div className="flex justify-end gap-3 pt-4 border-t pb-6">
              <Button variant="outline" onClick={() => handleSidebarOpenChange(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateWorkout} disabled={!workoutName.trim() || selectedExercises.length === 0}>
                Create Workout
              </Button>
            </div>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
