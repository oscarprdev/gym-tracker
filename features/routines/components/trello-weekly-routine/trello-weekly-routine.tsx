'use client';

import React, { useState, useMemo, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/features/shared/components/ui/card';
import { Input } from '@/features/shared/components/ui/input';
import { Label } from '@/features/shared/components/ui/label';
import { Calendar } from 'lucide-react';
import { WorkoutBuilder } from '../weekly-routine-builder/weekly-routine-builder-workout-builder';
import { TrelloDayColumn } from './trello-weekly-routine-day-column';
import { groupWorkoutsByDay } from './utils/drag-helpers';
import type { TrelloWeeklyRoutineProps, TrelloDayColumn as TrelloDayColumnType, WorkoutContextAction } from './types';
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
  enableContextMenu: _enableContextMenu = true,
  enableDragDrop: _enableDragDrop = false, // Deprecated - keeping for backwards compatibility
  showRoutineSummary = true,
}: TrelloWeeklyRoutineProps) {
  const [editingWorkout, setEditingWorkout] = useState<WeeklyWorkout | null>(null);
  const [preSelectedDay, setPreSelectedDay] = useState<number | null>(null);
  const [changingDayWorkoutId, setChangingDayWorkoutId] = useState<string | null>(null);
  const [dayChangeError, setDayChangeError] = useState<string | null>(null);

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

  const handleWorkoutCreated = useCallback(
    (workout: { name: string; exercises: WorkoutExerciseConfig[] }) => {
      // Use pre-selected day or find the next available day
      let targetDay = preSelectedDay;

      if (targetDay === null) {
        const usedDays = weeklyWorkouts.map((w) => w.dayOfWeek);
        targetDay = 1; // Start with Monday

        // Find the first available day
        for (let day = 1; day <= 7; day++) {
          const dayOfWeek = day === 7 ? 0 : day; // Sunday is 0
          if (!usedDays.includes(dayOfWeek)) {
            targetDay = dayOfWeek;
            break;
          }
        }
      }

      const newWorkout: WeeklyWorkout = {
        id: crypto.randomUUID(),
        name: workout.name,
        dayOfWeek: targetDay,
        exercises: workout.exercises,
      };

      onWeeklyWorkoutsChange([...weeklyWorkouts, newWorkout]);
      setPreSelectedDay(null); // Reset pre-selected day
    },
    [weeklyWorkouts, onWeeklyWorkoutsChange, preSelectedDay]
  );

  const handleWorkoutUpdated = useCallback(
    (updatedWorkout: { name: string; exercises: WorkoutExerciseConfig[] }) => {
      if (editingWorkout) {
        onWorkoutUpdated(editingWorkout.id, updatedWorkout);
        setEditingWorkout(null);
      }
    },
    [editingWorkout, onWorkoutUpdated]
  );

  // New handler for changing workout day via select dropdown
  const handleWorkoutDayChange = useCallback(
    async (workoutId: string, newDay: number) => {
      // Validation
      if (newDay < 0 || newDay > 6) {
        setDayChangeError(`Invalid day value: ${newDay}`);
        return;
      }

      const workout = weeklyWorkouts.find((w) => w.id === workoutId);
      if (!workout) {
        setDayChangeError('Workout not found');
        return;
      }

      // Clear any previous errors
      setDayChangeError(null);
      setChangingDayWorkoutId(workoutId);

      try {
        // Optimistic update
        const updatedWorkouts = weeklyWorkouts.map((w) => (w.id === workoutId ? { ...w, dayOfWeek: newDay } : w));

        onWeeklyWorkoutsChange(updatedWorkouts);

        // Simulate async operation (replace with actual API call if needed)
        await new Promise((resolve) => setTimeout(resolve, 100));
      } catch (error) {
        // Rollback on error
        setDayChangeError(error instanceof Error ? error.message : 'Failed to change workout day');

        // Restore original state
        const rolledBackWorkouts = weeklyWorkouts.map((w) =>
          w.id === workoutId ? { ...w, dayOfWeek: workout.dayOfWeek } : w
        );
        onWeeklyWorkoutsChange(rolledBackWorkouts);
      } finally {
        setChangingDayWorkoutId(null);
      }
    },
    [weeklyWorkouts, onWeeklyWorkoutsChange]
  );

  // New handler for creating workout for specific day
  const handleCreateWorkoutForDay = useCallback((dayOfWeek: number) => {
    setPreSelectedDay(dayOfWeek);
    // The WorkoutBuilder will be opened with the pre-selected day
  }, []);

  const handleWorkoutAction = useCallback(
    (action: WorkoutContextAction, workoutId: string) => {
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
    },
    [weeklyWorkouts, onWorkoutRemoved, onWorkoutDuplicated, onWeeklyWorkoutsChange]
  );

  // Prepare day columns data
  const dayColumns: TrelloDayColumnType[] = useMemo(
    () =>
      DAYS_OF_WEEK.map((day) => ({
        ...day,
        workouts: workoutsByDay[day.value] || [],
        isActive: day.value === currentDay,
      })),
    [workoutsByDay, currentDay]
  );

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

      {/* Weekly Schedule */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Weekly Schedule
          </CardTitle>
          <CardDescription>
            {mode === 'edit'
              ? 'Use the dropdown to move workouts between days or add new workouts to specific days'
              : "Add workouts to specific days using the 'Add Workout' button in each day column"}
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          {/* Desktop Layout - Horizontal */}
          <div className="hidden lg:block">
            <div className="grid grid-cols-7 gap-4 min-h-[400px]">
              {dayColumns.map((day) => (
                <TrelloDayColumn
                  key={day.value}
                  day={day}
                  workouts={day.workouts}
                  onWorkoutAction={handleWorkoutAction}
                  onWorkoutDayChange={handleWorkoutDayChange}
                  onCreateWorkoutForDay={handleCreateWorkoutForDay}
                  className="min-w-[200px]"
                  availableDays={DAYS_OF_WEEK}
                  changingWorkoutId={changingDayWorkoutId}
                  dayChangeError={dayChangeError}
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
                  onWorkoutDayChange={handleWorkoutDayChange}
                  onCreateWorkoutForDay={handleCreateWorkoutForDay}
                  className="min-h-[200px]"
                  availableDays={DAYS_OF_WEEK}
                  changingWorkoutId={changingDayWorkoutId}
                  dayChangeError={dayChangeError}
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
                  onWorkoutDayChange={handleWorkoutDayChange}
                  onCreateWorkoutForDay={handleCreateWorkoutForDay}
                  className="w-full"
                  availableDays={DAYS_OF_WEEK}
                  changingWorkoutId={changingDayWorkoutId}
                  dayChangeError={dayChangeError}
                />
              ))}
            </div>
          </div>
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

      {/* Workout Builder - Used for both creating and editing */}
      <WorkoutBuilder
        onWorkoutCreated={editingWorkout ? handleWorkoutUpdated : handleWorkoutCreated}
        trigger={null} // No global trigger - only opened via day-specific buttons or edit actions
        initialWorkout={editingWorkout ? { name: editingWorkout.name, exercises: editingWorkout.exercises } : undefined}
      />
    </div>
  );
}
