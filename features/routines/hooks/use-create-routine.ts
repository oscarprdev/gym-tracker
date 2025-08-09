import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { CreateRoutineFormValues } from '../validations';
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
