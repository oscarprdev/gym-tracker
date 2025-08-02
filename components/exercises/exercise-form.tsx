'use client';

import { useActionState, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, X } from 'lucide-react';
import { createExerciseAction, updateExerciseAction } from '@/app/exercises/actions';
import type { Exercise } from '@/lib/db/schema/exercises';

interface ExerciseFormProps {
  exercise?: Exercise;
  mode: 'create' | 'edit';
}

const COMMON_MUSCLE_GROUPS = [
  'Chest',
  'Back',
  'Shoulders',
  'Arms',
  'Legs',
  'Core',
  'Glutes',
  'Biceps',
  'Triceps',
  'Quadriceps',
  'Hamstrings',
  'Calves',
];

const COMMON_EQUIPMENT = [
  'Barbell',
  'Dumbbell',
  'Cable',
  'Machine',
  'Bodyweight',
  'Resistance Band',
  'Kettlebell',
  'Pull-up Bar',
  'Bench',
  'Smith Machine',
];

export function ExerciseForm({ exercise, mode }: ExerciseFormProps) {
  const router = useRouter();
  const [muscleGroups, setMuscleGroups] = useState<string[]>(exercise?.muscleGroups || []);
  const [instructions, setInstructions] = useState<string[]>(exercise?.instructions || []);
  const [newMuscleGroup, setNewMuscleGroup] = useState('');
  const [newInstruction, setNewInstruction] = useState('');

  const action = mode === 'create' ? createExerciseAction : updateExerciseAction.bind(null, exercise!.id);

  const [state, formAction, isPending] = useActionState(action, {
    error: '',
    fieldErrors: {},
  });

  const addMuscleGroup = (group: string) => {
    if (group && !muscleGroups.includes(group)) {
      setMuscleGroups([...muscleGroups, group]);
    }
    setNewMuscleGroup('');
  };

  const removeMuscleGroup = (group: string) => {
    setMuscleGroups(muscleGroups.filter((g) => g !== group));
  };

  const addInstruction = () => {
    if (newInstruction.trim()) {
      setInstructions([...instructions, newInstruction.trim()]);
      setNewInstruction('');
    }
  };

  const removeInstruction = (index: number) => {
    setInstructions(instructions.filter((_, i) => i !== index));
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>{mode === 'create' ? 'Create New Exercise' : 'Edit Exercise'}</CardTitle>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Exercise Name</Label>
            <Input
              id="name"
              name="name"
              defaultValue={exercise?.name}
              placeholder="e.g., Bench Press"
              disabled={isPending}
              className={state.fieldErrors?.name ? 'border-red-500' : ''}
            />
            {state.fieldErrors?.name && <p className="text-sm text-red-500">{state.fieldErrors.name[0]}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <textarea
              id="description"
              name="description"
              defaultValue={exercise?.description || ''}
              placeholder="Brief description of the exercise..."
              className="w-full min-h-[100px] px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y"
              disabled={isPending}
            />
            {state.fieldErrors?.description && (
              <p className="text-sm text-red-500">{state.fieldErrors.description[0]}</p>
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
              {COMMON_MUSCLE_GROUPS.map((group) => (
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
            {state.fieldErrors?.muscleGroups && (
              <p className="text-sm text-red-500">{state.fieldErrors.muscleGroups[0]}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="equipment">Equipment (Optional)</Label>
            <Input
              id="equipment"
              name="equipment"
              defaultValue={exercise?.equipment || ''}
              placeholder="e.g., Barbell, Dumbbells"
              disabled={isPending}
              list="equipment-options"
            />
            <datalist id="equipment-options">
              {COMMON_EQUIPMENT.map((equipment) => (
                <option key={equipment} value={equipment} />
              ))}
            </datalist>
            {state.fieldErrors?.equipment && <p className="text-sm text-red-500">{state.fieldErrors.equipment[0]}</p>}
          </div>

          <div className="space-y-2">
            <Label>Instructions (Optional)</Label>
            <div className="space-y-2">
              {instructions.map((instruction, index) => (
                <div key={index} className="flex items-start gap-2">
                  <span className="text-sm text-gray-500 mt-2">{index + 1}.</span>
                  <div className="flex-1 p-2 bg-gray-50 rounded border">{instruction}</div>
                  <button
                    type="button"
                    onClick={() => removeInstruction(index)}
                    className="mt-2 text-red-500 hover:text-red-700"
                    disabled={isPending}
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                value={newInstruction}
                onChange={(e) => setNewInstruction(e.target.value)}
                placeholder="Add instruction step"
                disabled={isPending}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addInstruction();
                  }
                }}
              />
              <Button
                type="button"
                variant="outline"
                onClick={addInstruction}
                disabled={isPending || !newInstruction.trim()}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <input type="hidden" name="instructions" value={JSON.stringify(instructions)} />
            {state.fieldErrors?.instructions && (
              <p className="text-sm text-red-500">{state.fieldErrors.instructions[0]}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="imageUrl">Image URL (Optional)</Label>
            <Input
              id="imageUrl"
              name="imageUrl"
              type="url"
              defaultValue={exercise?.imageUrl || ''}
              placeholder="https://example.com/exercise-image.jpg"
              disabled={isPending}
            />
            {state.fieldErrors?.imageUrl && <p className="text-sm text-red-500">{state.fieldErrors.imageUrl[0]}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="videoUrl">Video URL (Optional)</Label>
            <Input
              id="videoUrl"
              name="videoUrl"
              type="url"
              defaultValue={exercise?.videoUrl || ''}
              placeholder="https://youtube.com/watch?v=..."
              disabled={isPending}
            />
            {state.fieldErrors?.videoUrl && <p className="text-sm text-red-500">{state.fieldErrors.videoUrl[0]}</p>}
          </div>

          {state.error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">{state.error}</div>
          )}

          <div className="flex gap-4">
            <Button type="submit" disabled={isPending || muscleGroups.length === 0} className="flex-1">
              {isPending ? 'Saving...' : mode === 'create' ? 'Create Exercise' : 'Update Exercise'}
            </Button>
            <Button type="button" variant="outline" onClick={() => router.back()} disabled={isPending}>
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
