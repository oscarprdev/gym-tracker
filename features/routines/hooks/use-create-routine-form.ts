'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createRoutineSchema, type CreateRoutineFormValues } from '../validations';
import { useCreateRoutine } from './use-routines';

const defaultFormState: CreateRoutineFormValues = {
  name: '',
};

interface UseCreateRoutineFormProps {
  onSuccess?: () => void;
}

export function useCreateRoutineForm({ onSuccess }: UseCreateRoutineFormProps = {}) {
  const createRoutineMutation = useCreateRoutine();

  const form = useForm<CreateRoutineFormValues>({
    resolver: zodResolver(createRoutineSchema),
    defaultValues: defaultFormState,
    mode: 'onChange',
  });

  const onSubmit = async (data: CreateRoutineFormValues) => {
    await createRoutineMutation.mutateAsync(data);
    form.reset();
    onSuccess?.();
  };

  return {
    form,
    onSubmit: form.handleSubmit(onSubmit),
    isPending: createRoutineMutation.isPending,
  };
}
