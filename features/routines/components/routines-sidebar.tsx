'use client';

import { createContext, PropsWithChildren, useContext } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/features/shared/components/ui/sheet';
import { CreateRoutineForm } from './create-routine-form';
import { CreateRoutineFormValues } from '../validations';
import { createRoutineAction } from '../actions/create-routine';
import { to } from '@/features/shared/utils';
import { useSidebar } from '@/features/shared/providers/sidebar-provider';
import { SidebarKinds } from '@/features/shared';
import useRoutinesStore, { WorkoutToAdd } from '@/lib/store/routines-store';
import { Label } from '@/features/shared/components/ui/label';
import { Button } from '@/features/shared/components/ui/button';
import { Plus } from 'lucide-react';

interface RoutinesSidebarContextType {
  isOpen: boolean;
}

const RoutinesSidebarContext = createContext<RoutinesSidebarContextType | null>(null);

const useRoutinesSidebar = () => {
  const context = useContext(RoutinesSidebarContext);
  if (!context) {
    throw new Error('useRoutinesSidebar must be used within a RoutinesSidebarProvider');
  }
  return context;
};

export function RoutinesSidebar({ children, isOpen }: PropsWithChildren<RoutinesSidebarContextType>) {
  return <RoutinesSidebarContext.Provider value={{ isOpen }}>{children}</RoutinesSidebarContext.Provider>;
}

function RoutinesSidebarWorkoutsList({ workouts }: { workouts: WorkoutToAdd[] }) {
  return (
    <div className="p-6 border-b border-gray-200">
      <h2 className="text-xl font-semibold text-black mb-4">My Workouts</h2>
      <div className="flex flex-col gap-4">
        {workouts?.length === 0 ? (
          <div className="text-gray-500">No workouts found</div>
        ) : (
          workouts?.map((workout) => <div key={workout.id}>{workout.name}</div>)
        )}
      </div>
    </div>
  );
}

function AddWorkoutsButton() {
  const { toggleWorkoutsSidebar } = useSidebar();

  const onAddWorkouts = () => {
    toggleWorkoutsSidebar({ isOpen: true, kind: SidebarKinds.select });
  };

  return (
    <div className="space-y-4">
      <Label className="text-black font-medium">Workouts</Label>
      <div className="border border-gray-300 rounded-md p-4 bg-gray-50">
        <div className="text-center py-8">
          <p className="text-gray-600 mb-4">Add workouts to your routine after creating it</p>
          <Button
            type="button"
            variant="outline"
            className="border-black text-black hover:bg-gray-100"
            onClick={onAddWorkouts}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Workouts
          </Button>
        </div>
      </div>
    </div>
  );
}

function RoutinesSidebarCreate() {
  const { isOpen } = useRoutinesSidebar();
  const { workoutToAdd } = useRoutinesStore();
  const { toggleRoutinesSidebar } = useSidebar();

  const onOpenChange = (isOpen: boolean) => {
    toggleRoutinesSidebar({ isOpen, kind: SidebarKinds.create });
  };

  const onSubmitFormAction = async (data: CreateRoutineFormValues) => {
    const [error] = await to(createRoutineAction({ ...data, workoutIds: workoutToAdd.map((workout) => workout.id) }));
    if (error) {
      throw new Error(error.message || 'Failed to create routine');
    }
    toggleRoutinesSidebar({ isOpen: false, kind: SidebarKinds.create });
  };

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="routines-light-theme bg-white border-l border-black">
        <SheetHeader>
          <SheetTitle className="text-black">Create New Routine</SheetTitle>
        </SheetHeader>
        <CreateRoutineForm onSubmitFormAction={onSubmitFormAction} onOpenChange={onOpenChange}>
          <div className="flex flex-col gap-4">
            <AddWorkoutsButton />
            <RoutinesSidebarWorkoutsList workouts={workoutToAdd} />
          </div>
        </CreateRoutineForm>
      </SheetContent>
    </Sheet>
  );
}

RoutinesSidebar.Create = RoutinesSidebarCreate;
