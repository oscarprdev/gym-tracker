'use client';

import React from 'react';
import { Droppable } from '@hello-pangea/dnd';
import { Card, CardContent, CardHeader, CardTitle } from '@/features/shared/components/ui/card';
import { cn } from '@/lib/utils/cn';
import { TrelloWorkoutCard, TrelloWorkoutCardEmpty } from './trello-workout-card';
import type { TrelloDayColumnProps } from './trello-weekly-routine.types';

export function TrelloDayColumn({
  day,
  workouts,
  onWorkoutAction,
  _isDraggedOver = false,
  enableDropping = true,
  className,
}: TrelloDayColumnProps) {
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

          {/* Optional: Today indicator */}
          {day.isActive && <div className="w-2 h-2 rounded-full bg-blue-500" title="Today" />}
        </CardTitle>
      </CardHeader>

      {/* Droppable Area */}
      <CardContent className="flex-1 p-3">
        <Droppable droppableId={day.value.toString()} isDropDisabled={!enableDropping}>
          {(provided, snapshot) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className={cn(
                'min-h-[120px] transition-all duration-200 rounded-lg',
                snapshot.isDraggingOver &&
                  'bg-blue-50 dark:bg-blue-900/20 border-2 border-dashed border-blue-300 dark:border-blue-600',
                !snapshot.isDraggingOver && workouts.length === 0 && 'border-2 border-dashed border-transparent'
              )}
            >
              {/* Workout Cards */}
              {workouts.length > 0 ? (
                workouts.map((workout, index) => (
                  <TrelloWorkoutCard
                    key={workout.id}
                    workout={workout}
                    index={index}
                    dayOfWeek={day.value}
                    onEdit={handleWorkoutEdit}
                    onDelete={handleWorkoutDelete}
                    onDuplicate={handleWorkoutDuplicate}
                    enableContextMenu={true}
                  />
                ))
              ) : (
                <TrelloWorkoutCardEmpty dayLabel={day.shortLabel} />
              )}

              {/* Placeholder for drag and drop */}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </CardContent>
    </Card>
  );
}
