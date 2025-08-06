'use client';

import { useActionState, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/features/shared/components/ui/card';
import { Button } from '@/features/shared/components/ui/button';
import { Input } from '@/features/shared/components/ui/input';
import { Label } from '@/features/shared/components/ui/label';

import { Calendar, Plus, X, Dumbbell, Target, Clock, CalendarDays, GripVertical } from 'lucide-react';
import { WorkoutBuilder } from './weekly-routine-builder-workout-builder';
import { createWeeklyRoutineAction } from '@/features/routines/services/actions';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import type { WeeklyWorkout, WorkoutExerciseConfig, WeeklyRoutineFormState, WeeklyRoutineBuilderProps } from './types';

const DAYS_OF_WEEK = [
  { value: 1, label: 'Monday', shortLabel: 'Mon' },
  { value: 2, label: 'Tuesday', shortLabel: 'Tue' },
  { value: 3, label: 'Wednesday', shortLabel: 'Wed' },
  { value: 4, label: 'Thursday', shortLabel: 'Thu' },
  { value: 5, label: 'Friday', shortLabel: 'Fri' },
  { value: 6, label: 'Saturday', shortLabel: 'Sat' },
  { value: 0, label: 'Sunday', shortLabel: 'Sun' },
];

export function WeeklyRoutineBuilder({}: WeeklyRoutineBuilderProps) {
  const [routineName, setRoutineName] = useState('');
  const [weeklyWorkouts, setWeeklyWorkouts] = useState<WeeklyWorkout[]>([]);

  const wrappedAction = async (
    prevState: WeeklyRoutineFormState,
    formData: FormData
  ): Promise<WeeklyRoutineFormState> => {
    formData.append(
      'routineData',
      JSON.stringify({
        name: routineName,
        workouts: weeklyWorkouts,
      })
    );
    return await createWeeklyRoutineAction(prevState, formData);
  };

  const [state, formAction, isPending] = useActionState(wrappedAction, {
    error: null,
    fieldErrors: {},
  });

  const handleWorkoutCreated = (workout: { name: string; exercises: WorkoutExerciseConfig[] }) => {
    // Find the next available day
    const usedDays = weeklyWorkouts.map((w) => w.dayOfWeek);
    let nextDay = 1; // Start with Monday

    // Find the first available day
    for (let day = 1; day <= 7; day++) {
      const dayOfWeek = day === 7 ? 0 : day; // Sunday is 0
      if (!usedDays.includes(dayOfWeek)) {
        nextDay = dayOfWeek;
        break;
      }
    }

    const newWorkout: WeeklyWorkout = {
      id: `${Date.now()}-${Math.random()}`,
      name: workout.name,
      dayOfWeek: nextDay,
      exercises: workout.exercises,
    };

    setWeeklyWorkouts((prev) => [...prev, newWorkout]);
  };

  const removeWorkout = (workoutId: string) => {
    setWeeklyWorkouts((prev) => prev.filter((w) => w.id !== workoutId));
  };

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const { source, destination } = result;
    const sourceDay = parseInt(source.droppableId);
    const destinationDay = parseInt(destination.droppableId);

    // If moving within the same day, just reorder
    if (sourceDay === destinationDay) {
      const dayWorkouts = weeklyWorkouts.filter((w) => w.dayOfWeek === sourceDay);
      const [movedWorkout] = dayWorkouts.splice(source.index, 1);
      dayWorkouts.splice(destination.index, 0, movedWorkout);

      setWeeklyWorkouts((prev) => [...prev.filter((w) => w.dayOfWeek !== sourceDay), ...dayWorkouts]);
    } else {
      // Moving between days
      const sourceWorkouts = weeklyWorkouts.filter((w) => w.dayOfWeek === sourceDay);
      const destinationWorkouts = weeklyWorkouts.filter((w) => w.dayOfWeek === destinationDay);
      const [movedWorkout] = sourceWorkouts.splice(source.index, 1);

      // Update the workout's day
      movedWorkout.dayOfWeek = destinationDay;
      destinationWorkouts.splice(destination.index, 0, movedWorkout);

      setWeeklyWorkouts((prev) => [
        ...prev.filter((w) => w.dayOfWeek !== sourceDay && w.dayOfWeek !== destinationDay),
        ...sourceWorkouts,
        ...destinationWorkouts,
      ]);
    }
  };

  const getTotalExercises = () => {
    return weeklyWorkouts.reduce((total, workout) => total + workout.exercises.length, 0);
  };

  const getTotalSets = () => {
    return weeklyWorkouts.reduce(
      (total, workout) => total + workout.exercises.reduce((exTotal, exercise) => exTotal + exercise.sets.length, 0),
      0
    );
  };

  const getEstimatedDuration = () => {
    // Rough estimate: 2 minutes per set + 1 minute per exercise
    return weeklyWorkouts.reduce(
      (total, workout) =>
        total + workout.exercises.reduce((exTotal, exercise) => exTotal + exercise.sets.length * 2 + 1, 0),
      0
    );
  };

  const getWorkoutsForDay = (dayOfWeek: number) => {
    return weeklyWorkouts.filter((w) => w.dayOfWeek === dayOfWeek);
  };

  return (
    <form action={formAction} className="max-w-7xl mx-auto space-y-6">
      {/* Routine Details */}
      <Card>
        <CardHeader>
          <CardTitle>Routine Details</CardTitle>
          <CardDescription>Basic information about your weekly routine</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="routineName">Routine Name</Label>
              <Input
                id="routineName"
                value={routineName}
                onChange={(e) => setRoutineName(e.target.value)}
                placeholder="e.g., Push Pull Legs, Upper Lower Split"
                required
                disabled={isPending}
                className={'fieldErrors' in state && state.fieldErrors?.name ? 'border-red-500' : ''}
              />
              {'fieldErrors' in state && state.fieldErrors?.name && (
                <p className="text-sm text-red-500">{state.fieldErrors.name[0]}</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Weekly Schedule - Trello Style */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Weekly Schedule</CardTitle>
              <div className="flex flex-wrap items-center gap-2 md:gap-4 mt-2 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <CalendarDays className="w-4 h-4" />
                  <span>{weeklyWorkouts.length} workout days</span>
                </div>
                <div className="flex items-center gap-1">
                  <Target className="w-4 h-4" />
                  <span>{getTotalExercises()} exercises</span>
                </div>
                <div className="flex items-center gap-1">
                  <Dumbbell className="w-4 h-4" />
                  <span>{getTotalSets()} sets</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>~{getEstimatedDuration()} min</span>
                </div>
              </div>
            </div>
            <WorkoutBuilder
              onWorkoutCreated={handleWorkoutCreated}
              trigger={
                <Button type="button" disabled={isPending}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Workout
                </Button>
              }
            />
          </div>
        </CardHeader>
        <CardContent>
          {weeklyWorkouts.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <Calendar className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-medium mb-2">No workouts scheduled</h3>
              <p className="mb-4">Create your first workout to get started with your weekly routine.</p>
              <WorkoutBuilder
                onWorkoutCreated={handleWorkoutCreated}
                trigger={
                  <Button type="button" disabled={isPending}>
                    <Plus className="w-4 h-4 mr-2" />
                    Create First Workout
                  </Button>
                }
              />
            </div>
          ) : (
            <DragDropContext onDragEnd={handleDragEnd}>
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-7 gap-4 min-h-[400px]">
                {DAYS_OF_WEEK.map((day) => {
                  const dayWorkouts = getWorkoutsForDay(day.value);
                  return (
                    <div key={day.value} className="flex flex-col">
                      {/* Day Header */}
                      <div className="bg-gray-50 border rounded-t-lg p-3 mb-2">
                        <h3 className="font-semibold text-sm text-gray-900">{day.shortLabel}</h3>
                        <p className="text-xs text-gray-500">{day.label}</p>
                        <div className="flex items-center gap-1 mt-1">
                          <Dumbbell className="w-3 h-3 text-gray-400" />
                          <span className="text-xs text-gray-500">
                            {dayWorkouts.length} workout{dayWorkouts.length !== 1 ? 's' : ''}
                          </span>
                        </div>
                      </div>

                      {/* Workouts Column */}
                      <Droppable droppableId={day.value.toString()}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                            className={`flex-1 min-h-[300px] p-2 border rounded-b-lg transition-colors ${
                              snapshot.isDraggingOver ? 'bg-blue-50 border-blue-300' : 'bg-gray-25 border-gray-200'
                            }`}
                          >
                            {dayWorkouts.map((workout, index) => (
                              <Draggable key={workout.id} draggableId={workout.id} index={index}>
                                {(provided, snapshot) => (
                                  <div
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    className={`mb-3 ${snapshot.isDragging ? 'rotate-2 shadow-lg' : ''}`}
                                  >
                                    <Card className="cursor-grab active:cursor-grabbing">
                                      <CardContent className="p-3">
                                        <div {...provided.dragHandleProps} className="flex items-start justify-between">
                                          <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-1">
                                              <GripVertical className="w-3 h-3 text-gray-400 flex-shrink-0" />
                                              <h4 className="font-medium text-sm truncate">{workout.name}</h4>
                                            </div>

                                            {/* Removed workout.description */}

                                            <div className="flex items-center gap-3 text-xs text-gray-500">
                                              <div className="flex items-center gap-1">
                                                <Target className="w-3 h-3" />
                                                <span>{workout.exercises.length}</span>
                                              </div>
                                              <div className="flex items-center gap-1">
                                                <Dumbbell className="w-3 h-3" />
                                                <span>
                                                  {workout.exercises.reduce((total, ex) => total + ex.sets.length, 0)}
                                                </span>
                                              </div>
                                              <div className="flex items-center gap-1">
                                                <Clock className="w-3 h-3" />
                                                <span>
                                                  ~
                                                  {workout.exercises.reduce(
                                                    (total, ex) => total + ex.sets.length * 2 + 1,
                                                    0
                                                  )}
                                                  m
                                                </span>
                                              </div>
                                            </div>
                                          </div>

                                          <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => removeWorkout(workout.id)}
                                            className="text-red-500 hover:text-red-700 flex-shrink-0 ml-2"
                                            disabled={isPending}
                                          >
                                            <X className="w-3 h-3" />
                                          </Button>
                                        </div>
                                      </CardContent>
                                    </Card>
                                  </div>
                                )}
                              </Draggable>
                            ))}
                            {provided.placeholder}

                            {/* Empty state for the day */}
                            {dayWorkouts.length === 0 && (
                              <div className="text-center py-8 text-gray-400">
                                <div className="text-xs">Drop workouts here</div>
                              </div>
                            )}
                          </div>
                        )}
                      </Droppable>
                    </div>
                  );
                })}
              </div>
            </DragDropContext>
          )}
        </CardContent>
      </Card>

      {/* Error Display */}
      {'error' in state && state.error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">{state.error}</div>
      )}

      {/* Submit Button */}
      <div className="flex justify-end">
        <Button type="submit" disabled={!routineName.trim() || weeklyWorkouts.length === 0 || isPending} size="lg">
          {isPending ? 'Creating...' : 'Create Routine'}
        </Button>
      </div>
    </form>
  );
}
