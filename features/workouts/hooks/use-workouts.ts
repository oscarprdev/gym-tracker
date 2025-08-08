'use client';

import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { createWorkoutServerAction } from '@/app/workouts/actions';
import type { CreateWorkoutData } from '@/features/routines/validations';
import { to } from '@/features/shared/utils';

export function useCreateWorkout() {
  const router = useRouter();

  return useMutation({
    mutationFn: async (data: CreateWorkoutData) => {
      const [error, result] = await to(createWorkoutServerAction(data));
      if (error) {
        throw new Error(error.message);
      }
      if (!result) {
        throw new Error('Failed to create workout');
      }
      // Handle protectedAction error response
      if ('error' in result && result.error) {
        throw new Error(result.error);
      }
      // Type guard to ensure we have the success response
      if ('success' in result && !result.success) {
        throw new Error(result.error || 'Failed to create workout');
      }
      if ('success' in result && result.success) {
        return result.workout;
      }
      throw new Error('Unexpected response format');
    },
    onSuccess: () => {
      router.refresh();
      toast.success('Workout created successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to create workout');
    },
  });
}
