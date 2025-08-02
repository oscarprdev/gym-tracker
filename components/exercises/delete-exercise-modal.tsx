'use client';

import { useActionState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { deleteExerciseAction } from '@/app/exercises/actions';
import type { Exercise } from '@/lib/db/schema/exercises';

type FormState = {
  error: string | null;
  success: boolean;
};

interface DeleteExerciseModalProps {
  exercise: Exercise;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DeleteExerciseModal({ exercise, open, onOpenChange }: DeleteExerciseModalProps) {
  const [state, formAction, isPending] = useActionState(deleteExerciseAction.bind(null, exercise.id), {
    error: null,
    success: false,
  } as FormState);

  useEffect(() => {
    if ('success' in state && state.success) {
      onOpenChange(false);
    }
  }, [state, onOpenChange]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Exercise</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete &quot;{exercise.name}&quot;? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>

        {'error' in state && state.error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">{state.error}</div>
        )}

        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isPending}>
            Cancel
          </Button>
          <form action={formAction}>
            <Button type="submit" variant="destructive" disabled={isPending}>
              {isPending ? 'Deleting...' : 'Delete Exercise'}
            </Button>
          </form>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
