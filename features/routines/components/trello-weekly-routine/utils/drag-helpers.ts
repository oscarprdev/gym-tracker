// Utilities for enhanced drag-and-drop functionality in Trello-like weekly routine
import type { DropResult } from '@hello-pangea/dnd';
import type { WeeklyWorkout } from '../../types';
import type { TrelloWorkoutCard, MuscleGroup } from '../types';

// Enhanced drag result processor
export function processEnhancedDragResult(
  result: DropResult,
  weeklyWorkouts: WeeklyWorkout[]
): {
  type: 'reorder' | 'move' | 'cancel';
  updatedWorkouts: WeeklyWorkout[];
  movedWorkout?: WeeklyWorkout;
  sourceDay?: number;
  targetDay?: number;
} {
  const { source, destination, draggableId } = result;

  // Handle cancelled drop
  if (!destination) {
    return {
      type: 'cancel',
      updatedWorkouts: weeklyWorkouts,
    };
  }

  // No change if dropped in same position
  if (source.droppableId === destination.droppableId && source.index === destination.index) {
    return {
      type: 'cancel',
      updatedWorkouts: weeklyWorkouts,
    };
  }

  const sourceDay = parseInt(source.droppableId);
  const targetDay = parseInt(destination.droppableId);

  // Find the moved workout
  const movedWorkout = weeklyWorkouts.find((w) => w.id === draggableId);
  if (!movedWorkout) {
    return {
      type: 'cancel',
      updatedWorkouts: weeklyWorkouts,
    };
  }

  // Handle reordering within same day
  if (sourceDay === targetDay) {
    const dayWorkouts = weeklyWorkouts
      .filter((w) => w.dayOfWeek === sourceDay)
      .sort((a, b) => {
        const aIndex = weeklyWorkouts.findIndex((w) => w.id === a.id);
        const bIndex = weeklyWorkouts.findIndex((w) => w.id === b.id);
        return aIndex - bIndex;
      });

    // Remove and reinsert at new position
    const [removed] = dayWorkouts.splice(source.index, 1);
    dayWorkouts.splice(destination.index, 0, removed);

    // Reconstruct full workout list
    const updatedWorkouts = [...weeklyWorkouts.filter((w) => w.dayOfWeek !== sourceDay), ...dayWorkouts];

    return {
      type: 'reorder',
      updatedWorkouts,
      movedWorkout,
      sourceDay,
      targetDay,
    };
  }

  // Handle moving between days
  const sourceWorkouts = weeklyWorkouts
    .filter((w) => w.dayOfWeek === sourceDay && w.id !== draggableId)
    .sort((a, b) => {
      const aIndex = weeklyWorkouts.findIndex((w) => w.id === a.id);
      const bIndex = weeklyWorkouts.findIndex((w) => w.id === b.id);
      return aIndex - bIndex;
    });

  const targetWorkouts = weeklyWorkouts
    .filter((w) => w.dayOfWeek === targetDay)
    .sort((a, b) => {
      const aIndex = weeklyWorkouts.findIndex((w) => w.id === a.id);
      const bIndex = weeklyWorkouts.findIndex((w) => w.id === b.id);
      return aIndex - bIndex;
    });

  // Update moved workout's day
  const updatedMovedWorkout = {
    ...movedWorkout,
    dayOfWeek: targetDay,
  };

  // Insert at destination position
  targetWorkouts.splice(destination.index, 0, updatedMovedWorkout);

  // Reconstruct full workout list
  const updatedWorkouts = [
    ...weeklyWorkouts.filter((w) => w.dayOfWeek !== sourceDay && w.dayOfWeek !== targetDay),
    ...sourceWorkouts,
    ...targetWorkouts,
  ];

  return {
    type: 'move',
    updatedWorkouts,
    movedWorkout: updatedMovedWorkout,
    sourceDay,
    targetDay,
  };
}

// Calculate workout statistics
export function calculateWorkoutStats(workout: WeeklyWorkout): {
  totalExercises: number;
  totalSets: number;
  estimatedDuration: number;
  muscleGroups: string[];
} {
  const totalExercises = workout.exercises.length;
  const totalSets = workout.exercises.reduce((sum, ex) => sum + ex.sets.length, 0);
  const estimatedDuration = totalExercises * 5; // 5 minutes per exercise

  // Extract unique muscle groups
  const muscleGroups = Array.from(new Set(workout.exercises.flatMap((ex) => ex.muscleGroups || [])));

  return {
    totalExercises,
    totalSets,
    estimatedDuration,
    muscleGroups,
  };
}

// Convert WeeklyWorkout to TrelloWorkoutCard
export function convertToTrelloCard(workout: WeeklyWorkout): TrelloWorkoutCard {
  const stats = calculateWorkoutStats(workout);

  return {
    ...workout,
    muscleGroups: stats.muscleGroups as MuscleGroup[], // Type assertion for muscle groups
    totalExercises: stats.totalExercises,
    totalSets: stats.totalSets,
    estimatedDuration: stats.estimatedDuration,
  };
}

// Group workouts by day for Trello display
export function groupWorkoutsByDay(workouts: WeeklyWorkout[]): Record<number, TrelloWorkoutCard[]> {
  const grouped = workouts.reduce(
    (acc, workout) => {
      const day = workout.dayOfWeek;
      if (!acc[day]) {
        acc[day] = [];
      }
      acc[day].push(convertToTrelloCard(workout));
      return acc;
    },
    {} as Record<number, TrelloWorkoutCard[]>
  );

  // Sort workouts within each day by their original order
  Object.keys(grouped).forEach((day) => {
    const dayNum = parseInt(day);
    grouped[dayNum] = grouped[dayNum].sort((a, b) => {
      const aIndex = workouts.findIndex((w) => w.id === a.id);
      const bIndex = workouts.findIndex((w) => w.id === b.id);
      return aIndex - bIndex;
    });
  });

  return grouped;
}

// Validate drag operation
export function validateDragOperation(
  sourceDay: number,
  targetDay: number,
  workoutId: string,
  workouts: WeeklyWorkout[]
): {
  isValid: boolean;
  reason?: string;
} {
  // Basic validation
  if (sourceDay < 0 || sourceDay > 6) {
    return { isValid: false, reason: 'Invalid source day' };
  }

  if (targetDay < 0 || targetDay > 6) {
    return { isValid: false, reason: 'Invalid target day' };
  }

  const workout = workouts.find((w) => w.id === workoutId);
  if (!workout) {
    return { isValid: false, reason: 'Workout not found' };
  }

  // Could add more validation rules here, such as:
  // - Maximum workouts per day
  // - Workout type restrictions
  // - User permission checks

  return { isValid: true };
}

// Generate drag animation styles
export function getDragAnimationStyles(isDragging: boolean, isDropAnimating?: boolean) {
  const baseStyles = {
    transition: 'all 200ms cubic-bezier(0.2, 0, 0, 1)',
  };

  if (isDragging) {
    return {
      ...baseStyles,
      transform: 'rotate(5deg) scale(1.02)',
      boxShadow: '0 8px 25px rgba(0, 0, 0, 0.15)',
      zIndex: 9999,
    };
  }

  if (isDropAnimating) {
    return {
      ...baseStyles,
      transform: 'scale(1)',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
    };
  }

  return baseStyles;
}

// Get drop zone visual feedback styles
export function getDropZoneStyles(isDraggedOver: boolean, isValidDropTarget: boolean = true) {
  if (!isDraggedOver) {
    return {
      backgroundColor: 'transparent',
      border: '2px dashed transparent',
    };
  }

  if (!isValidDropTarget) {
    return {
      backgroundColor: 'rgb(254 242 242)', // red-50
      border: '2px dashed rgb(248 113 113)', // red-400
    };
  }

  return {
    backgroundColor: 'rgb(239 246 255)', // blue-50
    border: '2px dashed rgb(96 165 250)', // blue-400
  };
}
