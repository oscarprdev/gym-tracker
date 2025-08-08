'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createWorkoutSchema } from '@/features/routines/validations';
import type { CreateWorkoutData } from '@/features/routines/validations';
import { useCreateWorkout } from './use-workouts';

interface UseCreateWorkoutFormProps {
  routineId: string;
  onSuccess?: () => void;
}

export function useCreateWorkoutForm({ routineId, onSuccess }: UseCreateWorkoutFormProps) {
  const createWorkoutMutation = useCreateWorkout();

  const form = useForm<CreateWorkoutData>({
    resolver: zodResolver(createWorkoutSchema),
    defaultValues: {
      routineId,
      name: '',
      dayOfWeek: undefined,
    },
    mode: 'onChange',
  });

  const onSubmit = async (data: CreateWorkoutData) => {
    await createWorkoutMutation.mutateAsync(data);
    form.reset({
      routineId,
      name: '',
      dayOfWeek: undefined,
    });
    onSuccess?.();
  };

  return {
    form,
    onSubmit: form.handleSubmit(onSubmit),
    isPending: createWorkoutMutation.isPending,
  };
}
