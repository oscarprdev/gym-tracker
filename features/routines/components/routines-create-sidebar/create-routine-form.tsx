'use client';

import React, { PropsWithChildren } from 'react';
import { Button } from '@/features/shared/components/ui/button';
import { Input } from '@/features/shared/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/features/shared/components/ui/form';
import { useCreateRoutineForm } from '../../hooks/use-create-routine-form';
import { CreateRoutineFormValues } from '../../validations';
import { ActionResponse } from '@/features/shared/types';

interface CreateRoutineFormProps {
  onSubmitFormAction: (data: CreateRoutineFormValues) => Promise<ActionResponse | void>;
  onOpenChange: (isOpen: boolean) => void;
}

export function CreateRoutineForm({
  onSubmitFormAction,
  onOpenChange,
  children,
}: PropsWithChildren<CreateRoutineFormProps>) {
  const { form, onSubmit, isPending } = useCreateRoutineForm({ onSubmitFormAction });

  return (
    <div className="routines-light-theme bg-white">
      <Form {...form}>
        <form onSubmit={onSubmit} className="space-y-6 pt-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-black font-medium">Routine Name</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="e.g., Upper Body Strength"
                    className="border-black bg-white text-black placeholder:text-gray-500 focus:ring-black focus:border-black"
                    disabled={isPending}
                  />
                </FormControl>
                <FormMessage className="text-red-600" />
              </FormItem>
            )}
          />

          {children}

          <div className="flex flex-col gap-3 pt-4">
            <Button
              type="submit"
              className="w-full bg-black text-white hover:bg-gray-800 border border-black"
              disabled={isPending}
            >
              {isPending ? 'Creating...' : 'Create Routine'}
            </Button>

            <Button
              type="button"
              variant="outline"
              className="w-full border-black text-black hover:bg-gray-100"
              disabled={isPending}
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
