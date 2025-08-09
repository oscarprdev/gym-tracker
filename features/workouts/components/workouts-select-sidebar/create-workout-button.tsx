'use client';

import { Button } from '@/features/shared/components/ui/button';
import { Plus } from 'lucide-react';
import { CreateWorkoutButtonProps } from './types';

export const CreateWorkoutButton = ({ onCreateWorkout }: CreateWorkoutButtonProps) => {
  return (
    <div className="p-4 border-b">
      <Button variant="outline" className="w-full justify-start" onClick={onCreateWorkout}>
        <Plus className="mr-2 h-4 w-4" />
        Create New Workout
      </Button>
    </div>
  );
};
