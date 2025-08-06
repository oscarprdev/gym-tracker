import { Card, CardContent, CardHeader, CardTitle } from '@/features/shared/components/ui/card';
import { Badge } from '@/features/shared/components/ui/badge';
import { Button } from '@/features/shared/components/ui/button';
import { Dumbbell, Target } from 'lucide-react';
import Link from 'next/link';
import { getMuscleGroupColor } from '@/lib/utils/muscle-groups';
import type { Routine } from '@/lib/types';

interface RoutineCardProps {
  routine: Routine;
}

export function RoutineCard({ routine }: RoutineCardProps) {
  return (
    <Card className="hover:shadow-md transition-shadow duration-200">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg font-semibold text-gray-900">{routine.name}</CardTitle>
          </div>
          {routine.color && (
            <div className="w-4 h-4 rounded-full ml-2 flex-shrink-0" style={{ backgroundColor: routine.color }} />
          )}
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="space-y-3">
          <div className="flex items-center gap-4 text-sm text-gray-600">
            {routine.stats && (
              <>
                <div className="flex items-center gap-1">
                  <Target className="w-4 h-4" />
                  <span>{routine.stats.totalExercises} exercises</span>
                </div>
                <div className="flex items-center gap-1">
                  <Dumbbell className="w-4 h-4" />
                  <span>{routine.stats.totalSets} sets</span>
                </div>
              </>
            )}
          </div>

          <div className="flex flex-wrap gap-1">
            {routine.stats?.muscleGroups.map((muscleGroup) => (
              <Badge key={muscleGroup} variant="secondary" className={`text-xs ${getMuscleGroupColor(muscleGroup)}`}>
                {muscleGroup}
              </Badge>
            ))}
          </div>

          <div className="flex gap-2 pt-2">
            <Button asChild size="sm" className="flex-1">
              <Link href={`/routines/${routine.id}`}>View Details</Link>
            </Button>
            <Button asChild variant="outline" size="sm">
              <Link href={`/routines/${routine.id}/edit`}>Edit</Link>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
