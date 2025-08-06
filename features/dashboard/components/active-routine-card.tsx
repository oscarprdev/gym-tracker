'use client';

import { useState, useTransition } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardAction,
} from '@/features/shared/components/ui/card';
import { Button } from '@/features/shared/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/features/shared/components/ui/select';
import { Badge } from '@/features/shared/components/ui/badge';
import { DashboardUser, RoutineWithStats } from '../types';
import { assignActiveRoutine, unassignActiveRoutine } from '../services/actions';
import { Dumbbell, Calendar, Target, Settings, Check, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

interface ActiveRoutineCardProps {
  user: DashboardUser;
  routines: RoutineWithStats[];
  hasActiveRoutine: boolean;
}

export function ActiveRoutineCard({ user, routines, hasActiveRoutine }: ActiveRoutineCardProps) {
  const [selectedRoutineId, setSelectedRoutineId] = useState<string>('');
  const [isPending, startTransition] = useTransition();

  const handleAssignRoutine = () => {
    if (!selectedRoutineId) {
      toast.error('Please select a routine');
      return;
    }

    startTransition(async () => {
      const result = await assignActiveRoutine(selectedRoutineId);
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success('Routine assigned successfully!');
        setSelectedRoutineId('');
      }
    });
  };

  const handleUnassignRoutine = () => {
    startTransition(async () => {
      const result = await unassignActiveRoutine();
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success('Routine unassigned successfully!');
      }
    });
  };

  // Show routine selection interface if no active routine
  if (!hasActiveRoutine) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Target className="w-5 h-5 text-orange-600" />
            <CardTitle>Select Your Active Routine</CardTitle>
          </div>
          <CardDescription>
            Choose a routine to start tracking your workouts and see personalized dashboard content
          </CardDescription>
        </CardHeader>
        <CardContent>
          {routines.length > 0 ? (
            <div className="space-y-4">
              <div className="grid gap-3">
                <Select value={selectedRoutineId} onValueChange={setSelectedRoutineId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a routine..." />
                  </SelectTrigger>
                  <SelectContent>
                    {routines.map((routine) => (
                      <SelectItem key={routine.id} value={routine.id}>
                        <div className="flex items-center gap-2">
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: routine.color || '#6b7280' }}
                          />
                          <span>{routine.name}</span>
                          <span className="text-xs text-muted-foreground">
                            ({routine.stats.totalWorkouts} workouts)
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {selectedRoutineId && (
                  <div className="p-3 bg-gray-50 rounded-lg">
                    {(() => {
                      const routine = routines.find((r) => r.id === selectedRoutineId);
                      if (!routine) return null;

                      return (
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <div
                              className="w-3 h-3 rounded-full"
                              style={{ backgroundColor: routine.color || '#6b7280' }}
                            />
                            <h4 className="font-medium">{routine.name}</h4>
                          </div>
                          <div className="flex flex-wrap gap-2 text-xs text-gray-600">
                            <span>📅 {routine.stats.totalWorkouts} workouts</span>
                            <span>💪 {routine.stats.totalExercises} exercises</span>
                            <span>🎯 {routine.stats.totalSets} sets</span>
                          </div>
                          {routine.stats.muscleGroups.length > 0 && (
                            <div className="flex flex-wrap gap-1">
                              {routine.stats.muscleGroups.map((group) => (
                                <Badge key={group} variant="secondary" className="text-xs">
                                  {group}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })()}
                  </div>
                )}
              </div>

              <div className="flex gap-2">
                <Button onClick={handleAssignRoutine} disabled={!selectedRoutineId || isPending} className="flex-1">
                  {isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Assigning...
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4 mr-2" />
                      Set Active Routine
                    </>
                  )}
                </Button>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <Dumbbell className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-4">You don&apos;t have any routines yet.</p>
              <Button asChild>
                <Link href="/routines/new">Create Your First Routine</Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  // Show active routine information
  const activeRoutine = user.activeRoutine;
  if (!activeRoutine) return null;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Check className="w-5 h-5 text-green-600" />
          <CardTitle>Active Routine</CardTitle>
        </div>
        <CardAction>
          <Button variant="outline" size="sm" onClick={handleUnassignRoutine} disabled={isPending}>
            {isPending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <Settings className="w-4 h-4 mr-2" />
                Change
              </>
            )}
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-4 h-4 rounded-full" style={{ backgroundColor: activeRoutine.color || '#6b7280' }} />
            <div className="flex-1">
              <h3 className="font-semibold text-lg">{activeRoutine.name}</h3>
              {activeRoutine.description && <p className="text-gray-600 text-sm">{activeRoutine.description}</p>}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="space-y-1">
              <div className="text-2xl font-bold text-blue-600">
                {routines.find((r) => r.id === activeRoutine.id)?.stats.totalWorkouts || 0}
              </div>
              <div className="text-xs text-gray-600">Workouts</div>
            </div>
            <div className="space-y-1">
              <div className="text-2xl font-bold text-green-600">
                {routines.find((r) => r.id === activeRoutine.id)?.stats.totalExercises || 0}
              </div>
              <div className="text-xs text-gray-600">Exercises</div>
            </div>
            <div className="space-y-1">
              <div className="text-2xl font-bold text-purple-600">
                {routines.find((r) => r.id === activeRoutine.id)?.stats.totalSets || 0}
              </div>
              <div className="text-xs text-gray-600">Sets</div>
            </div>
          </div>

          {(() => {
            const activeRoutineStats = routines.find((r) => r.id === activeRoutine.id)?.stats;
            if (!activeRoutineStats?.muscleGroups.length) return null;

            return (
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-gray-700">Target Muscle Groups</h4>
                <div className="flex flex-wrap gap-1">
                  {activeRoutineStats.muscleGroups.map((group) => (
                    <Badge key={group} variant="secondary" className="text-xs">
                      {group}
                    </Badge>
                  ))}
                </div>
              </div>
            );
          })()}

          <div className="pt-2">
            <Button variant="outline" size="sm" asChild className="w-full">
              <Link href={`/routines/${activeRoutine.id}`}>
                <Calendar className="w-4 h-4 mr-2" />
                View Full Routine
              </Link>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
