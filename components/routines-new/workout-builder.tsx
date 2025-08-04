'use client';

import { startTransition, useState } from 'react';
import { CreateWorkoutSidebar } from './create-workout-sidebar';
import { ExerciseSelectionSidebar } from './exercise-selection-sidebar';
import { ExerciseEditSidebar } from './exercise-edit-sidebar';
import type { Exercise } from '@/lib/db/schema/exercises';

export interface WorkoutExerciseConfig {
  id: string;
  exerciseId: string;
  name: string;
  muscleGroups: string[];
  position: number;
  sets: WorkoutSetConfig[];
}

export interface WorkoutSetConfig {
  id: string;
  setNumber: number;
  reps?: number;
  weight: number;
}

interface WorkoutBuilderProps {
  exercises: Exercise[];
  onWorkoutCreated: (workout: { name: string; exercises: WorkoutExerciseConfig[] }) => void;
  trigger?: React.ReactNode;
  initialWorkout?: {
    name: string;
    exercises: WorkoutExerciseConfig[];
  };
}

export function WorkoutBuilder({ exercises, onWorkoutCreated, trigger, initialWorkout }: WorkoutBuilderProps) {
  const [isExerciseSidebarOpen, setIsExerciseSidebarOpen] = useState(false);
  const [isEditSidebarOpen, setIsEditSidebarOpen] = useState(false);
  const [selectedExercises, setSelectedExercises] = useState<WorkoutExerciseConfig[]>(initialWorkout?.exercises || []);
  const [editingExercise, setEditingExercise] = useState<WorkoutExerciseConfig | null>(null);
  const [isCreateSidebarOpen, setIsCreateSidebarOpen] = useState(!!initialWorkout);

  const createDefaultSets = (count: number): WorkoutSetConfig[] => {
    return Array.from({ length: count }, (_, index) => ({
      id: crypto.randomUUID(),
      setNumber: index + 1,
      reps: 10,
      weight: 0,
    }));
  };

  const handleOpenExerciseSidebar = () => {
    setIsExerciseSidebarOpen(true);
  };

  const handleExerciseSelected = (exercise: Exercise) => {
    const newExercise: WorkoutExerciseConfig = {
      id: crypto.randomUUID(),
      exerciseId: exercise.id,
      name: exercise.name,
      muscleGroups: exercise.muscleGroups,
      position: selectedExercises.length + 1,
      sets: createDefaultSets(3),
    };
    startTransition(() => {
      setSelectedExercises((prev) => [...prev, newExercise]);
      setIsExerciseSidebarOpen(false);
    });
  };

  const handleExerciseRemoved = (exerciseId: string) => {
    setSelectedExercises((prev) => {
      const filtered = prev.filter((exercise) => exercise.id !== exerciseId);
      return filtered.map((exercise, index) => ({
        ...exercise,
        position: index + 1,
      }));
    });
  };

  const handleExerciseUpdated = (exerciseId: string, updates: Partial<WorkoutExerciseConfig>) => {
    startTransition(() => {
      setSelectedExercises((prev) =>
        prev.map((exercise) => (exercise.id === exerciseId ? { ...exercise, ...updates } : exercise))
      );
      setEditingExercise((prev) => (prev?.id === exerciseId ? { ...prev, ...updates } : prev));
    });
  };

  const handleExerciseReordered = (reorderedExercises: WorkoutExerciseConfig[]) => {
    setSelectedExercises(reorderedExercises);
  };

  const handleOpenEditSidebar = (exercise: WorkoutExerciseConfig) => {
    startTransition(() => {
      setEditingExercise({ ...exercise }); // Create a copy to ensure proper state update
      setIsEditSidebarOpen(true);
    });
  };

  const handleWorkoutCreated = (workout: { name: string; exercises: WorkoutExerciseConfig[] }) => {
    onWorkoutCreated(workout);
    startTransition(() => {
      setSelectedExercises([]);
      setIsCreateSidebarOpen(false);
    });
  };

  return (
    <>
      <CreateWorkoutSidebar
        selectedExercises={selectedExercises}
        onWorkoutCreated={handleWorkoutCreated}
        trigger={trigger}
        onOpenExerciseSidebar={handleOpenExerciseSidebar}
        onExerciseRemoved={handleExerciseRemoved}
        onExerciseReordered={handleExerciseReordered}
        onOpenEditSidebar={handleOpenEditSidebar}
        initialWorkoutName={initialWorkout?.name}
        isOpen={isCreateSidebarOpen}
        onOpenChange={setIsCreateSidebarOpen}
      />

      <ExerciseSelectionSidebar
        isOpen={isExerciseSidebarOpen}
        onOpenChange={setIsExerciseSidebarOpen}
        exercises={exercises}
        onExerciseSelected={handleExerciseSelected}
      />

      <ExerciseEditSidebar
        isOpen={isEditSidebarOpen}
        onOpenChange={(open) => {
          setIsEditSidebarOpen(open);
          if (!open) {
            setEditingExercise(null);
          }
        }}
        exercise={editingExercise}
        onExerciseUpdated={handleExerciseUpdated}
      />
    </>
  );
}
