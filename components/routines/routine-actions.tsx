'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { DeleteRoutineModal } from './delete-routine-modal';
import { Trash2 } from 'lucide-react';

interface RoutineActionsProps {
  routineId: string;
  routineName: string;
}

export function RoutineActions({ routineId, routineName }: RoutineActionsProps) {
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setShowDeleteModal(true)}
        className="text-red-600 hover:text-red-700 hover:bg-red-50"
      >
        <Trash2 className="h-4 w-4" />
      </Button>

      <DeleteRoutineModal
        routineId={routineId}
        routineName={routineName}
        open={showDeleteModal}
        onOpenChange={setShowDeleteModal}
      />
    </>
  );
}
