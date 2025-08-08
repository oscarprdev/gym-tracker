'use client';

import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { createExerciseServerAction, deleteExerciseServerAction } from '@/app/exercises/actions';
import type { CreateExerciseFormValues, DeleteExerciseData } from '../validations';
import { to } from '@/features/shared/utils';

export function useCreateExercise() {
  return useMutation({
    mutationFn: async (data: CreateExerciseFormValues) => {
      const [error] = await to(createExerciseServerAction(data));
      if (error) {
        throw new Error(error.message);
      }
    },
    onSuccess: () => {
      toast.success('Exercise created successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to create exercise');
    },
  });
}

export function useDeleteExercise() {
  return useMutation({
    mutationFn: async (exerciseId: string) => {
      const deleteData: DeleteExerciseData = { id: exerciseId };
      const [error] = await to(deleteExerciseServerAction(deleteData));
      if (error) {
        throw new Error(error.message);
      }
    },
    onSuccess: () => {
      toast.success('Exercise deleted successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to delete exercise');
    },
  });
}
