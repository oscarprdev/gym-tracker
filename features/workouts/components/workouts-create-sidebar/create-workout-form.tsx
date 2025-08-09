'use client';

import React from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/features/shared/components/ui/button';
import { Input } from '@/features/shared/components/ui/input';
import { Label } from '@/features/shared/components/ui/label';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/features/shared/components/ui/form';
import { useCreateWorkoutForm } from '../../hooks/use-create-workout-form';
import { CreateWorkoutData } from '../../validations';
import { ActionResponse } from '@/features/shared/types';

interface CreateWorkoutFormProps {
  onSubmitFormAction: (data: CreateWorkoutData) => Promise<ActionResponse | void>;
  onOpenChange: (isOpen: boolean) => void;
}

export function CreateWorkoutForm({ onSubmitFormAction, onOpenChange }: CreateWorkoutFormProps) {
  const { form, onSubmit, isPending } = useCreateWorkoutForm({ onSubmitFormAction });

  return (
    <div className="routines-light-theme bg-white">
      <Form {...form}>
        <form onSubmit={onSubmit} className="space-y-6 pt-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-black font-medium">Workout Name</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="e.g., Chest & Triceps"
                    className="border-black bg-white text-black placeholder:text-gray-500 focus:ring-black focus:border-black"
                    disabled={isPending}
                  />
                </FormControl>
                <FormMessage className="text-red-600" />
              </FormItem>
            )}
          />

          <div className="space-y-4">
            <Label className="text-black font-medium">Exercises</Label>
            <div className="border border-gray-300 rounded-md p-4 bg-gray-50">
              <div className="text-center py-8">
                <p className="text-gray-600 mb-4">Add exercises to your workout after creating it</p>
                <Button type="button" variant="outline" className="border-black text-black hover:bg-gray-100" disabled>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Exercises
                </Button>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3 pt-4">
            <Button
              type="submit"
              className="w-full bg-black text-white hover:bg-gray-800 border border-black"
              disabled={isPending}
            >
              {isPending ? 'Creating...' : 'Create Workout'}
            </Button>

            <Button
              type="button"
              variant="outline"
              className="w-full border-black text-black hover:bg-gray-100"
              onClick={() => onOpenChange(false)}
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
