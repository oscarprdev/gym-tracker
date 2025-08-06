import { Metadata } from 'next';
import { Suspense } from 'react';
import { requireAuth } from '@/lib/auth/dal';
import { UserMenu } from '@/features/auth/components/user-menu';
import { Button } from '@/features/shared/components/ui/button';
import { DashboardRoutines } from '@/features/routines/components/dashboard-routines';
import { DashboardOverview } from '@/features/dashboard/components/dashboard-overview';
import { DashboardLoadingSkeleton } from '@/features/dashboard/components/dashboard-loading';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import {
  getInProgressWorkoutSession,
  getRecentCompletedWorkoutSessions,
  getRoutinesWithStatsByUserId,
  getUpcomingWorkoutSessions,
  getUserById,
  getWorkoutSessionStats,
} from '@/lib/db/queries';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Dashboard | Gym Tracker',
  description: 'Your gym tracker dashboard',
};

async function DashboardContent({ userId }: { userId: string }) {
  const [user, stats, upcomingSessionWorkouts, recentSessions, inProgressSession, routines] = await Promise.all([
    getUserById(userId),
    getWorkoutSessionStats(userId, 30),
    getUpcomingWorkoutSessions(userId, 5),
    getRecentCompletedWorkoutSessions(userId, 5),
    getInProgressWorkoutSession(userId),
    getRoutinesWithStatsByUserId(userId, 5),
  ]);

  if (!user) redirect('/login');

  const dashboardData = {
    user,
    stats: stats || {
      totalCompleted: 0,
      totalDurationMinutes: 0,
      averageDurationMinutes: 0,
      completionRate: 0,
    },
    upcomingSessions: upcomingSessionWorkouts || [],
    recentSessions: recentSessions || [],
    inProgressSession: inProgressSession || null,
    routines: routines || [],
  };

  return <DashboardOverview data={dashboardData} />;
}

export default async function DashboardPage() {
  const session = await requireAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <h1 className="text-xl font-semibold text-gray-900">Gym Tracker</h1>
            <UserMenu />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <Suspense fallback={<DashboardLoadingSkeleton />}>
          <DashboardContent userId={session.user.id} />
        </Suspense>

        {/* Routines Section - Keep existing section for now */}
        <div className="mt-12 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-bold text-gray-900">My Routines</h3>
              <p className="text-gray-600 mt-1">Manage and organize your workout routines</p>
            </div>
            <Button asChild>
              <Link href="/routines/new">
                <Plus className="w-4 h-4 mr-2" />
                Add Routine
              </Link>
            </Button>
          </div>

          <Suspense fallback={<DashboardLoadingSkeleton />}>
            <DashboardRoutines userId={session.user.id} />
          </Suspense>
        </div>
      </main>
    </div>
  );
}
