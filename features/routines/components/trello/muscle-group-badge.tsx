'use client';

import React from 'react';
import { cn } from '@/lib/utils/cn';
import { getMuscleGroupConfig, getMuscleGroupBadgeClasses } from './utils/muscle-group-colors';
import type { MuscleGroupBadgeProps } from './trello-weekly-routine.types';

export function MuscleGroupBadge({ muscleGroup, size = 'sm', showIcon = true, className }: MuscleGroupBadgeProps) {
  const config = getMuscleGroupConfig(muscleGroup);
  const badgeClasses = getMuscleGroupBadgeClasses(muscleGroup, size);

  const IconComponent = config.icon;

  return (
    <span className={cn(badgeClasses, className)} title={config.label}>
      {showIcon && IconComponent && <IconComponent className={size === 'sm' ? 'w-3 h-3' : 'w-4 h-4'} />}
      <span className="truncate">{config.label}</span>
    </span>
  );
}

// Compound component for displaying multiple muscle group badges
export function MuscleGroupBadgeList({
  muscleGroups,
  maxVisible = 3,
  size = 'sm',
  showIcon = false,
  className,
}: {
  muscleGroups: string[];
  maxVisible?: number;
  size?: 'sm' | 'md';
  showIcon?: boolean;
  className?: string;
}) {
  // Filter and validate muscle groups
  const validMuscleGroups = muscleGroups.filter((group) =>
    ['chest', 'back', 'shoulders', 'biceps', 'triceps', 'legs', 'glutes', 'core', 'cardio', 'full-body'].includes(group)
  ) as Array<
    'chest' | 'back' | 'shoulders' | 'biceps' | 'triceps' | 'legs' | 'glutes' | 'core' | 'cardio' | 'full-body'
  >;

  const visibleGroups = validMuscleGroups.slice(0, maxVisible);
  const hiddenCount = validMuscleGroups.length - maxVisible;

  if (validMuscleGroups.length === 0) {
    return null;
  }

  return (
    <div className={cn('flex flex-wrap items-center gap-1', className)}>
      {visibleGroups.map((muscleGroup) => (
        <MuscleGroupBadge key={muscleGroup} muscleGroup={muscleGroup} size={size} showIcon={showIcon} />
      ))}
      {hiddenCount > 0 && (
        <span
          className={cn(
            'inline-flex items-center rounded-full border font-medium',
            'text-gray-600 bg-gray-50 border-gray-200',
            size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-sm'
          )}
          title={`${hiddenCount} more muscle groups`}
        >
          +{hiddenCount}
        </span>
      )}
    </div>
  );
}
