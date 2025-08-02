'use client';

import { useState } from 'react';
import { MoreVertical, Edit, Trash2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { EditExerciseModal } from './edit-exercise-modal';
import { DeleteExerciseModal } from './delete-exercise-modal';
import type { Exercise } from '@/lib/db/schema/exercises';

interface ExerciseCardProps {
  exercise: Exercise;
  isCustom: boolean;
}

export function ExerciseCard({ exercise, isCustom }: ExerciseCardProps) {
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  return (
    <>
      <Card className="h-full hover:shadow-md transition-shadow">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <CardTitle className="text-lg leading-tight">{exercise.name}</CardTitle>
            <div className="flex items-center gap-2">
              {isCustom && (
                <Badge variant="secondary" className="text-xs">
                  Custom
                </Badge>
              )}
              {isCustom && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => setEditModalOpen(true)}>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => setDeleteModalOpen(true)}
                      className="text-red-600 focus:text-red-600"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="flex flex-wrap gap-1">
            {exercise.muscleGroups.slice(0, 3).map((group: string) => (
              <Badge key={group} variant="outline" className="text-xs">
                {group}
              </Badge>
            ))}
            {exercise.muscleGroups.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{exercise.muscleGroups.length - 3}
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Modals */}
      <EditExerciseModal exercise={exercise} open={editModalOpen} onOpenChange={setEditModalOpen} />
      <DeleteExerciseModal exercise={exercise} open={deleteModalOpen} onOpenChange={setDeleteModalOpen} />
    </>
  );
}
