'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ArrowLeft, Search, X, Loader2 } from 'lucide-react';
import { getMuscleGroupColor, MUSCLE_GROUP_COLORS } from '@/lib/utils/muscle-groups';
import { useState, useEffect, useMemo, useCallback } from 'react';
import { getExercisesByMuscleGroupsAction, getDefaultExercisesAction } from '@/app/exercises/actions';
import type { Exercise } from '@/lib/db/schema/exercises';

interface ExerciseSelectionSidebarProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onExerciseSelected: (exercise: Exercise) => void;
}

export function ExerciseSelectionSidebar({ isOpen, onOpenChange, onExerciseSelected }: ExerciseSelectionSidebarProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMuscleGroups, setSelectedMuscleGroups] = useState<string[]>([]);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [isLoading, setIsLoading] = useState(true); // Start with loading true for initial load
  const [isLoadingFiltered, setIsLoadingFiltered] = useState(false); // Separate loading for filtered exercises
  const [error, setError] = useState<string | null>(null);

  const availableMuscleGroups = Object.keys(MUSCLE_GROUP_COLORS);

  // Load default exercises on mount
  useEffect(() => {
    if (isOpen) {
      fetchDefaultExercises();
    }
  }, [isOpen]);

  // Handle muscle group filter changes
  useEffect(() => {
    if (selectedMuscleGroups.length > 0) {
      fetchFilteredExercises();
    } else if (isOpen) {
      // Return to default exercises when filters are cleared
      fetchDefaultExercises();
    }
  }, [selectedMuscleGroups, isOpen]);

  useEffect(() => {
    if (!isOpen) {
      setSearchTerm('');
      setSelectedMuscleGroups([]);
      setExercises([]);
      setError(null);
      setIsLoading(false);
      setIsLoadingFiltered(false);
    }
  }, [isOpen]);

  // Fetch default exercises (10 most recent)
  const fetchDefaultExercises = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await getDefaultExercisesAction();

      if ('exercises' in result) {
        setExercises(result.exercises);
      } else {
        setError(result.error || 'Failed to load exercises. Please try again.');
      }
    } catch (err) {
      setError('Failed to load exercises. Please try again.');
      console.error('Error fetching default exercises:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch filtered exercises by muscle groups
  const fetchFilteredExercises = useCallback(async () => {
    if (selectedMuscleGroups.length === 0) return;

    setIsLoadingFiltered(true);
    setError(null);

    try {
      const result = await getExercisesByMuscleGroupsAction(selectedMuscleGroups);

      if ('exercises' in result) {
        setExercises(result.exercises);
      } else {
        setError(result.error || 'Failed to load exercises. Please try again.');
      }
    } catch (err) {
      setError('Failed to load exercises. Please try again.');
      console.error('Error fetching filtered exercises:', err);
    } finally {
      setIsLoadingFiltered(false);
    }
  }, [selectedMuscleGroups]);

  const filteredExercises = useMemo(() => {
    if (!searchTerm) return exercises;
    return exercises.filter((exercise) => exercise.name.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [exercises, searchTerm]);

  const handleMuscleGroupToggle = (muscleGroup: string) => {
    setSelectedMuscleGroups((prev) => {
      if (prev.includes(muscleGroup)) {
        return prev.filter((group) => group !== muscleGroup);
      } else {
        return [...prev, muscleGroup];
      }
    });
  };

  const handleClearAllFilters = () => {
    setSelectedMuscleGroups([]);
    setSearchTerm('');
  };

  const handleExerciseClick = (exercise: Exercise) => {
    onExerciseSelected(exercise);
    onOpenChange(false);
  };

  const renderMuscleGroupFilters = () => (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-gray-700">Filter by Muscle Group</h3>
        {selectedMuscleGroups.length > 0 && (
          <Button variant="ghost" size="sm" onClick={handleClearAllFilters} className="h-6 px-2 text-xs text-gray-500">
            Clear all
          </Button>
        )}
      </div>
      <div className="flex flex-wrap gap-2">
        {availableMuscleGroups.map((group) => (
          <Badge
            key={group}
            variant={selectedMuscleGroups.includes(group) ? 'default' : 'outline'}
            className={`cursor-pointer transition-colors ${
              selectedMuscleGroups.includes(group)
                ? getMuscleGroupColor(group) + ' border-transparent'
                : 'hover:bg-gray-50'
            }`}
            onClick={() => handleMuscleGroupToggle(group)}
          >
            {group}
          </Badge>
        ))}
      </div>
    </div>
  );

  const renderSearchInput = () => (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
      <Input
        placeholder="Search exercises..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="pl-10 pr-10"
      />
      {searchTerm && (
        <button
          onClick={() => setSearchTerm('')}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );

  const renderExerciseList = () => {
    // Show loading state for initial load or filtered load
    if (isLoading || isLoadingFiltered) {
      return (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
          <span className="ml-2 text-sm text-gray-500">
            {isLoading ? 'Loading exercises...' : 'Filtering exercises...'}
          </span>
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="text-red-400 mb-2">
            <X className="h-12 w-12 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-1">Error loading exercises</h3>
          <p className="text-sm text-gray-500 mb-4">{error}</p>
          <Button
            variant="outline"
            size="sm"
            onClick={selectedMuscleGroups.length > 0 ? fetchFilteredExercises : fetchDefaultExercises}
          >
            Try again
          </Button>
        </div>
      );
    }

    if (filteredExercises.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="text-gray-400 mb-2">
            <Search className="h-12 w-12 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-1">No exercises found</h3>
          <p className="text-sm text-gray-500">
            {searchTerm
              ? 'Try adjusting your search term' + (selectedMuscleGroups.length > 0 ? ' or muscle group filters' : '')
              : selectedMuscleGroups.length > 0
                ? 'No exercises match the selected muscle groups'
                : 'No exercises available'}
          </p>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {filteredExercises.map((exercise) => (
          <Card
            key={exercise.id}
            className="cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => handleExerciseClick(exercise)}
          >
            <CardContent className="p-4">
              <h4 className="font-semibold mb-2">{exercise.name}</h4>
              <div className="flex flex-wrap gap-1">
                {exercise.muscleGroups.map((group: string) => (
                  <Badge key={group} variant="secondary" className={`text-xs ${getMuscleGroupColor(group)}`}>
                    {group}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-md">
        <SheetHeader>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onOpenChange(false)}
              className="p-1 h-8 w-8 rounded-md hover:bg-gray-100 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div>
              <SheetTitle>Select Exercise</SheetTitle>
              <SheetDescription>Filter and choose an exercise for your workout</SheetDescription>
            </div>
          </div>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          {renderMuscleGroupFilters()}
          {renderSearchInput()}
        </div>

        <ScrollArea className="h-full mt-6">
          <div className="pr-4 pb-6">{renderExerciseList()}</div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
