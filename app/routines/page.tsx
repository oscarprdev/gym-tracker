import { Suspense } from 'react';
import { LoadingSpinner } from '@/components/common/loading-spinner';
import { requireAuth } from '@/lib/auth/dal';
import { getRoutinesWithStatsByUserId } from '@/lib/db/queries/routines';
import { RoutinesList } from '@/components/routines/routines-list';
import { UserMenu } from '@/components/auth/user-menu';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import { getExercisesByUser } from '@/lib/db/queries';

async function RoutinesListServer({ userId }: { userId: string }) {
  const [routines, exercises] = await Promise.all([getRoutinesWithStatsByUserId(userId), getExercisesByUser(userId)]);

  return <RoutinesList routines={routines} exercises={exercises} />;
}

export default async function RoutinesPage() {
  const session = await requireAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link href="/dashboard" className="text-gray-600 hover:text-gray-900">
                ← Back to Dashboard
              </Link>
              <h1 className="text-xl font-semibold text-gray-900">Routines</h1>
            </div>
            <UserMenu />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          {/* Page Header */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">My Routines</h2>
              <p className="text-gray-600 mt-2">Create and manage your workout routines</p>
            </div>
            <Button asChild size="lg">
              <Link href="/routines/new">
                <Plus className="w-4 h-4 mr-2" />
                Create New Routine
              </Link>
            </Button>
          </div>

          {/* Routines List */}
          <Suspense fallback={<LoadingSpinner />}>
            <RoutinesListServer userId={session.user.id} />
          </Suspense>
        </div>
      </main>
    </div>
  );
}
