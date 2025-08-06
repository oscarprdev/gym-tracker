'use client';

import { useState, useTransition } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/features/shared/components/ui/card';
import { Badge } from '@/features/shared/components/ui/badge';
import { Button } from '@/features/shared/components/ui/button';
import { WorkoutSessionWithWorkout } from '../types';
import { startWorkoutSessionAction, skipWorkoutSessionAction } from '../services/actions';
import { Calendar, Clock, Play, SkipForward, ExternalLink, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { format, isToday, isTomorrow, isYesterday } from 'date-fns';
import { toast } from 'sonner';

interface UpcomingWorkoutsListProps {
  sessions: WorkoutSessionWithWorkout[];
}

export function UpcomingWorkoutsList({ sessions }: UpcomingWorkoutsListProps) {
  const [isPending, startTransition] = useTransition();
  const [actionSessionId, setActionSessionId] = useState<string | null>(null);
  const [actionType, setActionType] = useState<'start' | 'skip' | null>(null);

  const handleStartWorkout = (sessionId: string) => {
    setActionSessionId(sessionId);
    setActionType('start');

    startTransition(async () => {
      const result = await startWorkoutSessionAction(sessionId);
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success('Workout started! Good luck!');
      }
      setActionSessionId(null);
      setActionType(null);
    });
  };

  const handleSkipWorkout = (sessionId: string) => {
    setActionSessionId(sessionId);
    setActionType('skip');

    startTransition(async () => {
      const result = await skipWorkoutSessionAction(sessionId);
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success('Workout skipped');
      }
      setActionSessionId(null);
      setActionType(null);
    });
  };

  const formatScheduledDate = (date: Date): { label: string; isUrgent: boolean } => {
    const scheduledDate = new Date(date);

    if (isToday(scheduledDate)) {
      return { label: 'Today', isUrgent: true };
    } else if (isTomorrow(scheduledDate)) {
      return { label: 'Tomorrow', isUrgent: false };
    } else if (isYesterday(scheduledDate)) {
      return { label: 'Yesterday (Overdue)', isUrgent: true };
    }

    const daysDiff = Math.ceil((scheduledDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));

    if (daysDiff < 0) {
      return {
        label: `${Math.abs(daysDiff)} day${Math.abs(daysDiff) !== 1 ? 's' : ''} overdue`,
        isUrgent: true,
      };
    } else if (daysDiff <= 7) {
      return {
        label: `In ${daysDiff} day${daysDiff !== 1 ? 's' : ''}`,
        isUrgent: false,
      };
    }

    return {
      label: format(scheduledDate, 'MMM d, yyyy'),
      isUrgent: false,
    };
  };

  const getStatusColor = (status: string | null, isUrgent: boolean = false): string => {
    if (isUrgent) {
      return 'bg-red-100 text-red-800 border-red-200';
    }

    switch (status) {
      case 'planned':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'in_progress':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-blue-600" />
          Upcoming Workouts
        </CardTitle>
        <CardDescription>Your scheduled workouts and whats coming next</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {sessions.map((session) => {
            const scheduledInfo = session.scheduledDate
              ? formatScheduledDate(session.scheduledDate)
              : { label: 'Not scheduled', isUrgent: false };

            const isCurrentSession = actionSessionId === session.id;
            const canStart = session.status === 'planned';
            const isInProgress = session.status === 'in_progress';

            return (
              <div
                key={session.id}
                className={`flex items-center justify-between p-4 border rounded-lg transition-colors ${
                  scheduledInfo.isUrgent ? 'border-red-200 bg-red-50' : 'border-gray-200 hover:bg-gray-50'
                }`}
              >
                <div className="flex-1 space-y-2">
                  {/* Workout Name and Scheduled Date */}
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-gray-900">{session.name}</h4>
                    <div className={`text-xs ${scheduledInfo.isUrgent ? 'text-red-600 font-medium' : 'text-gray-500'}`}>
                      {scheduledInfo.label}
                    </div>
                  </div>

                  {/* Routine Info */}
                  {session.workout && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: session.workout.routine.color || '#6b7280' }}
                      />
                      <span>{session.workout.routine.name}</span>
                      <span>•</span>
                      <span>Day {session.workout.dayOfWeek + 1}</span>
                    </div>
                  )}

                  {/* Status */}
                  <div className="flex items-center gap-3">
                    <Badge className={`text-xs ${getStatusColor(session.status, scheduledInfo.isUrgent)}`}>
                      <div className="flex items-center gap-1">
                        {isInProgress ? <Play className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                        <span className="capitalize">{isInProgress ? 'In Progress' : session.status}</span>
                      </div>
                    </Badge>

                    {session.scheduledDate && (
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <Calendar className="w-3 h-3" />
                        <span>{format(new Date(session.scheduledDate), 'MMM d')}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="ml-4 flex items-center gap-2">
                  {session.workout && (
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/workouts/${session.workout.id}`}>
                        <ExternalLink className="w-3 h-3" />
                      </Link>
                    </Button>
                  )}

                  {canStart && (
                    <div className="flex gap-1">
                      <Button
                        size="sm"
                        onClick={() => handleStartWorkout(session.id)}
                        disabled={isPending && isCurrentSession}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        {isPending && isCurrentSession && actionType === 'start' ? (
                          <Loader2 className="w-3 h-3 animate-spin" />
                        ) : (
                          <>
                            <Play className="w-3 h-3 mr-1" />
                            Start
                          </>
                        )}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleSkipWorkout(session.id)}
                        disabled={isPending && isCurrentSession}
                      >
                        {isPending && isCurrentSession && actionType === 'skip' ? (
                          <Loader2 className="w-3 h-3 animate-spin" />
                        ) : (
                          <SkipForward className="w-3 h-3" />
                        )}
                      </Button>
                    </div>
                  )}

                  {isInProgress && (
                    <Badge className="bg-green-100 text-green-800 border-green-200">
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-green-600 rounded-full animate-pulse" />
                        <span>Active</span>
                      </div>
                    </Badge>
                  )}
                </div>
              </div>
            );
          })}

          {sessions.length === 0 && (
            <div className="text-center py-8">
              <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-2">No upcoming workouts</p>
              <p className="text-sm text-gray-500">Your scheduled workouts will appear here</p>
            </div>
          )}

          {sessions.length > 0 && (
            <div className="pt-2">
              <Button variant="outline" size="sm" asChild className="w-full">
                <Link href="/workouts">
                  View All Scheduled Workouts
                  <ExternalLink className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
