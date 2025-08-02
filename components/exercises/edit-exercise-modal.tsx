'use client';

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ExerciseModalForm } from './exercise-modal-form';
import type { Exercise } from '@/lib/db/schema/exercises';

interface EditExerciseModalProps {
  exercise: Exercise;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditExerciseModal({ exercise, open, onOpenChange }: EditExerciseModalProps) {
  const handleSuccess = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Edit Exercise</DialogTitle>
          <DialogDescription>Update the exercise details below.</DialogDescription>
        </DialogHeader>
        <ExerciseModalForm exercise={exercise} mode="edit" onSuccess={handleSuccess} />
      </DialogContent>
    </Dialog>
  );
}
