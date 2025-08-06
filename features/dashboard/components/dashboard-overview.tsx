'use client';

import { Suspense } from 'react';
import { DashboardData } from '../types';
import { WorkoutStatsCards } from './workout-stats-cards';
import { ActiveRoutineCard } from './active-routine-card';
import { TodaysWorkoutCard } from './todays-workout-card';
import { RecentWorkoutsList } from './recent-workouts-list';
import { UpcomingWorkoutsList } from './upcoming-workouts-list';
import { QuickActions } from './quick-actions';
import { LoadingSpinner } from '@/features/shared/components/common/loading-spinner';

interface DashboardOverviewProps {
  data: DashboardData;
}

export function DashboardOverview({ data }: DashboardOverviewProps) {
  const { user, stats, upcomingSessions, recentSessions, inProgressSession, routines } = data;

  // Check if user has an active routine assigned
  const hasActiveRoutine = Boolean(user.activeRoutineId && user.activeRoutine);

  // Get today's workout (first upcoming session or in-progress session)
  const todaysWorkout = inProgressSession || (upcomingSessions.length > 0 ? upcomingSessions[0] : null);

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div>
        <h2 className="text-3xl font-bold text-gray-900">Welcome back, {user.name}!</h2>
        <p className="text-gray-600 mt-2">
          {hasActiveRoutine
            ? `Ready for today's workout? Let's track your progress.`
            : `Get started by selecting a routine to track your workouts.`}
        </p>
      </div>

      {/* Workout Statistics */}
      <Suspense fallback={<LoadingSpinner />}>
        <WorkoutStatsCards stats={stats} />
      </Suspense>

      {/* Active Routine Card - Show routine selection if no active routine */}
      <Suspense fallback={<LoadingSpinner />}>
        <ActiveRoutineCard user={user} routines={routines} hasActiveRoutine={hasActiveRoutine} />
      </Suspense>

      {/* Today's Workout Card - Only show if user has an active routine */}
      {hasActiveRoutine && (
        <Suspense fallback={<LoadingSpinner />}>
          <TodaysWorkoutCard
            workout={todaysWorkout}
            activeRoutine={user.activeRoutine}
            inProgressSession={inProgressSession}
          />
        </Suspense>
      )}

      {/* Quick Actions - Only show if user has an active routine */}
      {hasActiveRoutine && (
        <Suspense fallback={<LoadingSpinner />}>
          <QuickActions activeRoutine={user.activeRoutine} />
        </Suspense>
      )}

      {/* Workout Sessions Lists - Only show if user has data */}
      {(upcomingSessions.length > 0 || recentSessions.length > 0) && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Upcoming Workouts */}
          {upcomingSessions.length > 0 && (
            <Suspense fallback={<LoadingSpinner />}>
              <UpcomingWorkoutsList sessions={upcomingSessions} />
            </Suspense>
          )}

          {/* Recent Workouts */}
          {recentSessions.length > 0 && (
            <Suspense fallback={<LoadingSpinner />}>
              <RecentWorkoutsList sessions={recentSessions} />
            </Suspense>
          )}
        </div>
      )}
    </div>
  );
}
