'use client';

import React, { memo } from 'react';
import { Plus } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/features/shared/components/ui/card';
import { Button } from '@/features/shared/components/ui/button';
import { cn } from '@/lib/utils/cn';
import { TrelloWorkoutCard, TrelloWorkoutCardEmpty } from './trello-weekly-routine-workout-card';
import type { TrelloDayColumnProps } from './types';

export const TrelloDayColumn = memo<TrelloDayColumnProps>(function TrelloDayColumn({
  day,
  workouts,
  onWorkoutAction,
  onWorkoutDayChange,
  onCreateWorkoutForDay,
  availableDays = [],
  changingWorkoutId = null,
  dayChangeError = null,
  enableDropping: _enableDropping = false, // Deprecated but kept for backwards compatibility
  className,
}) {
  const handleWorkoutEdit = (workout: { id: string }) => {
    onWorkoutAction(
      {
        type: 'edit',
        label: 'Edit',
        icon: () => null,
      },
      workout.id
    );
  };

  const handleWorkoutDelete = (workoutId: string) => {
    onWorkoutAction(
      {
        type: 'delete',
        label: 'Delete',
        icon: () => null,
      },
      workoutId
    );
  };

  const handleWorkoutDuplicate = (workoutId: string) => {
    onWorkoutAction(
      {
        type: 'duplicate',
        label: 'Duplicate',
        icon: () => null,
      },
      workoutId
    );
  };

  const handleAddWorkout = () => {
    onCreateWorkoutForDay?.(day.value);
  };

  const handleAddWorkoutFromEmpty = () => {
    onCreateWorkoutForDay?.(day.value);
  };

  return (
    <Card
      className={cn(
        'flex flex-col transition-all duration-200',
        'bg-gray-50 dark:bg-gray-900/50 border-gray-200 dark:border-gray-700',
        day.isActive && 'ring-2 ring-blue-500 ring-opacity-20 bg-blue-50/50 dark:bg-blue-900/10',
        className
      )}
    >
      {/* Day Header */}
      <CardHeader className="pb-3 border-b border-gray-200 dark:border-gray-700">
        <CardTitle className="flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">{day.label}</span>
            <span className="text-xs text-gray-500 dark:text-gray-400 font-normal">
              {workouts.length} workout{workouts.length !== 1 ? 's' : ''}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Add Workout Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleAddWorkout}
              className="h-7 w-7 p-0 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
              title={`Add workout to ${day.label}`}
              aria-label={`Add new workout to ${day.label}`}
            >
              <Plus className="h-3 w-3" aria-hidden="true" />
            </Button>

            {/* Today indicator */}
            {day.isActive && <div className="w-2 h-2 rounded-full bg-blue-500" title="Today" />}
          </div>
        </CardTitle>
      </CardHeader>

      {/* Workout List */}
      <CardContent className="flex-1 p-3">
        <div className="min-h-[120px] transition-all duration-200 rounded-lg">
          {/* Workout Cards */}
          {workouts.length > 0 ? (
            <div className="space-y-2">
              {workouts.map((workout) => (
                <TrelloWorkoutCard
                  key={workout.id}
                  workout={workout}
                  index={0} // No longer used for positioning
                  dayOfWeek={day.value}
                  onEdit={handleWorkoutEdit}
                  onDelete={handleWorkoutDelete}
                  onDuplicate={handleWorkoutDuplicate}
                  onDayChange={onWorkoutDayChange}
                  availableDays={availableDays}
                  enableContextMenu={true}
                  isChangingDay={changingWorkoutId === workout.id}
                  error={dayChangeError && changingWorkoutId === workout.id ? dayChangeError : null}
                />
              ))}
            </div>
          ) : (
            <TrelloWorkoutCardEmpty dayLabel={day.shortLabel} onAddWorkout={handleAddWorkoutFromEmpty} />
          )}
        </div>
      </CardContent>
    </Card>
  );
});
