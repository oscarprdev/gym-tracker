'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar, Plus, X, Dumbbell, Target, Clock, CalendarDays, Edit } from 'lucide-react';
import { WorkoutBuilder } from '../routines-new/workout-builder';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import type { WeeklyRoutinePresentationProps } from './weekly-routine-presentation.types';
import type { WeeklyWorkout, WorkoutExerciseConfig } from './types';

const DAYS_OF_WEEK = [
  { value: 1, label: 'Monday', shortLabel: 'Mon' },
  { value: 2, label: 'Tuesday', shortLabel: 'Tue' },
  { value: 3, label: 'Wednesday', shortLabel: 'Wed' },
  { value: 4, label: 'Thursday', shortLabel: 'Thu' },
  { value: 5, label: 'Friday', shortLabel: 'Fri' },
  { value: 6, label: 'Saturday', shortLabel: 'Sat' },
  { value: 0, label: 'Sunday', shortLabel: 'Sun' },
];

export function WeeklyRoutinePresentation({
  exercises,
  routineName,
  onRoutineNameChange,
  weeklyWorkouts,
  onWeeklyWorkoutsChange,
  onWorkoutUpdated,
  onWorkoutRemoved,
  isPending = false,
  mode,
}: WeeklyRoutinePresentationProps) {
  const [editingWorkout, setEditingWorkout] = useState<WeeklyWorkout | null>(null);

  const handleWorkoutCreated = (workout: { name: string; exercises: WorkoutExerciseConfig[] }) => {
    // Find the next available day
    const usedDays = weeklyWorkouts.map((w) => w.dayOfWeek);
    let nextDay = 1; // Start with Monday

    // Find the first available day
    for (let day = 1; day <= 7; day++) {
      const dayOfWeek = day === 7 ? 0 : day; // Sunday is 0
      if (!usedDays.includes(dayOfWeek)) {
        nextDay = dayOfWeek;
        break;
      }
    }

    const newWorkout: WeeklyWorkout = {
      id: crypto.randomUUID(),
      name: workout.name,
      dayOfWeek: nextDay,
      exercises: workout.exercises,
    };

    onWeeklyWorkoutsChange([...weeklyWorkouts, newWorkout]);
  };

  const handleWorkoutUpdated = (updatedWorkout: { name: string; exercises: WorkoutExerciseConfig[] }) => {
    if (editingWorkout) {
      onWorkoutUpdated(editingWorkout.id, updatedWorkout);
      setEditingWorkout(null);
    }
  };

  const handleEditWorkout = (workout: WeeklyWorkout) => {
    setEditingWorkout(workout);
  };

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const { source, destination } = result;
    const originDay = parseInt(source.droppableId);
    const destinationDay = parseInt(destination.droppableId);

    // If moving within the same day, just reorder
    if (originDay === destinationDay) {
      const dayWorkouts = weeklyWorkouts.filter((w) => w.dayOfWeek === originDay);
      const [movedWorkout] = dayWorkouts.splice(source.index, 1);
      dayWorkouts.splice(destination.index, 0, movedWorkout);

      onWeeklyWorkoutsChange([...weeklyWorkouts.filter((w) => w.dayOfWeek !== originDay), ...dayWorkouts]);
    } else {
      // Moving between days
      const sourceWorkouts = weeklyWorkouts.filter((w) => w.dayOfWeek === originDay);
      const [movedWorkout] = sourceWorkouts.splice(source.index, 1);

      // Create a new workout object to avoid reference issues
      const updatedWorkout = {
        ...movedWorkout,
        dayOfWeek: destinationDay,
      };

      const destinationWorkouts = weeklyWorkouts.filter((w) => w.dayOfWeek === destinationDay);
      destinationWorkouts.splice(destination.index, 0, updatedWorkout);

      onWeeklyWorkoutsChange([
        ...weeklyWorkouts.filter((w) => w.dayOfWeek !== originDay && w.dayOfWeek !== destinationDay),
        ...sourceWorkouts,
        ...destinationWorkouts,
      ]);
    }
  };

  const getTotalExercises = () => {
    return weeklyWorkouts.reduce((total, workout) => total + workout.exercises.length, 0);
  };

  const getTotalSets = () => {
    return weeklyWorkouts.reduce((total, workout) => {
      return (
        total +
        workout.exercises.reduce((exerciseTotal, exercise) => {
          return exerciseTotal + exercise.sets.length;
        }, 0)
      );
    }, 0);
  };

  const getEstimatedDuration = () => {
    const totalDuration = weeklyWorkouts.reduce((total, workout) => {
      return total + workout.exercises.length * 5; // Rough estimate: 5 minutes per exercise
    }, 0);
    return totalDuration;
  };

  const getWorkoutsForDay = (dayOfWeek: number) => {
    return weeklyWorkouts.filter((workout) => workout.dayOfWeek === dayOfWeek);
  };

  return (
    <div className="space-y-6">
      {/* Routine Name Input */}
      <Card>
        <CardHeader>
          <CardTitle>{mode === 'edit' ? 'Edit Routine Name' : 'Routine Name'}</CardTitle>
          <CardDescription>
            {mode === 'edit' ? 'Update your routine name' : 'Give your routine a memorable name'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="routineName">Name</Label>
            <Input
              id="routineName"
              value={routineName}
              onChange={(e) => onRoutineNameChange(e.target.value)}
              placeholder="e.g., Push Pull Legs, Upper Lower Split"
              className="max-w-md"
              disabled={isPending}
            />
          </div>
        </CardContent>
      </Card>

      {/* Workout Builder */}
      <Card>
        <CardHeader>
          <CardTitle>{mode === 'edit' ? 'Add New Workout' : 'Create Workouts'}</CardTitle>
          <CardDescription>
            {mode === 'edit'
              ? 'Add a new workout to your existing routine'
              : 'Build individual workouts for your routine'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <WorkoutBuilder
            exercises={exercises}
            onWorkoutCreated={handleWorkoutCreated}
            trigger={
              <Button type="button" className="w-full" disabled={isPending}>
                <Plus className="w-4 h-4 mr-2" />
                {mode === 'edit' ? 'Add New Workout' : 'Create New Workout'}
              </Button>
            }
          />
        </CardContent>
      </Card>

      {/* Weekly Schedule */}
      <Card>
        <CardHeader>
          <CardTitle>{mode === 'edit' ? 'Edit Weekly Schedule' : 'Weekly Schedule'}</CardTitle>
          <CardDescription>
            {mode === 'edit'
              ? 'Drag workouts to reschedule them or add new workouts'
              : 'Drag workouts to schedule them on specific days'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DragDropContext onDragEnd={handleDragEnd}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {DAYS_OF_WEEK.map((day) => {
                const dayWorkouts = getWorkoutsForDay(day.value);

                return (
                  <Card key={day.value} className="min-h-[200px]">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg font-semibold text-gray-900">{day.label}</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <Droppable droppableId={day.value.toString()}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                            className={`min-h-[100px] p-2 rounded-lg transition-colors ${
                              snapshot.isDraggingOver ? 'bg-blue-50 border-2 border-blue-200' : 'bg-gray-50'
                            }`}
                          >
                            {dayWorkouts.length === 0 ? (
                              <div className="text-center py-8">
                                <Calendar className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                                <p className="text-sm text-gray-500">Drop workout here</p>
                              </div>
                            ) : (
                              dayWorkouts.map((workout, index) => (
                                <Draggable key={workout.id} draggableId={workout.id} index={index}>
                                  {(provided, snapshot) => (
                                    <div
                                      ref={provided.innerRef}
                                      {...provided.draggableProps}
                                      {...provided.dragHandleProps}
                                      className={`mb-2 p-3 bg-white rounded-lg border shadow-sm cursor-move transition-shadow ${
                                        snapshot.isDragging ? 'shadow-lg' : 'hover:shadow-md'
                                      }`}
                                    >
                                      <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                          <h4 className="font-medium text-gray-900">{workout.name}</h4>
                                          <div className="flex items-center gap-4 mt-1 text-xs text-gray-600">
                                            <span className="flex items-center gap-1">
                                              <Target className="w-3 h-3" />
                                              {workout.exercises.length} exercises
                                            </span>
                                            <span className="flex items-center gap-1">
                                              <Dumbbell className="w-3 h-3" />
                                              {workout.exercises.reduce((total, ex) => total + ex.sets.length, 0)} sets
                                            </span>
                                          </div>
                                        </div>
                                        <div className="flex gap-1">
                                          <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => handleEditWorkout(workout)}
                                            className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                                            disabled={isPending}
                                          >
                                            <Edit className="w-3 h-3" />
                                          </Button>
                                          <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => onWorkoutRemoved(workout.id)}
                                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                            disabled={isPending}
                                          >
                                            <X className="w-4 h-4" />
                                          </Button>
                                        </div>
                                      </div>
                                    </div>
                                  )}
                                </Draggable>
                              ))
                            )}
                            {provided.placeholder}
                          </div>
                        )}
                      </Droppable>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </DragDropContext>
        </CardContent>
      </Card>

      {/* Routine Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Routine Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center gap-2">
              <Target className="w-5 h-5 text-gray-500" />
              <div>
                <p className="text-sm font-medium text-gray-900">{getTotalExercises()}</p>
                <p className="text-xs text-gray-500">Exercises</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Dumbbell className="w-5 h-5 text-gray-500" />
              <div>
                <p className="text-sm font-medium text-gray-900">{getTotalSets()}</p>
                <p className="text-xs text-gray-500">Sets</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-gray-500" />
              <div>
                <p className="text-sm font-medium text-gray-900">{getEstimatedDuration()}m</p>
                <p className="text-xs text-gray-500">Duration</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <CalendarDays className="w-5 h-5 text-gray-500" />
              <div>
                <p className="text-sm font-medium text-gray-900">{weeklyWorkouts.length}</p>
                <p className="text-xs text-gray-500">Workouts</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Workout Edit Sidebar */}
      {editingWorkout && (
        <WorkoutBuilder exercises={exercises} onWorkoutCreated={handleWorkoutUpdated} initialWorkout={editingWorkout} />
      )}
    </div>
  );
}
