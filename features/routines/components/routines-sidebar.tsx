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

function RoutinesSidebarCreate() {
  const { toggleRoutineSidebar } = useSidebar();
  const { isOpen } = useRoutinesSidebar();
  const { workoutToAdd } = useRoutinesStore();

  const onOpenChange = (isOpen: boolean) => {
    toggleRoutineSidebar({ isOpen, kind: SidebarKinds.create });
  };

  const onSubmitFormAction = async (data: CreateRoutineFormValues) => {
    const [error] = await to(createRoutineAction({ ...data, workoutIds: workoutToAdd.map((workout) => workout.id) }));
    if (error) {
      throw new Error(error.message || 'Failed to create routine');
    }
    toggleRoutineSidebar({ isOpen: false, kind: SidebarKinds.create });
  };

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="routines-light-theme bg-white border-l border-black">
        <SheetHeader>
          <SheetTitle className="text-black">Create New Routine</SheetTitle>
        </SheetHeader>
        <CreateRoutineForm onSubmitFormAction={onSubmitFormAction} onOpenChange={onOpenChange} />
        <RoutinesSidebarWorkoutsList workouts={workoutToAdd} />
      </SheetContent>
    </Sheet>
  );
}

RoutinesSidebar.Create = RoutinesSidebarCreate;
