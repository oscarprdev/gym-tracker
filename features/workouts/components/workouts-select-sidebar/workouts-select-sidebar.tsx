'use client';

import { Button } from '@/features/shared/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/features/shared/components/ui/sheet';
import { useUserWorkouts } from '@/features/workouts/hooks';
import useRoutinesStore from '@/lib/store/routines-store';
import { UserWorkoutRecord } from '@/lib/db/queries';
import { useSidebar } from '@/features/shared/providers/sidebar-provider';
import { AvailableWorkoutsList } from './available-workouts-list';
import { WorkoutsSelectSidebarProps } from './types';
import { Plus } from 'lucide-react';

export const WorkoutsSelectSidebar = ({ isOpen, onOpenChange }: WorkoutsSelectSidebarProps) => {
  const { data: workouts, isLoading } = useUserWorkouts();
  const { workoutToAdd, addWorkout, removeWorkout } = useRoutinesStore();
  const { toggleWorkoutsCreateSidebar } = useSidebar();

  const selectedWorkoutIds = workoutToAdd.map((w) => w.id);

  const handleToggleWorkout = (workout: UserWorkoutRecord) => {
    const isSelected = selectedWorkoutIds.includes(workout.id);
    if (isSelected) {
      removeWorkout(workout.id);
    } else {
      addWorkout({
        id: workout.id,
        name: workout.name,
        muscleGroups: workout.muscleGroups || [],
      });
    }
  };

  const handleCreateWorkout = () => {
    toggleWorkoutsCreateSidebar(true);
  };

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="w-[400px] sm:w-[540px]">
        <SheetHeader>
          <SheetTitle>Select Workouts</SheetTitle>
        </SheetHeader>

        <div className="p-4 border-b">
          <Button variant="outline" className="w-full justify-start" onClick={handleCreateWorkout}>
            <Plus className="mr-2 h-4 w-4" />
            Create New Workout
          </Button>
        </div>

        <AvailableWorkoutsList
          workouts={workouts || []}
          isLoading={isLoading}
          selectedWorkoutIds={selectedWorkoutIds}
          onToggleWorkout={handleToggleWorkout}
        />

        <div className="border-t p-4">
          <Button type="button" onClick={() => onOpenChange(false)} className="w-full">
            Done
          </Button>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="w-full mt-2">
            Cancel
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};
