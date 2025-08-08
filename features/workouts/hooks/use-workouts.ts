'use client';

import { useMutation, useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import { createWorkoutAction } from '../actions/create-workout';
import { getRoutineWorkouts } from '@/lib/db/queries';

export function useCreateWorkout() {
  return useMutation({
    mutationFn: createWorkoutAction,
    onSuccess: () => {
      toast.success('Workout created successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to create workout');
    },
  });
}

export function useGetWorkouts(routineId: string) {
  return useQuery({
    queryKey: ['workouts', routineId],
    queryFn: () => getRoutineWorkouts(routineId),
  });
}
