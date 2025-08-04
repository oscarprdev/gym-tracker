import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { requireAuth } from '@/lib/auth/dal';
import { getRoutineWithWorkouts } from '@/lib/db/queries/routines';
import { EditRoutine } from '@/components/routines/edit-routine';
import { UserMenu } from '@/components/auth/user-menu';
import { LoadingSpinner } from '@/components/common/loading-spinner';
import Link from 'next/link';
import { RoutineDetail } from '@/lib/types/routines';
import { getExercisesByUser } from '@/lib/db/queries';

interface RoutineDetailPageProps {
  params: Promise<{ id: string }>;
}

async function EditRoutineServer({ routineId, userId }: { routineId: string; userId: string }) {
  const [routine, exercises] = await Promise.all([getRoutineWithWorkouts(routineId), getExercisesByUser(userId)]);

  if (!routine || routine.userId !== userId) {
    notFound();
  }

  const routineDetail: RoutineDetail = {
    id: routine.id,
    userId: routine.userId,
    name: routine.name,
    description: routine.description,
    color: routine.color,
    createdAt: routine.createdAt,
    updatedAt: routine.updatedAt,
    workouts: routine.workouts.map((workout) => ({
      id: workout.id,
      name: workout.name,
      dayOfWeek: workout.dayOfWeek,
      order: workout.order,
      exercises: workout.exercises.map((workoutExercise) => ({
        id: workoutExercise.id,
        order: workoutExercise.order,
        exercise: workoutExercise.exercise,
        sets: workoutExercise.sets,
      })),
    })),
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">{routine.name}</h2>
          <p className="text-gray-600 mt-2">View and edit your weekly workout routine</p>
        </div>
        <div className="flex gap-2">
          <Link
            href={`/workout/${routineId}`}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Start Workout
          </Link>
        </div>
      </div>
      <EditRoutine routineDetail={routineDetail} exercises={exercises} />;
    </div>
  );
}

export default async function RoutineDetailPage({ params }: RoutineDetailPageProps) {
  const { id } = await params;
  const session = await requireAuth();

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
          <EditRoutineServer routineId={id} userId={session.user.id} />
        </Suspense>
      </main>
    </div>
  );
}
