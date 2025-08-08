'use client';

import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/features/shared/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/features/shared/components/ui/sheet';
import { EmptyState } from '@/features/shared/components/common/empty-state';
import { CreateRoutineForm } from './create-routine-form';
import { RoutinesList } from './routines-list';
import type { RoutineRecord } from '@/lib/db/queries/routines';

interface RoutinesDashboardProps {
  routines: RoutineRecord[];
}

export function RoutinesDashboard({ routines }: RoutinesDashboardProps) {
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const handleCreateSuccess = () => {
    setIsSheetOpen(false);
  };

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

        {!routines || routines.length === 0 ? (
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
        ) : (
          <RoutinesList routines={routines} />
        )}
      </div>
    </div>
  );
}
