'use client';

import { Badge } from '@/features/shared/components/ui/badge';
import { Check } from 'lucide-react';
import { AvailableWorkoutsListProps } from './types';

export const AvailableWorkoutsList = ({
  workouts,
  isLoading,
  selectedWorkoutIds,
  onToggleWorkout,
}: AvailableWorkoutsListProps) => {
  if (isLoading) {
    return <div className="text-sm text-muted-foreground">Loading workouts...</div>;
  }

  if (workouts.length === 0) {
    return <div className="text-sm text-muted-foreground">No workouts found</div>;
  }

  return (
    <div className="space-y-2">
      {workouts.map((workout) => (
        <div
          key={workout.id}
          className={`flex items-start space-x-3 p-3 border rounded-lg hover:bg-muted/50 cursor-pointer ${
            selectedWorkoutIds.includes(workout.id) ? 'bg-muted border-primary' : ''
          }`}
          onClick={() => onToggleWorkout(workout)}
        >
          <div className="flex-shrink-0 w-5 h-5 border rounded flex items-center justify-center">
            {selectedWorkoutIds.includes(workout.id) && <Check className="w-4 h-4 text-primary" />}
          </div>
          <div className="flex-1">
            <div className="font-medium">{workout.name}</div>
            {workout.muscleGroups && workout.muscleGroups.length > 0 && (
              <div className="mt-1 flex flex-wrap gap-1">
                {workout.muscleGroups.map((group) => (
                  <Badge key={group} variant="secondary" className="text-xs">
                    {group}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};
