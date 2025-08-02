'use client';

import { useState, useMemo } from 'react';
import { Plus, Search, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ExerciseCard } from '@/components/exercises/exercise-card';
import { CreateExerciseModal } from '@/components/exercises/create-exercise-modal';
import { useDebounce } from '@/lib/hooks/use-debounce';
import type { Exercise } from '@/lib/db/schema/exercises';
import { MUSCLE_GROUPS } from '@/lib/utils';

interface ExercisesClientProps {
  allExercises: Exercise[];
  customExercises: Exercise[];
}

export function ExercisesClient({ allExercises, customExercises }: ExercisesClientProps) {
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMuscleGroup, setSelectedMuscleGroup] = useState<string>('all');

  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  const filteredAllExercises = useMemo(() => {
    let filtered = allExercises.filter((exercise) => !exercise.isCustom);

    if (debouncedSearchQuery.trim()) {
      const query = debouncedSearchQuery.toLowerCase();
      filtered = filtered.filter((exercise) => exercise.name.toLowerCase().includes(query));
    }

    if (selectedMuscleGroup !== 'all') {
      filtered = filtered.filter((exercise) => exercise.muscleGroups.includes(selectedMuscleGroup));
    }

    return filtered;
  }, [allExercises, debouncedSearchQuery, selectedMuscleGroup]);

  const filteredCustomExercises = useMemo(() => {
    let filtered = customExercises;

    if (debouncedSearchQuery.trim()) {
      const query = debouncedSearchQuery.toLowerCase();
      filtered = filtered.filter((exercise) => exercise.name.toLowerCase().includes(query));
    }

    if (selectedMuscleGroup !== 'all') {
      filtered = filtered.filter((exercise) => exercise.muscleGroups.includes(selectedMuscleGroup));
    }

    return filtered;
  }, [customExercises, debouncedSearchQuery, selectedMuscleGroup]);

  const hasExercises = allExercises.length > 0;
  const hasFilteredResults = filteredAllExercises.length > 0 || filteredCustomExercises.length > 0;
  const hasActiveFilters = debouncedSearchQuery.trim() || selectedMuscleGroup !== 'all';

  if (!hasExercises) {
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
      <div className="flex flex-col gap-4 mb-6">
        {/* Search and Filter Controls */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search exercises..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <Select value={selectedMuscleGroup} onValueChange={setSelectedMuscleGroup}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by muscle group" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Muscle Groups</SelectItem>
                {MUSCLE_GROUPS.map((group) => (
                  <SelectItem key={group} value={group}>
                    {group}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Results Summary */}
        {hasActiveFilters && (
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>
              {hasFilteredResults ? (
                <>
                  Showing {filteredCustomExercises.length + filteredAllExercises.length} of {allExercises.length}{' '}
                  exercises
                </>
              ) : (
                'No exercises match your filters'
              )}
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setSearchQuery('');
                setSelectedMuscleGroup('all');
              }}
            >
              Clear filters
            </Button>
          </div>
        )}

        {/* Create Exercise Button */}
        <div className="flex justify-end">
          <Button onClick={() => setCreateModalOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Create Exercise
          </Button>
        </div>
      </div>

      {/* Exercise Sections */}
      <div className="space-y-8">
        {filteredCustomExercises.length > 0 && (
          <section>
            <h2 className="text-xl font-semibold mb-4">Your Custom Exercises</h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredCustomExercises.map((exercise) => (
                <ExerciseCard key={exercise.id} exercise={exercise} isCustom />
              ))}
            </div>
          </section>
        )}

        {filteredAllExercises.length > 0 && (
          <section>
            <h2 className="text-xl font-semibold mb-4">
              {filteredCustomExercises.length > 0 ? 'Built-in Exercises' : 'All Exercises'}
            </h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredAllExercises.map((exercise) => (
                <ExerciseCard key={exercise.id} exercise={exercise} isCustom={false} />
              ))}
            </div>
          </section>
        )}

        {/* No Results State */}
        {!hasFilteredResults && hasActiveFilters && (
          <div className="flex flex-col items-center justify-center p-8 text-center">
            <h3 className="text-lg font-semibold text-foreground mb-2">No exercises found</h3>
            <p className="text-muted-foreground mb-4 max-w-sm">
              Try adjusting your search terms or muscle group filter.
            </p>
            <Button
              variant="outline"
              onClick={() => {
                setSearchQuery('');
                setSelectedMuscleGroup('all');
              }}
            >
              Clear filters
            </Button>
          </div>
        )}
      </div>

      <CreateExerciseModal open={createModalOpen} onOpenChange={setCreateModalOpen} />
    </>
  );
}
