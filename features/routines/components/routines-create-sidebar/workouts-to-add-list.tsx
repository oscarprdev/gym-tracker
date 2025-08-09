'use client';

import { Badge } from '@/features/shared/components/ui/badge';
import { Button } from '@/features/shared/components/ui/button';
import { X } from 'lucide-react';
import useRoutinesStore from '@/lib/store/routines-store';

export const WorkoutsToAddList = () => {
  const { workoutToAdd, removeWorkout } = useRoutinesStore();

  if (workoutToAdd.length === 0) {
    return <div className="text-center py-8 text-muted-foreground">No workouts selected yet</div>;
  }

  return (
    <div className="space-y-3">
      {workoutToAdd.map((workout) => (
        <div key={workout.id} className="flex items-center justify-between p-3 border rounded-lg">
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
          <Button variant="ghost" size="sm" onClick={() => removeWorkout(workout.id)}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      ))}
    </div>
  );
};
