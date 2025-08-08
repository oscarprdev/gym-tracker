'use client';

import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { deleteRoutineServerAction } from '@/app/routines/actions';
import type { CreateRoutineFormValues } from '../validations';
import { to } from '@/features/shared/utils';
import { ActionResponse } from '@/features/shared/types';

export function useCreateRoutine(
  onSubmitFormAction: (data: CreateRoutineFormValues) => Promise<ActionResponse | void>
) {
  return useMutation({
    mutationFn: onSubmitFormAction,
    onSuccess: () => {
      toast.success('Routine created successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to create routine');
    },
  });
}

export function useDeleteRoutine() {
  return useMutation({
    mutationFn: async (routineId: string) => {
      const [error] = await to(deleteRoutineServerAction(routineId));
      if (error) {
        throw new Error(error.message);
      }
    },
    onSuccess: () => {
      toast.success('Routine deleted successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to delete routine');
    },
  });
}
