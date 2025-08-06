'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/features/shared/components/ui/card';
import { WorkoutSessionStats } from '../types';
import { Calendar, Clock, TrendingUp } from 'lucide-react';

interface WorkoutStatsCardsProps {
  stats: WorkoutSessionStats;
}

export function WorkoutStatsCards({ stats }: WorkoutStatsCardsProps) {
  const { totalCompleted, averageDurationMinutes, completionRate } = stats;

  const formatDuration = (minutes: number): string => {
    if (minutes < 60) return `${Math.round(minutes)}m`;
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = Math.round(minutes % 60);
    return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
  };

  const formatCompletionRate = (rate: number): string => {
    return `${Math.round(rate)}%`;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Total Completed Workouts */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-blue-600" />
            <CardTitle className="text-sm font-medium text-gray-600">This Month</CardTitle>
          </div>
          <CardDescription className="text-2xl font-bold text-gray-900">
            {totalCompleted} workout{totalCompleted !== 1 ? 's' : ''}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600">
            {totalCompleted > 0 ? 'Keep up the great work!' : 'Time to start your fitness journey!'}
          </p>
        </CardContent>
      </Card>

      {/* Average Duration */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-green-600" />
            <CardTitle className="text-sm font-medium text-gray-600">Avg Duration</CardTitle>
          </div>
          <CardDescription className="text-2xl font-bold text-gray-900">
            {averageDurationMinutes > 0 ? formatDuration(averageDurationMinutes) : '0m'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600">
            {averageDurationMinutes > 0 ? 'Per workout session' : 'Complete a workout to see stats'}
          </p>
        </CardContent>
      </Card>

      {/* Completion Rate */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-purple-600" />
            <CardTitle className="text-sm font-medium text-gray-600">Success Rate</CardTitle>
          </div>
          <CardDescription className="text-2xl font-bold text-gray-900">
            {completionRate > 0 ? formatCompletionRate(completionRate) : '0%'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600">
            {completionRate >= 80
              ? 'Excellent consistency!'
              : completionRate >= 50
                ? 'Good progress, keep going!'
                : totalCompleted > 0
                  ? 'Stay consistent for better results'
                  : 'Start tracking your workouts'}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
