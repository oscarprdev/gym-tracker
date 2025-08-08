'use client';

import React from 'react';
import { Button } from '@/features/shared/components/ui/button';
import { Input } from '@/features/shared/components/ui/input';
import { Label } from '@/features/shared/components/ui/label';
import { Badge } from '@/features/shared/components/ui/badge';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/features/shared/components/ui/form';
import { useCreateExerciseForm } from '../hooks/use-create-exercise-form';
import { getMuscleGroupColor } from '@/features/shared/utils/muscle-groups';

const MUSCLE_GROUPS = ['Chest', 'Back', 'Shoulders', 'Biceps', 'Triceps', 'Legs', 'Core', 'Glutes'] as const;

interface CreateExerciseFormProps {
  onSuccess?: () => void;
}

export function CreateExerciseForm({ onSuccess }: CreateExerciseFormProps) {
  const { form, onSubmit, isPending } = useCreateExerciseForm({ onSuccess });

  const watchedMuscleGroups = form.watch('muscleGroups');

  const toggleMuscleGroup = (muscleGroup: (typeof MUSCLE_GROUPS)[number]) => {
    const currentGroups = form.getValues('muscleGroups');
    const newGroups = currentGroups.includes(muscleGroup)
      ? currentGroups.filter((group) => group !== muscleGroup)
      : [...currentGroups, muscleGroup];

    form.setValue('muscleGroups', newGroups, { shouldValidate: true });
  };

  return (
    <div className="exercises-light-theme bg-white">
      <Form {...form}>
        <form onSubmit={onSubmit} className="space-y-6 pt-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-black font-medium">Exercise Name</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="e.g., Bench Press, Squats"
                    className="border-black bg-white text-black placeholder:text-gray-500 focus:ring-black focus:border-black"
                    disabled={isPending}
                  />
                </FormControl>
                <FormMessage className="text-red-600" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="muscleGroups"
            render={() => (
              <FormItem>
                <FormLabel className="text-black font-medium">Muscle Groups</FormLabel>
                <FormControl>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      {MUSCLE_GROUPS.map((muscleGroup) => {
                        const isSelected = watchedMuscleGroups.includes(muscleGroup);
                        return (
                          <Button
                            key={muscleGroup}
                            type="button"
                            variant={isSelected ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => toggleMuscleGroup(muscleGroup)}
                            disabled={isPending}
                            className={
                              isSelected
                                ? 'bg-black text-white hover:bg-gray-800'
                                : 'border-black text-black hover:bg-gray-100'
                            }
                          >
                            {muscleGroup}
                          </Button>
                        );
                      })}
                    </div>

                    {watchedMuscleGroups.length > 0 && (
                      <div className="flex flex-wrap gap-2 p-3 border border-gray-300 rounded-md bg-gray-50">
                        <Label className="text-xs text-gray-600 w-full mb-1">Selected:</Label>
                        {watchedMuscleGroups.map((group) => (
                          <Badge key={group} variant="secondary" className={getMuscleGroupColor(group)}>
                            {group}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </FormControl>
                <FormMessage className="text-red-600" />
              </FormItem>
            )}
          />

          <div className="flex flex-col gap-3 pt-4">
            <Button
              type="submit"
              className="w-full bg-black text-white hover:bg-gray-800 border border-black"
              disabled={isPending}
            >
              {isPending ? 'Creating...' : 'Create Exercise'}
            </Button>

            <Button
              type="button"
              variant="outline"
              className="w-full border-black text-black hover:bg-gray-100"
              onClick={() => onSuccess?.()}
              disabled={isPending}
            >
              Cancel
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
