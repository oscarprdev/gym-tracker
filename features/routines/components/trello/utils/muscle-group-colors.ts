// Muscle group color mapping and utilities for Trello-like workout cards
import { Target, Heart, Zap, Dumbbell, Activity, Flame, Waves } from 'lucide-react';
import type { MuscleGroup, MuscleGroupConfig } from '../trello-weekly-routine.types';

// Comprehensive muscle group configuration with colors and icons
export const MUSCLE_GROUP_CONFIG: Record<MuscleGroup, MuscleGroupConfig> = {
  chest: {
    name: 'chest',
    label: 'Chest',
    color: 'text-red-700',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200',
    icon: Target,
  },
  back: {
    name: 'back',
    label: 'Back',
    color: 'text-blue-700',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    icon: Activity,
  },
  shoulders: {
    name: 'shoulders',
    label: 'Shoulders',
    color: 'text-amber-700',
    bgColor: 'bg-amber-50',
    borderColor: 'border-amber-200',
    icon: Zap,
  },
  biceps: {
    name: 'biceps',
    label: 'Biceps',
    color: 'text-green-700',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200',
    icon: Dumbbell,
  },
  triceps: {
    name: 'triceps',
    label: 'Triceps',
    color: 'text-emerald-700',
    bgColor: 'bg-emerald-50',
    borderColor: 'border-emerald-200',
    icon: Dumbbell,
  },
  legs: {
    name: 'legs',
    label: 'Legs',
    color: 'text-purple-700',
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-200',
    icon: Activity,
  },
  glutes: {
    name: 'glutes',
    label: 'Glutes',
    color: 'text-pink-700',
    bgColor: 'bg-pink-50',
    borderColor: 'border-pink-200',
    icon: Target,
  },
  core: {
    name: 'core',
    label: 'Core',
    color: 'text-orange-700',
    bgColor: 'bg-orange-50',
    borderColor: 'border-orange-200',
    icon: Flame,
  },
  cardio: {
    name: 'cardio',
    label: 'Cardio',
    color: 'text-rose-700',
    bgColor: 'bg-rose-50',
    borderColor: 'border-rose-200',
    icon: Heart,
  },
  'full-body': {
    name: 'full-body',
    label: 'Full Body',
    color: 'text-violet-700',
    bgColor: 'bg-violet-50',
    borderColor: 'border-violet-200',
    icon: Waves,
  },
};

// Dark mode variants for muscle group colors
export const MUSCLE_GROUP_CONFIG_DARK: Record<MuscleGroup, Partial<MuscleGroupConfig>> = {
  chest: {
    color: 'text-red-300',
    bgColor: 'bg-red-900/20',
    borderColor: 'border-red-800',
  },
  back: {
    color: 'text-blue-300',
    bgColor: 'bg-blue-900/20',
    borderColor: 'border-blue-800',
  },
  shoulders: {
    color: 'text-amber-300',
    bgColor: 'bg-amber-900/20',
    borderColor: 'border-amber-800',
  },
  biceps: {
    color: 'text-green-300',
    bgColor: 'bg-green-900/20',
    borderColor: 'border-green-800',
  },
  triceps: {
    color: 'text-emerald-300',
    bgColor: 'bg-emerald-900/20',
    borderColor: 'border-emerald-800',
  },
  legs: {
    color: 'text-purple-300',
    bgColor: 'bg-purple-900/20',
    borderColor: 'border-purple-800',
  },
  glutes: {
    color: 'text-pink-300',
    bgColor: 'bg-pink-900/20',
    borderColor: 'border-pink-800',
  },
  core: {
    color: 'text-orange-300',
    bgColor: 'bg-orange-900/20',
    borderColor: 'border-orange-800',
  },
  cardio: {
    color: 'text-rose-300',
    bgColor: 'bg-rose-900/20',
    borderColor: 'border-rose-800',
  },
  'full-body': {
    color: 'text-violet-300',
    bgColor: 'bg-violet-900/20',
    borderColor: 'border-violet-800',
  },
};

// Utility functions for muscle group operations
export function getMuscleGroupConfig(muscleGroup: MuscleGroup, isDark = false): MuscleGroupConfig {
  const baseConfig = MUSCLE_GROUP_CONFIG[muscleGroup];
  if (isDark) {
    const darkConfig = MUSCLE_GROUP_CONFIG_DARK[muscleGroup];
    return { ...baseConfig, ...darkConfig };
  }
  return baseConfig;
}

export function extractMuscleGroups(exercises: Array<{ muscleGroups?: string[] }>): MuscleGroup[] {
  const allMuscleGroups = exercises
    .flatMap((exercise) => exercise.muscleGroups || [])
    .filter((group): group is MuscleGroup => Object.keys(MUSCLE_GROUP_CONFIG).includes(group));

  // Remove duplicates and return unique muscle groups
  return Array.from(new Set(allMuscleGroups));
}

export function getMuscleGroupPriority(muscleGroup: MuscleGroup): number {
  // Define priority order for muscle groups (lower number = higher priority)
  const priorities: Record<MuscleGroup, number> = {
    'full-body': 1,
    chest: 2,
    back: 3,
    shoulders: 4,
    legs: 5,
    glutes: 6,
    biceps: 7,
    triceps: 8,
    core: 9,
    cardio: 10,
  };

  return priorities[muscleGroup] || 99;
}

export function sortMuscleGroupsByPriority(muscleGroups: MuscleGroup[]): MuscleGroup[] {
  return muscleGroups.sort((a, b) => getMuscleGroupPriority(a) - getMuscleGroupPriority(b));
}

export function getDisplayMuscleGroups(
  muscleGroups: MuscleGroup[],
  maxDisplay = 3
): {
  visible: MuscleGroup[];
  hidden: MuscleGroup[];
  hasMore: boolean;
} {
  const sorted = sortMuscleGroupsByPriority(muscleGroups);
  const visible = sorted.slice(0, maxDisplay);
  const hidden = sorted.slice(maxDisplay);

  return {
    visible,
    hidden,
    hasMore: hidden.length > 0,
  };
}

export function getMuscleGroupBadgeClasses(muscleGroup: MuscleGroup, size: 'sm' | 'md' = 'sm', isDark = false): string {
  const config = getMuscleGroupConfig(muscleGroup, isDark);
  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-sm';

  return `inline-flex items-center gap-1 rounded-full border font-medium ${sizeClasses} ${config.color} ${config.bgColor} ${config.borderColor}`;
}

// Utility to generate contrasting colors for custom muscle groups
export function generateMuscleGroupColor(muscleGroup: string): Partial<MuscleGroupConfig> {
  // Simple hash function to generate consistent colors
  let hash = 0;
  for (let i = 0; i < muscleGroup.length; i++) {
    const char = muscleGroup.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32-bit integer
  }

  const colors = [
    { color: 'text-indigo-700', bgColor: 'bg-indigo-50', borderColor: 'border-indigo-200' },
    { color: 'text-teal-700', bgColor: 'bg-teal-50', borderColor: 'border-teal-200' },
    { color: 'text-cyan-700', bgColor: 'bg-cyan-50', borderColor: 'border-cyan-200' },
    { color: 'text-sky-700', bgColor: 'bg-sky-50', borderColor: 'border-sky-200' },
    { color: 'text-lime-700', bgColor: 'bg-lime-50', borderColor: 'border-lime-200' },
  ];

  return colors[Math.abs(hash) % colors.length];
}
