'use client';

import React, { useState, memo } from 'react';
import { MoreHorizontal, Target, Clock, Calendar } from 'lucide-react';
import { Card, CardContent } from '@/features/shared/components/ui/card';
import { Button } from '@/features/shared/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/features/shared/components/ui/select';
import { cn } from '@/lib/utils/cn';
import { MuscleGroupBadgeList } from './trello-weekly-routine-muscle-group-badge';
import { WorkoutContextMenu } from './trello-weekly-routine-workout-context-menu';
import { extractMuscleGroups } from './utils/muscle-group-colors';
import type { TrelloWorkoutCardProps, WorkoutContextAction } from './types';

export const TrelloWorkoutCard = memo<TrelloWorkoutCardProps>(function TrelloWorkoutCard({
  workout,
  index: _index, // Keep for backwards compatibility but no longer used
  isDragging: _isDragging = false, // Deprecated
  onEdit,
  onDelete,
  onDuplicate,
  onDayChange,
  availableDays = [],
  enableContextMenu = true,
  isChangingDay = false,
  error = null,
  className,
}) {
  const [, setIsContextMenuOpen] = useState(false);

  // Extract muscle groups from exercises
  const muscleGroups = extractMuscleGroups(workout.exercises);

  // Calculate workout stats
  const totalExercises = workout.exercises.length;
  const estimatedDuration = totalExercises * 5; // 5 minutes per exercise estimate

  // Define context menu actions
  const contextActions: WorkoutContextAction[] = [
    {
      type: 'edit',
      label: 'Edit Workout',
      icon: ({ className }: { className?: string }) => (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
          />
        </svg>
      ),
      variant: 'default',
    },
    ...(onDuplicate
      ? [
          {
            type: 'duplicate' as const,
            label: 'Duplicate Workout',
            icon: ({ className }: { className?: string }) => (
              <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                />
              </svg>
            ),
            variant: 'default' as const,
          },
        ]
      : []),
    {
      type: 'delete',
      label: 'Delete Workout',
      icon: ({ className }: { className?: string }) => (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
          />
        </svg>
      ),
      variant: 'destructive',
    },
  ];

  const handleContextAction = (action: WorkoutContextAction, workoutId: string) => {
    switch (action.type) {
      case 'edit':
        onEdit({ id: workout.id });
        break;
      case 'delete':
        onDelete(workoutId);
        break;
      case 'duplicate':
        onDuplicate?.(workoutId);
        break;
      case 'move':
        // Move action would be handled by drag and drop or a separate move dialog
        break;
    }
    setIsContextMenuOpen(false);
  };

  const handleDayChange = (newDay: string) => {
    const dayValue = parseInt(newDay);
    onDayChange?.(workout.id, dayValue);
  };

  const currentDay = availableDays.find((day) => day.value === workout.dayOfWeek);

  return (
    <Card
      className={cn(
        'group relative transition-all duration-200',
        'hover:shadow-md hover:border-gray-300',
        'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700',
        'mb-2 last:mb-0',
        className
      )}
    >
      <CardContent className="p-3 space-y-2.5">
        {/* Header: Workout name and context menu */}
        <div className="flex items-start justify-between gap-2">
          <h4
            className="font-medium text-sm text-gray-900 dark:text-gray-100 leading-tight line-clamp-2 flex-1"
            title={workout.name}
          >
            {workout.name}
          </h4>

          {enableContextMenu && (
            <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-150">
              <WorkoutContextMenu
                workout={workout}
                actions={contextActions}
                onAction={handleContextAction}
                trigger={
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsContextMenuOpen(true);
                    }}
                    aria-label={`More actions for ${workout.name}`}
                  >
                    <MoreHorizontal className="h-3 w-3" aria-hidden="true" />
                  </Button>
                }
                align="end"
              />
            </div>
          )}
        </div>

        {/* Day Selection Dropdown */}
        <div className="flex items-center gap-2">
          <Calendar className="h-3 w-3 text-gray-500" aria-hidden="true" />
          <Select value={workout.dayOfWeek.toString()} onValueChange={handleDayChange} disabled={isChangingDay}>
            <SelectTrigger
              className="h-7 text-xs w-auto min-w-[80px]"
              size="sm"
              aria-label={`Change workout day from ${currentDay?.label || 'current day'}`}
            >
              <SelectValue placeholder="Select day">
                {isChangingDay ? 'Changing...' : currentDay?.shortLabel || 'Day'}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {availableDays.map((day) => (
                <SelectItem key={day.value} value={day.value.toString()} aria-label={`Move workout to ${day.label}`}>
                  {day.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Error Message */}
        {error && (
          <div
            className="flex items-center gap-1 text-xs text-red-600 dark:text-red-400"
            role="alert"
            aria-live="polite"
          >
            <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 15.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
            <span>{error}</span>
          </div>
        )}

        {/* Body: Muscle group badges */}
        {muscleGroups.length > 0 && (
          <div className="flex flex-wrap gap-1">
            <MuscleGroupBadgeList muscleGroups={muscleGroups} maxVisible={3} size="sm" showIcon={false} />
          </div>
        )}

        {/* Footer: Exercise count and duration */}
        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 pt-1">
          <div className="flex items-center gap-1">
            <Target className="h-3 w-3" />
            <span>
              {totalExercises} exercise{totalExercises !== 1 ? 's' : ''}
            </span>
          </div>

          <div className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            <span>~{estimatedDuration}m</span>
          </div>
        </div>

        {/* Optional: Color indicator bar */}
        {workout.color && (
          <div className="absolute top-0 left-0 w-full h-1 rounded-t-lg" style={{ backgroundColor: workout.color }} />
        )}
      </CardContent>
    </Card>
  );
});

// Empty state component for when a day has no workouts
export function TrelloWorkoutCardEmpty({ dayLabel, onAddWorkout }: { dayLabel: string; onAddWorkout?: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[120px] p-4 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800/50 transition-colors duration-200">
      <Target className="h-8 w-8 text-gray-400 dark:text-gray-500 mb-2" />
      <p className="text-sm text-gray-500 dark:text-gray-400 text-center mb-2">No workouts on {dayLabel}</p>
      {onAddWorkout && (
        <Button variant="ghost" size="sm" onClick={onAddWorkout} className="text-xs text-gray-500 hover:text-gray-700">
          Add workout here
        </Button>
      )}
    </div>
  );
}
