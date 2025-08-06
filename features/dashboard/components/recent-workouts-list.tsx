'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/features/shared/components/ui/card';
import { Badge } from '@/features/shared/components/ui/badge';
import { Button } from '@/features/shared/components/ui/button';
import { WorkoutSessionWithWorkout } from '../types';
import { CheckCircle, Clock, Calendar, SkipForward, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { formatDistanceToNow, format } from 'date-fns';

interface RecentWorkoutsListProps {
  sessions: WorkoutSessionWithWorkout[];
}

export function RecentWorkoutsList({ sessions }: RecentWorkoutsListProps) {
  const formatDuration = (minutes: number): string => {
    if (minutes < 60) return `${Math.round(minutes)}m`;
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = Math.round(minutes % 60);
    return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
  };

  const getStatusColor = (status: string | null): string => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'skipped':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  const getStatusIcon = (status: string | null) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-3 h-3" />;
      case 'skipped':
        return <SkipForward className="w-3 h-3" />;
      default:
        return <Clock className="w-3 h-3" />;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CheckCircle className="w-5 h-5 text-green-600" />
          Recent Workouts
        </CardTitle>
        <CardDescription>Your latest workout sessions and their progress</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {sessions.map((session) => (
            <div
              key={session.id}
              className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="flex-1 space-y-2">
                {/* Workout Name and Date */}
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-gray-900">{session.name}</h4>
                  <div className="text-xs text-gray-500">
                    {session.completedAt
                      ? formatDistanceToNow(new Date(session.completedAt), { addSuffix: true })
                      : session.scheduledDate
                        ? format(new Date(session.scheduledDate), 'MMM d, yyyy')
                        : ''}
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

                {/* Status and Duration */}
                <div className="flex items-center gap-3">
                  <Badge className={`text-xs ${getStatusColor(session.status)}`}>
                    <div className="flex items-center gap-1">
                      {getStatusIcon(session.status)}
                      <span className="capitalize">{session.status}</span>
                    </div>
                  </Badge>

                  {session.durationMinutes && session.durationMinutes > 0 && (
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <Clock className="w-3 h-3" />
                      <span>{formatDuration(session.durationMinutes)}</span>
                    </div>
                  )}

                  {session.completedAt && (
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <Calendar className="w-3 h-3" />
                      <span>{format(new Date(session.completedAt), 'MMM d')}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Button */}
              {session.workout && (
                <div className="ml-4">
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/workouts/${session.workout.id}`}>
                      <ExternalLink className="w-3 h-3" />
                    </Link>
                  </Button>
                </div>
              )}
            </div>
          ))}

          {sessions.length === 0 && (
            <div className="text-center py-8">
              <CheckCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-2">No recent workouts</p>
              <p className="text-sm text-gray-500">Your completed workouts will appear here</p>
            </div>
          )}

          {sessions.length > 0 && (
            <div className="pt-2">
              <Button variant="outline" size="sm" asChild className="w-full">
                <Link href="/workouts">
                  View All Workouts
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
