'use client';

import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/features/shared/components/ui/sheet';
import { createWorkoutAction } from '@/features/workouts/actions/create-workout';
import { CreateWorkoutForm } from '@/features/workouts/components/workouts-create-sidebar/create-workout-form';
import { CreateWorkoutData } from '@/features/workouts/validations';
import { ActionResponse } from '@/features/shared/types';
import { to } from '@/features/shared/utils/error-handler';
import { WorkoutsCreateSidebarProps } from './types';

export const WorkoutsCreateSidebar = ({ isOpen, onOpenChange }: WorkoutsCreateSidebarProps) => {
  const handleWorkoutSubmit = async (data: CreateWorkoutData): Promise<ActionResponse | void> => {
    const [error] = await to(createWorkoutAction(data));
    if (error) {
      return { error: error.message || 'Failed to create workout' };
    }
    onOpenChange(false);
  };

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="w-[400px] sm:w-[540px]">
        <SheetHeader>
          <SheetTitle>Create New Workout</SheetTitle>
        </SheetHeader>
        <div className="mt-6">
          <CreateWorkoutForm onSubmitFormAction={handleWorkoutSubmit} onOpenChange={onOpenChange} />
        </div>
      </SheetContent>
    </Sheet>
  );
};
