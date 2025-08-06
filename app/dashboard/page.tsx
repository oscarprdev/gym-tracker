import { Metadata } from 'next';
import { Suspense } from 'react';
import { requireAuth } from '@/lib/auth/dal';
import { UserMenu } from '@/features/auth/components/user-menu';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/features/shared/components/ui/card';
import { Button } from '@/features/shared/components/ui/button';
import { DashboardRoutines } from '@/features/routines/components/dashboard-routines';
import { LoadingSpinner } from '@/features/shared/components/common/loading-spinner';
import { Plus } from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Dashboard | Gym Tracker',
  description: 'Your gym tracker dashboard',
};

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
        <div className="space-y-8">
          {/* Welcome Section */}
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Welcome back, {session.user.name}!</h2>
            <p className="text-gray-600 mt-2">Ready for today&apos;s workout? Let&apos;s track your progress.</p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium text-gray-600">This Week</CardTitle>
                <CardDescription className="text-2xl font-bold text-gray-900">0 workouts</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">No workouts completed yet</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium text-gray-600">Total Workouts</CardTitle>
                <CardDescription className="text-2xl font-bold text-gray-900">0</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">Start your fitness journey!</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium text-gray-600">Current Streak</CardTitle>
                <CardDescription className="text-2xl font-bold text-gray-900">0 days</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">Time to get started</p>
              </CardContent>
            </Card>
          </div>

          {/* Today's Routine */}
          <Card>
            <CardHeader>
              <CardTitle>Today&apos;s Routine</CardTitle>
              <CardDescription>No routine scheduled for today</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <p className="text-gray-600 mb-4">You don&apos;t have any routines scheduled for today.</p>
                <p className="text-sm text-gray-500">Create your first routine to start tracking your workouts!</p>
              </div>
            </CardContent>
          </Card>

          {/* Routines Section */}
          <div className="space-y-6">
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

            <Suspense fallback={<LoadingSpinner />}>
              <DashboardRoutines userId={session.user.id} />
            </Suspense>
          </div>
        </div>
      </main>
    </div>
  );
}
