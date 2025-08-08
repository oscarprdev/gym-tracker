'use client';

import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { createRoutineServerAction, deleteRoutineServerAction } from '@/app/routines/actions';
import type { CreateRoutineFormValues } from '../validations';
import { to } from '@/features/shared/utils';

export function useCreateRoutine() {
  return useMutation({
    mutationFn: async (data: CreateRoutineFormValues) => {
      const [error] = await to(createRoutineServerAction(data));
      if (error) {
        throw new Error(error.message);
      }
    },
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
