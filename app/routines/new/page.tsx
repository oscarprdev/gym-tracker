import { Metadata } from 'next';
import { requireAuth } from '@/lib/auth/dal';
import { UserMenu } from '@/components/auth/user-menu';
import { CreateRoutine } from '@/components/routines/create-routine';
import Link from 'next/link';
import { Suspense } from 'react';
import { LoadingSpinner } from '@/components/common/loading-spinner';

export const metadata: Metadata = {
  title: 'Create New Routine | Gym Tracker',
  description: 'Create a new workout routine with weekly scheduling',
};

async function CreateRoutineServer() {
  return <CreateRoutine />;
}

export default async function NewRoutinePage() {
  await requireAuth();
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link href="/routines" className="text-gray-600 hover:text-gray-900">
                ← Back to Routines
              </Link>
              <h1 className="text-xl font-semibold text-gray-900">Create New Routine</h1>
            </div>
            <UserMenu />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Create Weekly Routine</h2>
            <p className="text-gray-600 mt-2">
              Build your weekly workout routine by creating workouts and assigning them to specific days
            </p>
          </div>

          <Suspense fallback={<LoadingSpinner />}>
            <CreateRoutineServer />
          </Suspense>
        </div>
      </main>
    </div>
  );
}
