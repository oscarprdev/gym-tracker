'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ExerciseCard } from '@/components/exercises/exercise-card';
import { CreateExerciseModal } from '@/components/exercises/create-exercise-modal';
import type { Exercise } from '@/lib/db/schema/exercises';

interface ExercisesClientProps {
  allExercises: Exercise[];
  customExercises: Exercise[];
}

export function ExercisesClient({ allExercises, customExercises }: ExercisesClientProps) {
  const [createModalOpen, setCreateModalOpen] = useState(false);

  if (allExercises.length === 0) {
    return (
      <>
        <div className="flex flex-col items-center justify-center p-8 text-center">
          <h3 className="text-lg font-semibold text-foreground mb-2">No exercises found</h3>
          <p className="text-muted-foreground mb-4 max-w-sm">
            Start building your exercise library by creating your first exercise.
          </p>
          <Button onClick={() => setCreateModalOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Create Exercise
          </Button>
        </div>
        <CreateExerciseModal open={createModalOpen} onOpenChange={setCreateModalOpen} />
      </>
    );
  }

  return (
    <>
      <div className="flex justify-end mb-6">
        <Button onClick={() => setCreateModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Create Exercise
        </Button>
      </div>

      <div className="space-y-8">
        {customExercises.length > 0 && (
          <section>
            <h2 className="text-xl font-semibold mb-4">Your Custom Exercises</h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {customExercises.map((exercise) => (
                <ExerciseCard key={exercise.id} exercise={exercise} isCustom />
              ))}
            </div>
          </section>
        )}

        <section>
          <h2 className="text-xl font-semibold mb-4">
            {customExercises.length > 0 ? 'Built-in Exercises' : 'All Exercises'}
          </h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {allExercises
              .filter((exercise) => !exercise.isCustom)
              .map((exercise) => (
                <ExerciseCard key={exercise.id} exercise={exercise} isCustom={false} />
              ))}
          </div>
        </section>
      </div>

      <CreateExerciseModal open={createModalOpen} onOpenChange={setCreateModalOpen} />
    </>
  );
}
