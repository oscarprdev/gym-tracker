import { UserWorkoutRecord } from '@/lib/db/queries';

export interface WorkoutsSelectSidebarProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

export interface AvailableWorkoutsListProps {
  workouts: UserWorkoutRecord[];
  isLoading: boolean;
  selectedWorkoutIds: string[];
  onToggleWorkout: (workout: UserWorkoutRecord) => void;
}

export interface CreateWorkoutButtonProps {
  onCreateWorkout: () => void;
}
