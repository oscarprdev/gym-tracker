'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import { GripVertical, Plus, X, Dumbbell, Target, Edit } from 'lucide-react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { getMuscleGroupColor } from '@/lib/utils/muscle-groups';
import type { WorkoutExerciseConfig } from './types';

interface CreateWorkoutSidebarProps {
  selectedExercises: WorkoutExerciseConfig[];
  onWorkoutCreated: (workout: { name: string; exercises: WorkoutExerciseConfig[] }) => void;
  trigger?: React.ReactNode;
  onOpenExerciseSidebar: () => void;
  onExerciseRemoved: (exerciseId: string) => void;
  onExerciseReordered: (exercises: WorkoutExerciseConfig[]) => void;
  onOpenEditSidebar: (exercise: WorkoutExerciseConfig) => void;
  initialWorkoutName?: string;
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function CreateWorkoutSidebar({
  selectedExercises,
  onWorkoutCreated,
  trigger,
  onOpenExerciseSidebar,
  onExerciseRemoved,
  onExerciseReordered,
  onOpenEditSidebar,
  initialWorkoutName,
  isOpen: controlledIsOpen,
  onOpenChange: controlledOnOpenChange,
}: CreateWorkoutSidebarProps) {
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const [workoutName, setWorkoutName] = useState(initialWorkoutName || '');

  // Use controlled state if provided, otherwise use internal state
  const isOpen = controlledIsOpen !== undefined ? controlledIsOpen : internalIsOpen;
  const setIsOpen = controlledOnOpenChange || setInternalIsOpen;

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
      setWorkoutName(initialWorkoutName || '');
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
          <SheetTitle>{initialWorkoutName ? 'Edit Workout' : 'Create New Workout'}</SheetTitle>
        </SheetHeader>

        <div className="flex flex-col">
          <ScrollArea className="h-[80vh]">
            <div className="space-y-6 mt-6 pr-4">
              {/* Workout Details */}
              <Card size="small">
                <CardHeader>
                  <CardTitle>Workout Title</CardTitle>
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

                  {/* Minimalistic Summary at the top */}
                  {selectedExercises.length > 0 && (
                    <div className="flex items-center gap-4 text-sm text-gray-600 mt-2 pt-2 border-t">
                      <div className="flex items-center gap-1">
                        <Target className="w-4 h-4" />
                        <span>{selectedExercises.length} exercises</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Dumbbell className="w-4 h-4" />
                        <span>{selectedExercises.reduce((total, ex) => total + ex.sets.length, 0)} sets</span>
                      </div>
                    </div>
                  )}
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
                                      <Card className="border-2 border-gray-200" size="small">
                                        <CardContent className="p-3">
                                          <div className="flex items-center gap-3">
                                            <div>
                                              <GripVertical className="w-4 h-4 text-gray-400 cursor-grab" />
                                            </div>
                                            <div className="flex-1">
                                              <div className="flex items-center gap-2">
                                                <Badge variant="outline" className="text-xs">
                                                  #{exercise.position}
                                                </Badge>
                                                <h4 className="font-semibold text-sm">{exercise.name}</h4>
                                              </div>
                                            </div>
                                            <div className="flex items-center gap-1">
                                              <div className="flex flex-wrap gap-1">
                                                {exercise.muscleGroups.slice(0, 2).map((group) => (
                                                  <Badge
                                                    key={group}
                                                    variant="secondary"
                                                    className={`text-xs ${getMuscleGroupColor(group)}`}
                                                  >
                                                    {group}
                                                  </Badge>
                                                ))}
                                                {exercise.muscleGroups.length > 2 && (
                                                  <Badge variant="secondary" className="text-xs">
                                                    +{exercise.muscleGroups.length - 2}
                                                  </Badge>
                                                )}
                                              </div>
                                              <Badge variant="outline" className="text-xs ml-2">
                                                {exercise.sets.length} sets
                                              </Badge>
                                            </div>
                                            <div className="flex items-center gap-1">
                                              <Button
                                                type="button"
                                                variant="ghost"
                                                size="sm"
                                                className="h-8 w-8 p-0"
                                                onClick={() => onOpenEditSidebar(exercise)}
                                              >
                                                <Edit className="w-3 h-3" />
                                              </Button>
                                              <Button
                                                type="button"
                                                variant="ghost"
                                                size="sm"
                                                className="h-8 w-8 p-0"
                                                onClick={() => removeExercise(exercise.id)}
                                              >
                                                <X className="w-3 h-3" />
                                              </Button>
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
            </div>
          </ScrollArea>

          {/* Fixed Actions at the bottom */}
          <div className="flex justify-end gap-3 pt-4 border-t mt-6">
            <Button variant="outline" onClick={() => handleSidebarOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateWorkout} disabled={!workoutName.trim() || selectedExercises.length === 0}>
              {initialWorkoutName ? 'Update Workout' : 'Create Workout'}
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
