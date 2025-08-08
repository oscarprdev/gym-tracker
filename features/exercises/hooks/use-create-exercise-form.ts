'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createExerciseSchema, type CreateExerciseFormValues } from '../validations';
import { useCreateExercise } from './use-exercises';

const defaultFormState: CreateExerciseFormValues = {
  name: '',
  muscleGroups: [],
};

interface UseCreateExerciseFormProps {
  onSuccess?: () => void;
}

export function useCreateExerciseForm({ onSuccess }: UseCreateExerciseFormProps = {}) {
  const createExerciseMutation = useCreateExercise();

  const form = useForm<CreateExerciseFormValues>({
    resolver: zodResolver(createExerciseSchema),
    defaultValues: defaultFormState,
    mode: 'onChange',
  });

  const onSubmit = async (data: CreateExerciseFormValues) => {
    await createExerciseMutation.mutateAsync(data);
    form.reset();
    onSuccess?.();
  };

  return {
    form,
    onSubmit: form.handleSubmit(onSubmit),
    isPending: createExerciseMutation.isPending,
  };
}
