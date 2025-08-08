'use client';

import { useState } from 'react';
import { Calendar, Clock, Plus, Menu } from 'lucide-react';
import { Button } from '@/features/shared/components/ui/button';
import { Card } from '@/features/shared/components/ui/card';
import { Sheet, SheetContent, SheetTrigger } from '@/features/shared/components/ui/sheet';
import { WorkoutsSidebar } from '@/features/workouts';
import type { RoutineRecord } from '@/lib/db/queries/routines/get-user-routines';
import type { WorkoutRecord } from '@/lib/db/queries/workouts';

interface RoutinesListProps {
  selectedRoutine: RoutineRecord | null;
  routines: RoutineRecord[];
  workouts: WorkoutRecord[];
  onRoutineSelect: (routineId: string) => void;
}

export function RoutinesList({ selectedRoutine, routines, workouts, onRoutineSelect }: RoutinesListProps) {
  const [selectedWorkoutId, setSelectedWorkoutId] = useState<string | undefined>();
  const [showWorkouts, setShowWorkouts] = useState(false);

  // Filter workouts for the selected routine
  const routineWorkouts = selectedRoutine ? workouts.filter((workout) => workout.routineId === selectedRoutine.id) : [];

  const handleWorkoutSelect = (workoutId: string) => {
    setSelectedWorkoutId(workoutId);
  };

  const handleManageWorkouts = () => {
    setShowWorkouts(true);
  };
  if (!selectedRoutine) {
    return (
      <div className="flex-1 flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Calendar className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-black mb-2">Select a Routine</h3>
          <p className="text-gray-600">Choose a routine from the sidebar to view details and manage workouts.</p>
        </div>
      </div>
    );
  }

  if (showWorkouts && selectedRoutine) {
    return (
      <div className="flex flex-1">
        <WorkoutsSidebar
          routineId={selectedRoutine.id}
          routineName={selectedRoutine.name}
          workouts={routineWorkouts}
          selectedWorkoutId={selectedWorkoutId}
          onWorkoutSelect={handleWorkoutSelect}
        />
        <div className="flex-1 bg-white overflow-y-auto">
          <div className="p-4 md:p-8">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-bold text-black">
                {selectedWorkoutId ? routineWorkouts.find((w) => w.id === selectedWorkoutId)?.name : 'Select a workout'}
              </h1>
              <Button
                variant="outline"
                onClick={() => setShowWorkouts(false)}
                className="border-black text-black hover:bg-gray-100"
              >
                Back to Routine
              </Button>
            </div>

            {!selectedWorkoutId ? (
              <div className="text-center py-12">
                <p className="text-gray-600">Select a workout from the sidebar to view exercises and details.</p>
              </div>
            ) : (
              <div className="space-y-6">
                <Card className="bg-gray-50 border border-gray-200 border-dashed p-12 text-center">
                  <h3 className="text-lg font-medium text-black mb-2">Exercises coming soon</h3>
                  <p className="text-gray-600">Exercise management will be implemented in the next phase.</p>
                </Card>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-white overflow-y-auto">
      {/* Mobile Header */}
      <div className="md:hidden border-b border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold text-black">
            {selectedRoutine ? selectedRoutine.name : 'Select Routine'}
          </h1>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="sm" className="border-black">
                <Menu className="w-4 h-4" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-80 p-0">
              <div className="h-full bg-gray-50">
                {/* Mobile Sidebar Content - simplified version */}
                <div className="p-4 border-b border-gray-200">
                  <h2 className="text-lg font-semibold text-black">My Routines</h2>
                </div>
                <div className="p-2 space-y-1">
                  {routines.map((routine) => (
                    <button
                      key={routine.id}
                      onClick={() => onRoutineSelect(routine.id)}
                      className={`w-full text-left p-3 rounded-lg border transition-colors ${
                        selectedRoutine?.id === routine.id
                          ? 'bg-white border-black'
                          : 'border-gray-200 hover:bg-white hover:border-gray-300'
                      }`}
                    >
                      <div className="font-medium text-black truncate">{routine.name}</div>
                      <div className="text-sm text-gray-600">Created {routine.createdAt.toLocaleDateString()}</div>
                    </button>
                  ))}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      <div className="p-4 md:p-8">
        {/* Routine Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold text-black hidden md:block">{selectedRoutine.name}</h1>
            <Button className="bg-black text-white hover:bg-gray-800">Edit Routine</Button>
          </div>

          <div className="flex items-center space-x-6 text-sm text-gray-600">
            <div className="flex items-center">
              <Calendar className="w-4 h-4 mr-2" />
              Created {selectedRoutine.createdAt.toLocaleDateString()}
            </div>
            <div className="flex items-center">
              <Clock className="w-4 h-4 mr-2" />
              Last updated {selectedRoutine.updatedAt.toLocaleDateString()}
            </div>
          </div>
        </div>

        {/* Workouts Section */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-black">Workouts</h2>
            <Button className="bg-black text-white hover:bg-gray-800" onClick={handleManageWorkouts}>
              <Plus className="w-4 h-4 mr-2" />
              Manage Workouts
            </Button>
          </div>

          {/* Workouts Preview */}
          <Card className="bg-gray-50 border border-gray-200 border-dashed">
            <div className="p-12 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Plus className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-black mb-2">
                {routineWorkouts.length === 0
                  ? 'No workouts yet'
                  : `${routineWorkouts.length} workout${routineWorkouts.length > 1 ? 's' : ''}`}
              </h3>
              <p className="text-gray-600 mb-6">
                {routineWorkouts.length === 0
                  ? 'Add your first workout to this routine to start tracking your exercises and progress.'
                  : 'Click "Manage Workouts" to view, edit, and add new workouts to this routine.'}
              </p>
              <Button className="bg-black text-white hover:bg-gray-800" onClick={handleManageWorkouts}>
                <Plus className="w-4 h-4 mr-2" />
                {routineWorkouts.length === 0 ? 'Add Your First Workout' : 'Manage Workouts'}
              </Button>
            </div>
          </Card>
        </div>

        {/* Stats Section */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-white border border-gray-200 p-6">
            <h3 className="text-sm font-medium text-gray-600 mb-2">Total Workouts</h3>
            <p className="text-2xl font-bold text-black">{routineWorkouts.length}</p>
          </Card>

          <Card className="bg-white border border-gray-200 p-6">
            <h3 className="text-sm font-medium text-gray-600 mb-2">Total Exercises</h3>
            <p className="text-2xl font-bold text-black">0</p>
          </Card>

          <Card className="bg-white border border-gray-200 p-6">
            <h3 className="text-sm font-medium text-gray-600 mb-2">Last Updated</h3>
            <p className="text-2xl font-bold text-gray-600">
              {routineWorkouts.length > 0
                ? Math.max(...routineWorkouts.map((w) => w.updatedAt.getTime()))
                  ? new Date(Math.max(...routineWorkouts.map((w) => w.updatedAt.getTime()))).toLocaleDateString()
                  : 'Never'
                : 'Never'}
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}
