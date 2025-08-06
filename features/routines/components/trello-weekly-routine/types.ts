// Enhanced TypeScript interfaces for Trello-like weekly routine component
import type { WeeklyWorkout, WorkoutExerciseConfig } from '../types';

// Muscle group types with predefined options
export type MuscleGroup =
  | 'chest'
  | 'back'
  | 'shoulders'
  | 'biceps'
  | 'triceps'
  | 'legs'
  | 'glutes'
  | 'core'
  | 'cardio'
  | 'full-body';

// Enhanced workout card data structure for Trello display
export interface TrelloWorkoutCard extends WeeklyWorkout {
  muscleGroups: MuscleGroup[];
  totalExercises: number;
  totalSets: number;
  estimatedDuration: number;
  color?: string;
}

// Context menu action configuration
export interface WorkoutContextAction {
  type: 'edit' | 'delete' | 'move' | 'duplicate';
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  variant?: 'default' | 'destructive';
  disabled?: boolean;
}

// Drag and drop state management (DEPRECATED - kept for backwards compatibility)
export interface DragState {
  isDragging: boolean;
  draggedItem: TrelloWorkoutCard | null;
  draggedOverColumn: number | null;
  draggedOverIndex: number | null;
  dragStartTime: number | null;
}

// Select-based UI state management
export interface SelectState {
  isChangingDay: boolean;
  changingWorkoutId: string | null;
  pendingChanges: Record<string, number>; // workoutId -> newDay
  errors: Record<string, string>; // workoutId -> error message
}

// Enhanced drag result with additional metadata (DEPRECATED - kept for backwards compatibility)
export interface EnhancedDropResult {
  draggableId: string;
  type: string;
  source: {
    droppableId: string;
    index: number;
  };
  destination: {
    droppableId: string;
    index: number;
  } | null;
  reason: 'DROP' | 'CANCEL';
  mode: 'FLUID' | 'SNAP';
}

// Optimistic update result for error handling
export interface OptimisticUpdateResult<T> {
  success: boolean;
  data?: T;
  error?: string;
  rollbackData?: T;
}

// Handler types for new select-based operations
export type WorkoutDayChangeHandler = (workoutId: string, newDay: number) => void | Promise<void>;
export type CreateWorkoutForDayHandler = (dayOfWeek: number) => void | Promise<void>;

// Responsive layout configuration
export interface TrelloLayoutConfig {
  desktop: {
    orientation: 'horizontal';
    columns: 7;
    cardMinWidth: string;
    gap: string;
  };
  mobile: {
    orientation: 'vertical';
    columns: 1;
    cardFullWidth: boolean;
    gap: string;
  };
}

// Day column configuration
export interface TrelloDayColumn {
  value: number;
  label: string;
  shortLabel: string;
  workouts: TrelloWorkoutCard[];
  isActive: boolean;
}

// Component props for main Trello component
export interface TrelloWeeklyRoutineProps {
  routineName: string;
  onRoutineNameChange: (name: string) => void;
  weeklyWorkouts: WeeklyWorkout[];
  onWeeklyWorkoutsChange: (workouts: WeeklyWorkout[]) => void;
  onWorkoutUpdated: (workoutId: string, workout: { name: string; exercises: WorkoutExerciseConfig[] }) => void;
  onWorkoutRemoved: (workoutId: string) => void;
  onWorkoutDuplicated?: (workoutId: string) => void;
  isPending?: boolean;
  mode: 'create' | 'edit';
  enableContextMenu?: boolean;
  enableDragDrop?: boolean; // Deprecated - kept for backwards compatibility
  showRoutineSummary?: boolean;
}

// Day information for dropdowns and selection
export interface DayInfo {
  value: number;
  label: string;
  shortLabel: string;
}

// Workout card component props
export interface TrelloWorkoutCardProps {
  workout: TrelloWorkoutCard;
  index: number; // Kept for backwards compatibility
  dayOfWeek: number;
  isDragging?: boolean; // Deprecated - kept for backwards compatibility
  onEdit: (workout: { id: string }) => void; // Fixed to match actual usage
  onDelete: (workoutId: string) => void;
  onDuplicate?: (workoutId: string) => void;
  onDayChange?: (workoutId: string, newDay: number) => void;
  availableDays?: DayInfo[];
  enableContextMenu?: boolean;
  isChangingDay?: boolean;
  error?: string | null;
  className?: string;
}

// Day column component props
export interface TrelloDayColumnProps {
  day: TrelloDayColumn;
  workouts: TrelloWorkoutCard[];
  onWorkoutAction: (action: WorkoutContextAction, workoutId: string) => void;
  onWorkoutDayChange?: (workoutId: string, newDay: number) => void;
  onCreateWorkoutForDay?: (dayOfWeek: number) => void;
  availableDays?: DayInfo[];
  changingWorkoutId?: string | null;
  dayChangeError?: string | null;
  isDraggedOver?: boolean; // Deprecated - kept for backwards compatibility
  enableDropping?: boolean; // Deprecated - kept for backwards compatibility
  className?: string;
}

// Context menu component props
export interface WorkoutContextMenuProps {
  workout: TrelloWorkoutCard;
  actions: WorkoutContextAction[];
  onAction: (action: WorkoutContextAction, workoutId: string) => void;
  trigger: React.ReactNode;
  align?: 'start' | 'center' | 'end';
}

// Muscle group badge props
export interface MuscleGroupBadgeProps {
  muscleGroup: MuscleGroup;
  size?: 'sm' | 'md';
  showIcon?: boolean;
  className?: string;
}

// Visual feedback component props (DEPRECATED - kept for backwards compatibility)
export interface DragVisualFeedbackProps {
  isDragging: boolean;
  draggedItem: TrelloWorkoutCard | null;
  draggedOverColumn: number | null;
  children: React.ReactNode;
}

// Error handling props for optimistic updates
export interface ErrorFeedbackProps {
  error: string | null;
  onRetry?: () => void;
  onDismiss?: () => void;
}

// Utility types for muscle group operations
export interface MuscleGroupConfig {
  name: MuscleGroup;
  label: string;
  color: string;
  bgColor: string;
  borderColor: string;
  icon?: React.ComponentType<{ className?: string }>;
}

// Animation and transition configurations
export interface TrelloAnimationConfig {
  dragDuration: number; // Deprecated
  dropDuration: number; // Deprecated
  cardHover: string;
  columnHighlight: string;
  fadeIn: string;
  slideIn: string;
  selectTransition: string;
  dayChangeTransition: string;
}
