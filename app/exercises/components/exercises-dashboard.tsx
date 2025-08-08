'use client';

import { useState } from 'react';
import { ExercisesSidebar } from '@/features/exercises/components/exercises-sidebar';
import type { ExerciseRecord } from '@/lib/db/queries/exercises/get-user-exercises';

interface ExercisesDashboardProps {
  exercises: ExerciseRecord[];
}

export function ExercisesDashboard({ exercises }: ExercisesDashboardProps) {
  const [selectedExerciseId, setSelectedExerciseId] = useState<string>();

  const selectedExercise = selectedExerciseId
    ? exercises.find((exercise) => exercise.id === selectedExerciseId)
    : undefined;

  return (
    <div className="flex h-screen">
      <ExercisesSidebar
        exercises={exercises}
        selectedExerciseId={selectedExerciseId}
        onExerciseSelect={setSelectedExerciseId}
      />

      <div className="flex-1 flex items-center justify-center bg-white">
        {selectedExercise ? (
          <div className="max-w-2xl mx-auto p-8">
            <h1 className="text-3xl font-bold text-black mb-4">{selectedExercise.name}</h1>
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Muscle Groups:</h3>
              <div className="flex flex-wrap gap-2">
                {selectedExercise.muscleGroups.map((group) => (
                  <span key={group} className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm font-medium">
                    {group}
                  </span>
                ))}
              </div>
            </div>
            <div className="text-gray-600">
              <p>Created: {selectedExercise.createdAt.toLocaleDateString()}</p>
              <p>Updated: {selectedExercise.updatedAt.toLocaleDateString()}</p>
            </div>
          </div>
        ) : (
          <div className="text-center text-gray-500">
            <h2 className="text-2xl font-semibold mb-2">Select an Exercise</h2>
            <p>Choose an exercise from the sidebar to view its details</p>
          </div>
        )}
      </div>
    </div>
  );
}
