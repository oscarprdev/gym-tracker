import { WorkoutToAdd } from '@/lib/store/routines-store';

export interface RoutinesCreateSidebarProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

export interface WorkoutsToAddListProps {
  workouts: WorkoutToAdd[];
}

export interface AddWorkoutsButtonProps {
  onAddWorkouts: () => void;
}
