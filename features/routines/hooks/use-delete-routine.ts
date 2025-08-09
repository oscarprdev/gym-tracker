import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { deleteRoutineServerAction } from '../actions/delete-routine';
import { to } from '@/features/shared/utils/error-handler';

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
