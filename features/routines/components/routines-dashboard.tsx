'use client';

import React, { useState } from 'react';
import { EmptyState } from '@/features/shared/components/common/empty-state';
import { Button } from '@/features/shared/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/features/shared/components/ui/sheet';
import { Plus } from 'lucide-react';
import { CreateRoutineForm } from './create-routine-form';
import { RoutinesSidebar } from './routines-sidebar';
import { RoutinesList } from './routines-list';
import type { RoutineRecord } from '@/lib/db/queries/routines/get-user-routines';
import type { WorkoutRecord } from '@/lib/db/queries/workouts';

interface RoutinesDashboardProps {
  routines: RoutineRecord[];
  workouts: WorkoutRecord[];
}

export function RoutinesDashboard({ routines, workouts }: RoutinesDashboardProps) {
  const [selectedRoutineId, setSelectedRoutineId] = useState<string | undefined>(
    routines.length > 0 ? routines[0].id : undefined
  );
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const selectedRoutine = selectedRoutineId
    ? routines.find((routine) => routine.id === selectedRoutineId) || null
    : null;

  const handleRoutineSelect = (routineId: string) => {
    setSelectedRoutineId(routineId);
  };

  const handleCreateSuccess = () => {
    setIsSheetOpen(false);
  };

  // Show empty state if no routines exist
  if (!routines || routines.length === 0) {
    return (
      <div className="routines-light-theme min-h-screen bg-white">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-black mb-2">My Routines</h1>
              <p className="text-gray-600">Manage and track your workout routines</p>
            </div>

            <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
              <SheetTrigger asChild>
                <Button className="bg-black text-white hover:bg-gray-800 border border-black">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Routine
                </Button>
              </SheetTrigger>
              <SheetContent className="routines-light-theme bg-white border-l border-black">
                <SheetHeader>
                  <SheetTitle className="text-black">Create New Routine</SheetTitle>
                </SheetHeader>
                <CreateRoutineForm onSuccess={handleCreateSuccess} />
              </SheetContent>
            </Sheet>
          </div>

          <EmptyState
            title="No routines yet"
            description="Create your first routine to get started with your fitness journey."
            action={
              <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                <SheetTrigger asChild>
                  <Button className="bg-black text-white hover:bg-gray-800 border border-black">
                    <Plus className="w-4 h-4 mr-2" />
                    Create Your First Routine
                  </Button>
                </SheetTrigger>
              </Sheet>
            }
          />
        </div>
      </div>
    );
  }

  // Main sidebar layout
  return (
    <div className="routines-light-theme min-h-screen bg-white flex">
      <RoutinesSidebar
        routines={routines}
        selectedRoutineId={selectedRoutineId}
        onRoutineSelect={handleRoutineSelect}
      />
      <RoutinesList
        selectedRoutine={selectedRoutine}
        routines={routines}
        workouts={workouts}
        onRoutineSelect={handleRoutineSelect}
      />
    </div>
  );
}
