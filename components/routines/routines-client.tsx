import { RoutineCard } from './routine-card';
import { EmptyState } from '@/components/common/empty-state';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { WorkoutBuilder } from './workout-builder';

import type { Routine } from '@/lib/types';
import type { Exercise } from '@/lib/db/schema/exercises';

interface RoutinesClientProps {
  routines: Routine[];
  exercises: Exercise[];
}

export function RoutinesClient({ routines, exercises }: RoutinesClientProps) {
  if (routines.length === 0) {
    return (
      <EmptyState
        icon={<Plus className="w-12 h-12 text-gray-400" />}
        title="No routines yet"
        description="Create your first routine to start planning your workouts."
        action={
          <WorkoutBuilder
            exercises={exercises}
            onWorkoutCreated={(workout) => {
              // This will be handled by the parent component
              console.log('Workout created:', workout);
            }}
            trigger={
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Create Routine
              </Button>
            }
          />
        }
      />
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {routines.map((routine) => (
        <RoutineCard key={routine.id} routine={routine} />
      ))}
    </div>
  );
}
