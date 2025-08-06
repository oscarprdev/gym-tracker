import { WorkoutSession } from '@/lib/db/schema/workout-sessions';
import { Routine } from '@/lib/db/schema/routines';

export interface DashboardUser {
  id: string;
  name: string;
  email: string;
  activeRoutineId: string | null;
  routineAssigned: boolean;
  activeRoutine?: Routine | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface WorkoutSessionStats {
  totalCompleted: number;
  totalDurationMinutes: number;
  averageDurationMinutes: number;
  completionRate: number;
}

export interface WorkoutSessionWithWorkout extends WorkoutSession {
  workout?: {
    id: string;
    name: string;
    dayOfWeek: number;
    routine: {
      id: string;
      name: string;
      color: string | null;
    };
  } | null;
}

export interface RoutineWithStats extends Routine {
  stats: {
    muscleGroups: string[];
    totalWorkouts: number;
    totalExercises: number;
    totalSets: number;
  };
}

export interface DashboardData {
  user: DashboardUser;
  stats: WorkoutSessionStats;
  upcomingSessions: WorkoutSessionWithWorkout[];
  recentSessions: WorkoutSessionWithWorkout[];
  inProgressSession: WorkoutSessionWithWorkout | null;
  routines: RoutineWithStats[];
}

export interface DashboardActionState {
  error?: string | null;
  success?: boolean;
  session?: WorkoutSession;
}

export interface CreateWorkoutSessionData {
  workoutId?: string;
  name: string;
  scheduledDate?: Date;
}

export type WorkoutSessionStatus = 'planned' | 'in_progress' | 'completed' | 'skipped';

export interface QuickWorkoutFormData {
  name: string;
  scheduledDate?: string;
}

export interface DashboardOverviewProps {
  data: DashboardData;
}

export interface WorkoutSessionCardProps {
  session: WorkoutSessionWithWorkout;
  variant?: 'upcoming' | 'recent' | 'in-progress';
  onStart?: (sessionId: string) => void;
  onComplete?: (sessionId: string, durationMinutes?: number) => void;
  onSkip?: (sessionId: string) => void;
}

export interface StatsCardProps {
  stats: WorkoutSessionStats;
  period?: number;
}

export interface ActiveRoutineCardProps {
  user: DashboardUser;
  routines: RoutineWithStats[];
  onAssign: (routineId: string) => void;
  onUnassign: () => void;
}

export interface QuickActionsProps {
  activeRoutine?: Routine | null;
  onCreateSession: (data: CreateWorkoutSessionData) => void;
}
