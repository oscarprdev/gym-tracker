import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { requireAuth } from '@/lib/auth/dal';
import { getRoutineWithWorkouts } from '@/lib/db/queries/routines';
import { RoutineDetailView } from '@/components/routines/routine-detail-view';
import { UserMenu } from '@/components/auth/user-menu';
import { LoadingSpinner } from '@/components/common/loading-spinner';
import Link from 'next/link';

interface RoutineDetailPageProps {
  params: Promise<{ id: string }>;
}

async function RoutineDetail({ routineId, userId }: { routineId: string; userId: string }) {
  const routine = await getRoutineWithWorkouts(routineId);

  if (!routine || routine.userId !== userId) {
    notFound();
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">{routine.name}</h2>
          <p className="text-gray-600 mt-2">View your weekly workout routine and exercise details</p>
        </div>
      </div>

      {/* Routine Detail View */}
      <RoutineDetailView routine={routine} />
    </div>
  );
}

export default async function RoutineDetailPage({ params }: RoutineDetailPageProps) {
  const session = await requireAuth();
  const { id } = await params;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link href="/routines" className="text-gray-600 hover:text-gray-900">
                ← Back to Routines
              </Link>
              <h1 className="text-xl font-semibold text-gray-900">Routine Details</h1>
            </div>
            <UserMenu />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <Suspense fallback={<LoadingSpinner />}>
          <RoutineDetail routineId={id} userId={session.user.id} />
        </Suspense>
      </main>
    </div>
  );
}
