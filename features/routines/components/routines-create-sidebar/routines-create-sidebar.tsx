'use client';

import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/features/shared/components/ui/sheet';
import { createRoutineAction } from '@/features/routines/actions/create-routine';
import { to } from '@/features/shared/utils/error-handler';
import { RoutinesCreateSidebarProps } from './types';
import { WorkoutsToAddList } from './workouts-to-add-list';
import { useSidebar } from '@/features/shared/providers/sidebar-provider';
import { CreateRoutineForm } from './create-routine-form';
import { CreateRoutineFormValues } from '../../validations';
import { ActionResponse } from '@/features/shared/types';
import { Plus } from 'lucide-react';
import { Button } from '@/features/shared/components/ui/button';

export const RoutinesCreateSidebar = ({ isOpen, onOpenChange }: RoutinesCreateSidebarProps) => {
  const { toggleWorkoutsSelectSidebar } = useSidebar();

  const handleWorkoutSubmit = async (data: CreateRoutineFormValues): Promise<ActionResponse | void> => {
    const [error] = await to(createRoutineAction(data));
    if (error) {
      return { error: error.message || 'Failed to create workout' };
    }
    onOpenChange(false);
  };

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="w-[400px] sm:w-[540px] flex flex-col">
        <SheetHeader>
          <SheetTitle>Create New Routine</SheetTitle>
        </SheetHeader>

        <CreateRoutineForm onSubmitFormAction={handleWorkoutSubmit} onOpenChange={onOpenChange}>
          <div className="flex-1 py-6">
            <div className="flex flex-col gap-4">
              <div>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => toggleWorkoutsSelectSidebar(true)}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Workouts
                </Button>
              </div>
              <WorkoutsToAddList />
            </div>
          </div>
        </CreateRoutineForm>
      </SheetContent>
    </Sheet>
  );
};
