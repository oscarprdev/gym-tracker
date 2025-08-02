// Application constants
export const APP_NAME = 'Gym Tracker';
export const APP_DESCRIPTION =
  'Track your workouts, plan your routines, and achieve your fitness goals.';

// Pagination
export const DEFAULT_PAGE_SIZE = 20;
export const MAX_PAGE_SIZE = 100;

// Exercise categories
export const EXERCISE_CATEGORIES = [
  'Chest',
  'Back',
  'Shoulders',
  'Arms',
  'Legs',
  'Core',
  'Cardio',
  'Full Body',
] as const;

// Muscle groups
export const MUSCLE_GROUPS = [
  'Chest',
  'Back',
  'Shoulders',
  'Biceps',
  'Triceps',
  'Forearms',
  'Quadriceps',
  'Hamstrings',
  'Glutes',
  'Calves',
  'Abs',
  'Obliques',
] as const;

// Equipment types
export const EQUIPMENT_TYPES = [
  'Barbell',
  'Dumbbell',
  'Kettlebell',
  'Cable',
  'Machine',
  'Bodyweight',
  'Resistance Band',
  'TRX',
  'Other',
] as const;

// Workout statuses
export const WORKOUT_STATUSES = [
  'planned',
  'in_progress',
  'completed',
  'skipped',
] as const;

export type ExerciseCategory = (typeof EXERCISE_CATEGORIES)[number];
export type MuscleGroup = (typeof MUSCLE_GROUPS)[number];
export type EquipmentType = (typeof EQUIPMENT_TYPES)[number];
export type WorkoutStatus = (typeof WORKOUT_STATUSES)[number];
