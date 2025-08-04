'use client';

import { useActionState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dumbbell, Target, Clock, CalendarDays, GripVertical, Trash2 } from 'lucide-react';
import { getMuscleGroupColor } from '@/lib/utils/muscle-groups';
import { deleteRoutineAction } from '@/app/routines/[id]/actions';
import type { RoutineDetail } from '@/lib/types/routine-detail';

interface RoutineDetailViewProps {
  routine: RoutineDetail;
}

const DAYS_OF_WEEK = [
  { value: 1, label: 'Monday', shortLabel: 'Mon' },
  { value: 2, label: 'Tuesday', shortLabel: 'Tue' },
  { value: 3, label: 'Wednesday', shortLabel: 'Wed' },
  { value: 4, label: 'Thursday', shortLabel: 'Thu' },
  { value: 5, label: 'Friday', shortLabel: 'Fri' },
  { value: 6, label: 'Saturday', shortLabel: 'Sat' },
  { value: 0, label: 'Sunday', shortLabel: 'Sun' },
];

export function RoutineDetailView({ routine }: RoutineDetailViewProps) {
  const [state, formAction, isPending] = useActionState(deleteRoutineAction, {
    error: null,
  });

  const getWorkoutsForDay = (dayOfWeek: number) => {
    return routine.workouts.filter((workout) => workout.dayOfWeek === dayOfWeek);
  };

  const getTotalExercises = () => {
    return routine.workouts.reduce((total, workout) => total + workout.exercises.length, 0);
  };

  const getTotalSets = () => {
    return routine.workouts.reduce((total, workout) => {
      return (
        total +
        workout.exercises.reduce((exerciseTotal, exercise) => {
          return exerciseTotal + exercise.sets.length;
        }, 0)
      );
    }, 0);
  };

  const getEstimatedDuration = () => {
    const totalDuration = routine.workouts.reduce((total, workout) => {
      return total + (workout.estimatedDuration || 0);
    }, 0);
    return totalDuration;
  };

  const getAllMuscleGroups = () => {
    const muscleGroups = new Set<string>();
    routine.workouts.forEach((workout) => {
      workout.exercises.forEach((exercise) => {
        exercise.exercise.muscleGroups.forEach((muscleGroup) => {
          muscleGroups.add(muscleGroup);
        });
      });
    });
    return Array.from(muscleGroups).sort();
  };

  return (
    <div className="space-y-6">
      {/* Routine Overview */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="text-2xl font-bold text-gray-900">{routine.name}</CardTitle>
              {routine.description && (
                <CardDescription className="mt-2 text-gray-600">{routine.description}</CardDescription>
              )}
            </div>
            {routine.color && (
              <div className="w-6 h-6 rounded-full ml-4 flex-shrink-0" style={{ backgroundColor: routine.color }} />
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center gap-2">
              <Target className="w-5 h-5 text-gray-500" />
              <div>
                <p className="text-sm font-medium text-gray-900">{getTotalExercises()}</p>
                <p className="text-xs text-gray-500">Exercises</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Dumbbell className="w-5 h-5 text-gray-500" />
              <div>
                <p className="text-sm font-medium text-gray-900">{getTotalSets()}</p>
                <p className="text-xs text-gray-500">Sets</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-gray-500" />
              <div>
                <p className="text-sm font-medium text-gray-900">{getEstimatedDuration()}m</p>
                <p className="text-xs text-gray-500">Duration</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <CalendarDays className="w-5 h-5 text-gray-500" />
              <div>
                <p className="text-sm font-medium text-gray-900">{routine.workouts.length}</p>
                <p className="text-xs text-gray-500">Workouts</p>
              </div>
            </div>
          </div>

          {/* Muscle Groups */}
          <div className="mt-4">
            <p className="text-sm font-medium text-gray-700 mb-2">Muscle Groups</p>
            <div className="flex flex-wrap gap-1">
              {getAllMuscleGroups().map((muscleGroup) => (
                <Badge key={muscleGroup} variant="secondary" className={`text-xs ${getMuscleGroupColor(muscleGroup)}`}>
                  {muscleGroup}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Weekly Schedule */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-gray-900">Weekly Schedule</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {DAYS_OF_WEEK.map((day) => {
            const dayWorkouts = getWorkoutsForDay(day.value);

            return (
              <Card key={day.value} className="min-h-[200px]">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg font-semibold text-gray-900">{day.label}</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  {dayWorkouts.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-sm text-gray-500">No workout scheduled</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {dayWorkouts.map((workout) => (
                        <div key={workout.id} className="border rounded-lg p-3 bg-gray-50">
                          <div className="flex items-start justify-between mb-2">
                            <h4 className="font-medium text-gray-900">{workout.name}</h4>
                            {workout.estimatedDuration && (
                              <span className="text-xs text-gray-500 flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {workout.estimatedDuration}m
                              </span>
                            )}
                          </div>

                          <div className="space-y-2">
                            {workout.exercises.map((exercise) => (
                              <div key={exercise.id} className="text-sm">
                                <div className="flex items-center gap-2 mb-1">
                                  <GripVertical className="w-3 h-3 text-gray-400" />
                                  <span className="font-medium text-gray-700">{exercise.exercise.name}</span>
                                </div>
                                <div className="ml-5 text-xs text-gray-600">
                                  {exercise.sets.map((set) => (
                                    <span key={set.id} className="inline-block mr-2">
                                      {set.setNumber}: {set.reps || '?'} reps @ {set.weight}kg
                                    </span>
                                  ))}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Danger Zone */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-gray-900">Danger Zone</h3>
        <Card className="border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-red-900">Delete Routine</CardTitle>
            <CardDescription className="text-red-700">
              This action cannot be undone. This will permanently delete the routine and all associated workouts.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form action={formAction}>
              <input type="hidden" name="routineId" value={routine.id} />
              <Button type="submit" variant="destructive" disabled={isPending} className="flex items-center gap-2">
                <Trash2 className="w-4 h-4" />
                {isPending ? 'Deleting...' : 'Delete Routine'}
              </Button>
              {state?.error && <p className="text-sm text-red-600 mt-2">{state.error}</p>}
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
