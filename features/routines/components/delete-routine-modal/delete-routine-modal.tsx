'use client';

import { useActionState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/features/shared/components/ui/dialog';
import { Button } from '@/features/shared/components/ui/button';
import { deleteRoutineAction } from '@/features/routines/services/actions';
import type { DeleteRoutineFormState, DeleteRoutineModalProps } from './types';

export function DeleteRoutineModal({ routineId, routineName, open, onOpenChange }: DeleteRoutineModalProps) {
  const [state, formAction, isPending] = useActionState(deleteRoutineAction, {
    error: null,
  } as DeleteRoutineFormState);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Routine</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete &quot;{routineName}&quot;? This action cannot be undone and will remove all
            workouts and exercises associated with this routine.
          </DialogDescription>
        </DialogHeader>

        {state.error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">{state.error}</div>
        )}

        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isPending}>
            Cancel
          </Button>
          <form action={formAction}>
            <input type="hidden" name="routineId" value={routineId} />
            <Button type="submit" variant="destructive" disabled={isPending}>
              {isPending ? 'Deleting...' : 'Delete Routine'}
            </Button>
          </form>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
