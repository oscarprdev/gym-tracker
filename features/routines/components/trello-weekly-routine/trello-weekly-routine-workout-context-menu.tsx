'use client';

import React from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/features/shared/components/ui/dropdown-menu';
import type { WorkoutContextMenuProps, WorkoutContextAction } from './types';

export function WorkoutContextMenu({ workout, actions, onAction, trigger, align = 'end' }: WorkoutContextMenuProps) {
  const handleAction = (action: WorkoutContextAction) => {
    onAction(action, workout.id);
  };

  // Group actions by type for better UX
  const editActions = actions.filter((action) => ['edit', 'duplicate', 'move'].includes(action.type));
  const destructiveActions = actions.filter((action) => action.type === 'delete');

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{trigger}</DropdownMenuTrigger>

      <DropdownMenuContent align={align} className="w-48">
        {/* Edit and management actions */}
        {editActions.map((action) => {
          const IconComponent = action.icon;
          return (
            <DropdownMenuItem
              key={action.type}
              onClick={() => handleAction(action)}
              disabled={action.disabled}
              className="flex items-center gap-2 cursor-pointer"
            >
              <IconComponent className="h-4 w-4" />
              <span>{action.label}</span>
            </DropdownMenuItem>
          );
        })}

        {/* Separator before destructive actions */}
        {editActions.length > 0 && destructiveActions.length > 0 && <DropdownMenuSeparator />}

        {/* Destructive actions */}
        {destructiveActions.map((action) => {
          const IconComponent = action.icon;
          return (
            <DropdownMenuItem
              key={action.type}
              onClick={() => handleAction(action)}
              disabled={action.disabled}
              variant="destructive"
              className="flex items-center gap-2 cursor-pointer"
            >
              <IconComponent className="h-4 w-4" />
              <span>{action.label}</span>
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
