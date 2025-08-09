'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createWorkoutSchema } from '../validations';
import type { CreateWorkoutData } from '../validations';
import { useCreateWorkouts } from './use-create-workouts';
import { ActionResponse } from '@/features/shared/types';

interface UseCreateWorkoutFormProps {
  onSubmitFormAction: (data: CreateWorkoutData) => Promise<ActionResponse | void>;
}

const defaultFormState: CreateWorkoutData = {
  name: '',
  dayOfWeek: undefined,
  muscleGroups: [],
};

export function useCreateWorkoutForm({ onSubmitFormAction }: UseCreateWorkoutFormProps) {
  const createWorkoutMutation = useCreateWorkouts(onSubmitFormAction);

  const form = useForm<CreateWorkoutData>({
    resolver: zodResolver(createWorkoutSchema),
    defaultValues: defaultFormState,
    mode: 'onChange',
  });

  const onSubmit = async (data: CreateWorkoutData) => {
    await createWorkoutMutation.mutateAsync(data);
    form.reset(defaultFormState);
  };

  return {
    form,
    onSubmit: form.handleSubmit(onSubmit),
    isPending: createWorkoutMutation.isPending,
  };
}
