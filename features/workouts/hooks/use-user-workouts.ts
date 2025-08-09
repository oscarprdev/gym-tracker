import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import { getUserWorkoutsAction } from '@/features/workouts/actions/get-user-workouts';

export function useUserWorkouts() {
  return useQuery({
    queryKey: ['user-workouts'],
    queryFn: async () => {
      const result = await getUserWorkoutsAction();

      if (result.error) {
        toast.error(result.error);
        return [];
      }

      return 'workouts' in result ? (result.workouts ?? []) : [];
    },
  });
}
