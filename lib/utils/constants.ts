export const APP_NAME = 'Gym Tracker';
export const APP_DESCRIPTION = 'Track your workouts, plan your routines, and achieve your fitness goals.';

export const DEFAULT_PAGE_SIZE = 20;
export const MAX_PAGE_SIZE = 100;

export const MUSCLE_GROUPS = [
  'Chest',
  'Back',
  'Shoulders',
  'Biceps',
  'Triceps',
  'Quadriceps',
  'Glutes',
  'Abs',
] as const;

export type MuscleGroup = (typeof MUSCLE_GROUPS)[number];
