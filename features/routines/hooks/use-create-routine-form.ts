'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createRoutineSchema, type CreateRoutineFormValues } from '../validations';
import { useCreateRoutine } from './use-create-routine';
import { ActionResponse } from '@/features/shared/types';

interface UseCreateRoutineFormProps {
  onSubmitFormAction: (data: CreateRoutineFormValues) => Promise<ActionResponse | void>;
}

const defaultFormState: CreateRoutineFormValues = {
  name: '',
  workoutIds: [],
};

export function useCreateRoutineForm({ onSubmitFormAction }: UseCreateRoutineFormProps) {
  const createRoutineMutation = useCreateRoutine(onSubmitFormAction);

  const form = useForm<CreateRoutineFormValues>({
    resolver: zodResolver(createRoutineSchema),
    defaultValues: defaultFormState,
    mode: 'onChange',
  });

  const onSubmit = async (data: CreateRoutineFormValues) => {
    await createRoutineMutation.mutateAsync(data);
    form.reset();
  };

  return {
    form,
    onSubmit: form.handleSubmit(onSubmit),
    isPending: createRoutineMutation.isPending,
  };
}
