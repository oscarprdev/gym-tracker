'use client';

import { createContext, PropsWithChildren, useContext } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/features/shared/components/ui/sheet';
import { CreateWorkoutForm } from './create-workout-form';
import { CreateWorkoutData } from '../validations';
import { createWorkoutAction } from '../actions/create-workout';
import { to } from '@/features/shared/utils';
import { useSidebar } from '@/features/shared/providers/sidebar-provider';
import { SidebarKinds } from '@/features/shared';
import useRoutinesStore from '@/lib/store/routines-store';
import { Label } from '@/features/shared/components/ui/label';
import { Button } from '@/features/shared/components/ui/button';
import { Plus, Check } from 'lucide-react';
import { useUserWorkouts } from '../hooks/use-user-workouts';

interface WorkoutsSidebarContextType {
  isOpen: boolean;
}

const WorkoutsSidebarContext = createContext<WorkoutsSidebarContextType | null>(null);

const useWorkoutsSidebar = () => {
  const context = useContext(WorkoutsSidebarContext);
  if (!context) {
    throw new Error('useWorkoutsSidebar must be used within a WorkoutsSidebarProvider');
  }
  return context;
};

export function WorkoutsSidebar({ children, isOpen }: PropsWithChildren<WorkoutsSidebarContextType>) {
  return <WorkoutsSidebarContext.Provider value={{ isOpen }}>{children}</WorkoutsSidebarContext.Provider>;
}

function WorkoutsSidebarAvailableWorkouts() {
  const { data: userWorkouts = [], isLoading } = useUserWorkouts();
  const { workoutToAdd, addWorkout, removeWorkout } = useRoutinesStore();

  const isWorkoutSelected = (workoutId: string) => {
    return workoutToAdd.some((workout) => workout.id === workoutId);
  };

  const toggleWorkoutSelection = (workout: (typeof userWorkouts)[0]) => {
    if (isWorkoutSelected(workout.id)) {
      removeWorkout(workout.id);
    } else {
      addWorkout(workout);
    }
  };

  return (
    <div className="p-6 border-b border-gray-200">
      <h2 className="text-xl font-semibold text-black mb-4">Available Workouts</h2>
      <div className="flex flex-col gap-2">
        {isLoading && <div className="text-gray-500">Loading workouts...</div>}
        {!isLoading && userWorkouts.length === 0 ? (
          <div className="text-gray-500">No workouts available</div>
        ) : (
          userWorkouts.map((workout) => (
            <div
              key={workout.id}
              className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-colors ${
                isWorkoutSelected(workout.id) ? 'bg-black text-white border-black' : 'border-gray-200 hover:bg-gray-50'
              }`}
              onClick={() => toggleWorkoutSelection(workout)}
            >
              <div className="flex-1">
                <h3 className="font-medium">{workout.name}</h3>
              </div>
              {isWorkoutSelected(workout.id) && <Check className="w-4 h-4" />}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function CreateWorkoutButton() {
  const { toggleWorkoutsSidebar } = useSidebar();

  const onCreateWorkout = () => {
    toggleWorkoutsSidebar({ isOpen: false, kind: SidebarKinds.create });
  };

  return (
    <div className="space-y-4">
      <Label className="text-black font-medium">Create New Workout</Label>
      <div className="border border-gray-300 rounded-md p-4 bg-gray-50">
        <div className="text-center py-8">
          <p className="text-gray-600 mb-4">Create a workout to add to your routine</p>
          <Button
            type="button"
            variant="outline"
            className="border-black text-black hover:bg-gray-100"
            onClick={onCreateWorkout}
            disabled
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Workout
          </Button>
        </div>
      </div>
    </div>
  );
}

function WorkoutsSidebarCreate() {
  const { isOpen } = useWorkoutsSidebar();
  const { toggleWorkoutsSidebar } = useSidebar();

  const onOpenChange = (isOpen: boolean) => {
    toggleWorkoutsSidebar({ isOpen, kind: SidebarKinds.create });
  };

  const onSubmitFormAction = async (data: CreateWorkoutData) => {
    const [error] = await to(createWorkoutAction(data));
    if (error) {
      throw new Error(error.message || 'Failed to create workout');
    }
    toggleWorkoutsSidebar({ isOpen: false, kind: SidebarKinds.create });
  };

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="routines-light-theme bg-white border-l border-black">
        <SheetHeader>
          <SheetTitle className="text-black">Create New Workout</SheetTitle>
        </SheetHeader>
        <CreateWorkoutForm onSubmitFormAction={onSubmitFormAction} onOpenChange={onOpenChange} />
      </SheetContent>
    </Sheet>
  );
}

function WorkoutsSidebarSelect() {
  const { isOpen } = useWorkoutsSidebar();
  const { toggleWorkoutsSidebar } = useSidebar();

  const onOpenChange = (isOpen: boolean) => {
    toggleWorkoutsSidebar({ isOpen, kind: SidebarKinds.edit });
  };

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="routines-light-theme bg-white border-l border-black">
        <SheetHeader>
          <SheetTitle className="text-black">Add Workouts to Routine</SheetTitle>
        </SheetHeader>
        <div className="flex flex-col gap-4 pt-6">
          <CreateWorkoutButton />
          <WorkoutsSidebarAvailableWorkouts />
        </div>
      </SheetContent>
    </Sheet>
  );
}

WorkoutsSidebar.Create = WorkoutsSidebarCreate;
WorkoutsSidebar.Select = WorkoutsSidebarSelect;
