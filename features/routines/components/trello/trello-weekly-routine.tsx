'use client';

import React, { useState, useMemo } from 'react';
import { DragDropContext, DropResult } from '@hello-pangea/dnd';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/features/shared/components/ui/card';
import { Button } from '@/features/shared/components/ui/button';
import { Input } from '@/features/shared/components/ui/input';
import { Label } from '@/features/shared/components/ui/label';
import { Plus, Calendar } from 'lucide-react';
import { WorkoutBuilder } from '../builder/workout-builder';
import { TrelloDayColumn } from './trello-day-column';
import { processEnhancedDragResult, groupWorkoutsByDay } from './utils/drag-helpers';
import type {
  TrelloWeeklyRoutineProps,
  TrelloDayColumn as TrelloDayColumnType,
  WorkoutContextAction,
} from './trello-weekly-routine.types';
import type { WeeklyWorkout, WorkoutExerciseConfig } from '../types';

// Days of the week configuration
const DAYS_OF_WEEK: Omit<TrelloDayColumnType, 'workouts' | 'isActive'>[] = [
  { value: 1, label: 'Monday', shortLabel: 'Mon' },
  { value: 2, label: 'Tuesday', shortLabel: 'Tue' },
  { value: 3, label: 'Wednesday', shortLabel: 'Wed' },
  { value: 4, label: 'Thursday', shortLabel: 'Thu' },
  { value: 5, label: 'Friday', shortLabel: 'Fri' },
  { value: 6, label: 'Saturday', shortLabel: 'Sat' },
  { value: 0, label: 'Sunday', shortLabel: 'Sun' },
];

export function TrelloWeeklyRoutine({
  routineName,
  onRoutineNameChange,
  weeklyWorkouts,
  onWeeklyWorkoutsChange,
  onWorkoutUpdated,
  onWorkoutRemoved,
  onWorkoutDuplicated,
  isPending = false,
  mode,
  _enableContextMenu = true,
  enableDragDrop = true,
  showRoutineSummary = true,
}: TrelloWeeklyRoutineProps) {
  const [editingWorkout, setEditingWorkout] = useState<WeeklyWorkout | null>(null);
  const [, setDraggedWorkoutId] = useState<string | null>(null);

  // Get current day for highlighting
  const currentDay = new Date().getDay();

  // Group workouts by day for Trello display
  const workoutsByDay = useMemo(() => groupWorkoutsByDay(weeklyWorkouts), [weeklyWorkouts]);

  // Calculate routine statistics
  const routineStats = useMemo(() => {
    const totalWorkouts = weeklyWorkouts.length;
    const totalExercises = weeklyWorkouts.reduce((sum, w) => sum + w.exercises.length, 0);
    const totalSets = weeklyWorkouts.reduce(
      (sum, w) => sum + w.exercises.reduce((exSum, ex) => exSum + ex.sets.length, 0),
      0
    );
    const estimatedWeeklyDuration = weeklyWorkouts.reduce((sum, w) => sum + w.exercises.length * 5, 0);

    return {
      totalWorkouts,
      totalExercises,
      totalSets,
      estimatedWeeklyDuration,
    };
  }, [weeklyWorkouts]);

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

  const handleDragStart = (start: { draggableId: string }) => {
    setDraggedWorkoutId(start.draggableId);
  };

  const handleDragEnd = (result: DropResult) => {
    setDraggedWorkoutId(null);

    if (!enableDragDrop) return;

    const dragResult = processEnhancedDragResult(result, weeklyWorkouts);

    if (dragResult.type !== 'cancel') {
      onWeeklyWorkoutsChange(dragResult.updatedWorkouts);
    }
  };

  const handleWorkoutAction = (action: WorkoutContextAction, workoutId: string) => {
    const workout = weeklyWorkouts.find((w) => w.id === workoutId);
    if (!workout) return;

    switch (action.type) {
      case 'edit':
        setEditingWorkout(workout);
        break;
      case 'delete':
        onWorkoutRemoved(workoutId);
        break;
      case 'duplicate':
        if (onWorkoutDuplicated) {
          onWorkoutDuplicated(workoutId);
        } else {
          // Default duplication logic
          const duplicatedWorkout: WeeklyWorkout = {
            ...workout,
            id: crypto.randomUUID(),
            name: `${workout.name} (Copy)`,
          };
          onWeeklyWorkoutsChange([...weeklyWorkouts, duplicatedWorkout]);
        }
        break;
    }
  };

  // Prepare day columns data
  const dayColumns: TrelloDayColumnType[] = DAYS_OF_WEEK.map((day) => ({
    ...day,
    workouts: workoutsByDay[day.value] || [],
    isActive: day.value === currentDay,
  }));

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

      {/* Trello-style Weekly Schedule */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Weekly Schedule
          </CardTitle>
          <CardDescription>
            {mode === 'edit'
              ? 'Drag workouts to reschedule them or add new workouts'
              : 'Drag workouts to schedule them on specific days'}
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <DragDropContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
            {/* Desktop Layout - Horizontal */}
            <div className="hidden lg:block">
              <div className="grid grid-cols-7 gap-4 min-h-[400px]">
                {dayColumns.map((day) => (
                  <TrelloDayColumn
                    key={day.value}
                    day={day}
                    workouts={day.workouts}
                    onWorkoutAction={handleWorkoutAction}
                    enableDropping={enableDragDrop}
                    className="min-w-[200px]"
                  />
                ))}
              </div>
            </div>

            {/* Tablet Layout - 2x4 Grid */}
            <div className="hidden md:block lg:hidden">
              <div className="grid grid-cols-2 gap-4 min-h-[400px]">
                {dayColumns.map((day) => (
                  <TrelloDayColumn
                    key={day.value}
                    day={day}
                    workouts={day.workouts}
                    onWorkoutAction={handleWorkoutAction}
                    enableDropping={enableDragDrop}
                    className="min-h-[200px]"
                  />
                ))}
              </div>
            </div>

            {/* Mobile Layout - Vertical Stack */}
            <div className="block md:hidden">
              <div className="space-y-4">
                {dayColumns.map((day) => (
                  <TrelloDayColumn
                    key={day.value}
                    day={day}
                    workouts={day.workouts}
                    onWorkoutAction={handleWorkoutAction}
                    enableDropping={enableDragDrop}
                    className="w-full"
                  />
                ))}
              </div>
            </div>
          </DragDropContext>
        </CardContent>
      </Card>

      {/* Routine Summary */}
      {showRoutineSummary && (
        <Card>
          <CardHeader>
            <CardTitle>Routine Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="flex flex-col items-center p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">{routineStats.totalWorkouts}</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Workout{routineStats.totalWorkouts !== 1 ? 's' : ''}
                </div>
              </div>

              <div className="flex flex-col items-center p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">{routineStats.totalExercises}</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Exercise{routineStats.totalExercises !== 1 ? 's' : ''}
                </div>
              </div>

              <div className="flex flex-col items-center p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">{routineStats.totalSets}</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Set{routineStats.totalSets !== 1 ? 's' : ''}
                </div>
              </div>

              <div className="flex flex-col items-center p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  ~{routineStats.estimatedWeeklyDuration}m
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Weekly Time</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Workout Edit Sidebar */}
      {editingWorkout && <WorkoutBuilder onWorkoutCreated={handleWorkoutUpdated} initialWorkout={editingWorkout} />}
    </div>
  );
}
