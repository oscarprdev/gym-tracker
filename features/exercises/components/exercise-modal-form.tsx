'use client';

import { useActionState, useEffect, useState } from 'react';
import { Button } from '@/features/shared/components/ui/button';
import { Input } from '@/features/shared/components/ui/input';
import { Label } from '@/features/shared/components/ui/label';
import { Badge } from '@/features/shared/components/ui/badge';
import { Plus, X } from 'lucide-react';
import { createExerciseAction, updateExerciseAction } from '@/features/exercises/services/actions';
import type { Exercise } from '@/lib/db/schema/exercises';
import { MUSCLE_GROUPS } from '@/lib/utils';

type FormState = {
  error: string | null;
  success: boolean;
  fieldErrors?: Record<string, string[]>;
};

interface ExerciseModalFormProps {
  exercise?: Exercise;
  mode: 'create' | 'edit';
  onSuccess?: () => void;
}

export function ExerciseModalForm({ exercise, mode, onSuccess }: ExerciseModalFormProps) {
  const [muscleGroups, setMuscleGroups] = useState<string[]>(exercise?.muscleGroups || []);
  const [newMuscleGroup, setNewMuscleGroup] = useState('');

  const wrappedAction = async (prevState: FormState, formData: FormData): Promise<FormState> => {
    const result =
      mode === 'create'
        ? await createExerciseAction(prevState, formData)
        : await updateExerciseAction(exercise!.id, prevState, formData);
    return result as FormState;
  };

  const [state, formAction, isPending] = useActionState(wrappedAction, {
    error: '',
    success: false,
    fieldErrors: {},
  });

  useEffect(() => {
    if ('success' in state && state.success && onSuccess) {
      onSuccess();
    }
  }, [state, onSuccess]);

  const addMuscleGroup = (group: string) => {
    if (group && !muscleGroups.includes(group)) {
      setMuscleGroups([...muscleGroups, group]);
    }
    setNewMuscleGroup('');
  };

  const removeMuscleGroup = (group: string) => {
    setMuscleGroups(muscleGroups.filter((g) => g !== group));
  };

  return (
    <form action={formAction} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="name">Exercise Name</Label>
        <Input
          id="name"
          name="name"
          defaultValue={exercise?.name}
          placeholder="e.g., Bench Press"
          disabled={isPending}
          className={'fieldErrors' in state && state.fieldErrors?.name ? 'border-red-500' : ''}
        />
        {'fieldErrors' in state && state.fieldErrors?.name && (
          <p className="text-sm text-red-500">{state.fieldErrors.name[0]}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label>Muscle Groups</Label>
        <div className="flex flex-wrap gap-2 mb-2">
          {muscleGroups.map((group) => (
            <Badge key={group} variant="secondary" className="flex items-center gap-1">
              {group}
              <button
                type="button"
                onClick={() => removeMuscleGroup(group)}
                className="ml-1 hover:text-red-500"
                disabled={isPending}
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
        <div className="flex gap-2">
          <Input
            value={newMuscleGroup}
            onChange={(e) => setNewMuscleGroup(e.target.value)}
            placeholder="Add muscle group"
            disabled={isPending}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                addMuscleGroup(newMuscleGroup);
              }
            }}
          />
          <Button
            type="button"
            variant="outline"
            onClick={() => addMuscleGroup(newMuscleGroup)}
            disabled={isPending || !newMuscleGroup.trim()}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex flex-wrap gap-1 mt-2">
          {MUSCLE_GROUPS.map((group) => (
            <Button
              key={group}
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => addMuscleGroup(group)}
              disabled={isPending || muscleGroups.includes(group)}
              className="h-6 px-2 text-xs"
            >
              {group}
            </Button>
          ))}
        </div>
        <input type="hidden" name="muscleGroups" value={JSON.stringify(muscleGroups)} />
        {'fieldErrors' in state && state.fieldErrors?.muscleGroups && (
          <p className="text-sm text-red-500">{state.fieldErrors.muscleGroups[0]}</p>
        )}
      </div>

      {'error' in state && state.error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">{state.error}</div>
      )}

      <div className="flex gap-4">
        <Button type="submit" disabled={isPending || muscleGroups.length === 0} className="flex-1">
          {isPending ? 'Saving...' : mode === 'create' ? 'Create Exercise' : 'Update Exercise'}
        </Button>
      </div>
    </form>
  );
}
