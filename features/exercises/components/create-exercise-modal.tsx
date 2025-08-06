'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/features/shared/components/ui/dialog';
import { ExerciseModalForm } from './exercise-modal-form';

interface CreateExerciseModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateExerciseModal({ open, onOpenChange }: CreateExerciseModalProps) {
  const handleSuccess = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Create New Exercise</DialogTitle>
          <DialogDescription>Add a new exercise to your library.</DialogDescription>
        </DialogHeader>
        <ExerciseModalForm mode="create" onSuccess={handleSuccess} />
      </DialogContent>
    </Dialog>
  );
}
