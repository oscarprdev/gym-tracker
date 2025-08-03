import { Metadata } from 'next';
import { requireAuth } from '@/lib/auth/dal';
import { UserMenu } from '@/components/auth/user-menu';
import { RoutineBuilderForm } from '@/components/routines/routine-builder-form';
import { getAllExercises } from '@/lib/db/queries/exercises';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Create New Routine | Gym Tracker',
  description: 'Create a new workout routine',
};

export default async function NewRoutinePage() {
  const session = await requireAuth();

  const exercises = await getAllExercises();

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
              <h1 className="text-xl font-semibold text-gray-900">Create New Routine</h1>
            </div>
            <UserMenu />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <RoutineBuilderForm exercises={exercises} userId={session.user.id} />
      </main>
    </div>
  );
}
