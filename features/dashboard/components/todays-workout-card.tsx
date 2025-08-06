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
import { Badge } from '@/features/shared/components/ui/badge';
import { WorkoutSessionWithWorkout } from '../types';
import { startWorkoutSessionAction, completeWorkoutSessionAction, skipWorkoutSessionAction } from '../services/actions';
import { Play, CheckCircle, SkipForward, Clock, Calendar, Dumbbell, Loader2 } from 'lucide-react';
import { Routine } from '@/lib/db/schema/routines';
import Link from 'next/link';
import { toast } from 'sonner';
import { formatDistanceToNow } from 'date-fns';

interface TodaysWorkoutCardProps {
  workout: WorkoutSessionWithWorkout | null;
  activeRoutine: Routine | null | undefined;
  inProgressSession: WorkoutSessionWithWorkout | null;
}

export function TodaysWorkoutCard({ workout, activeRoutine }: TodaysWorkoutCardProps) {
  const [isPending, startTransition] = useTransition();
  const [actionType, setActionType] = useState<'start' | 'complete' | 'skip' | null>(null);

  const handleStartWorkout = () => {
    if (!workout) return;

    setActionType('start');
    startTransition(async () => {
      const result = await startWorkoutSessionAction(workout.id);
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success('Workout started! Good luck!');
      }
      setActionType(null);
    });
  };

  const handleCompleteWorkout = () => {
    if (!workout) return;

    setActionType('complete');
    startTransition(async () => {
      // Calculate duration if workout was started
      const durationMinutes = workout.startedAt
        ? Math.round((Date.now() - new Date(workout.startedAt).getTime()) / (1000 * 60))
        : undefined;

      const result = await completeWorkoutSessionAction(workout.id, durationMinutes);
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success('Workout completed! Great job!');
      }
      setActionType(null);
    });
  };

  const handleSkipWorkout = () => {
    if (!workout) return;

    setActionType('skip');
    startTransition(async () => {
      const result = await skipWorkoutSessionAction(workout.id);
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success('Workout skipped');
      }
      setActionType(null);
    });
  };

  const formatScheduledDate = (date: Date): string => {
    const today = new Date();
    const scheduledDate = new Date(date);

    // Reset time for comparison
    today.setHours(0, 0, 0, 0);
    scheduledDate.setHours(0, 0, 0, 0);

    if (scheduledDate.getTime() === today.getTime()) {
      return 'Today';
    } else if (scheduledDate.getTime() === today.getTime() + 24 * 60 * 60 * 1000) {
      return 'Tomorrow';
    } else if (scheduledDate.getTime() === today.getTime() - 24 * 60 * 60 * 1000) {
      return 'Yesterday';
    }

    return formatDistanceToNow(scheduledDate, { addSuffix: true });
  };

  // No workout scheduled
  if (!workout) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-gray-400" />
            <CardTitle>Today&apos;s Workout</CardTitle>
          </div>
          <CardDescription>No workout scheduled for today</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 space-y-4">
            <Dumbbell className="w-12 h-12 text-gray-400 mx-auto" />
            <div>
              <p className="text-gray-600 mb-2">You don&apos;t have any workouts scheduled for today.</p>
              <p className="text-sm text-gray-500">
                {activeRoutine
                  ? 'Your routine workouts will appear here when scheduled.'
                  : 'Select an active routine to see scheduled workouts.'}
              </p>
            </div>
            {activeRoutine && (
              <Button variant="outline" asChild>
                <Link href={`/routines/${activeRoutine.id}`}>View Routine Schedule</Link>
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  const isInProgress = workout.status === 'in_progress';
  const isCompleted = workout.status === 'completed';
  const isSkipped = workout.status === 'skipped';

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          {isInProgress && <Play className="w-5 h-5 text-green-600" />}
          {isCompleted && <CheckCircle className="w-5 h-5 text-green-600" />}
          {isSkipped && <SkipForward className="w-5 h-5 text-gray-400" />}
          {!isInProgress && !isCompleted && !isSkipped && <Calendar className="w-5 h-5 text-blue-600" />}
          <CardTitle>
            {isInProgress
              ? 'Workout In Progress'
              : isCompleted
                ? 'Workout Completed'
                : isSkipped
                  ? 'Workout Skipped'
                  : "Today's Workout"}
          </CardTitle>
        </div>
        <CardDescription>
          {workout.scheduledDate && formatScheduledDate(workout.scheduledDate)}
          {isInProgress && workout.startedAt && (
            <span className="ml-2">
              • Started {formatDistanceToNow(new Date(workout.startedAt), { addSuffix: true })}
            </span>
          )}
        </CardDescription>
        {!isCompleted && !isSkipped && (
          <CardAction>
            <div className="flex gap-2">
              {!isInProgress ? (
                <Button size="sm" onClick={handleStartWorkout} disabled={isPending}>
                  {isPending && actionType === 'start' ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <Play className="w-4 h-4 mr-2" />
                      Start
                    </>
                  )}
                </Button>
              ) : (
                <>
                  <Button size="sm" onClick={handleCompleteWorkout} disabled={isPending}>
                    {isPending && actionType === 'complete' ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Complete
                      </>
                    )}
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleSkipWorkout} disabled={isPending}>
                    {isPending && actionType === 'skip' ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        <SkipForward className="w-4 h-4 mr-2" />
                        Skip
                      </>
                    )}
                  </Button>
                </>
              )}
            </div>
          </CardAction>
        )}
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Workout Name and Routine Info */}
          <div className="space-y-2">
            <h3 className="font-semibold text-lg">{workout.name}</h3>
            {workout.workout && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: workout.workout.routine.color || '#6b7280' }}
                />
                <span>{workout.workout.routine.name}</span>
                <span>•</span>
                <span>Day {workout.workout.dayOfWeek + 1}</span>
              </div>
            )}
          </div>

          {/* Status Badge */}
          <div className="flex items-center gap-2">
            <Badge
              variant={isInProgress ? 'default' : isCompleted ? 'secondary' : isSkipped ? 'outline' : 'outline'}
              className={
                isInProgress
                  ? 'bg-green-100 text-green-800'
                  : isCompleted
                    ? 'bg-green-100 text-green-800'
                    : isSkipped
                      ? 'bg-gray-100 text-gray-800'
                      : 'bg-blue-100 text-blue-800'
              }
            >
              {isInProgress ? 'In Progress' : isCompleted ? 'Completed' : isSkipped ? 'Skipped' : 'Scheduled'}
            </Badge>
            {workout.startedAt && isInProgress && (
              <div className="flex items-center gap-1 text-xs text-gray-500">
                <Clock className="w-3 h-3" />
                {formatDistanceToNow(new Date(workout.startedAt), { addSuffix: false })}
              </div>
            )}
          </div>

          {/* Workout Details */}
          {workout.workout && (
            <div className="pt-2">
              <Button variant="outline" size="sm" asChild className="w-full">
                <Link href={`/workouts/${workout.workout.id}`}>
                  <Dumbbell className="w-4 h-4 mr-2" />
                  View Workout Details
                </Link>
              </Button>
            </div>
          )}

          {/* Completion Info */}
          {isCompleted && workout.completedAt && (
            <div className="pt-2 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span>Completed {formatDistanceToNow(new Date(workout.completedAt), { addSuffix: true })}</span>
              </div>
              {workout.durationMinutes && (
                <div className="flex items-center gap-2 mt-1">
                  <Clock className="w-4 h-4 text-blue-600" />
                  <span>Duration: {Math.round(workout.durationMinutes)} minutes</span>
                </div>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
