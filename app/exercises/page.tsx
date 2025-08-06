import { Suspense } from 'react';
import { LoadingSpinner } from '@/features/shared/components/common/loading-spinner';
import { requireAuth } from '@/lib/auth/utils';
import { getExercisesByUserDefault, getExercisesByUser } from '@/lib/db/queries/exercises';
import { ExercisesClient } from '@/features/exercises/components/exercises-client';

async function ExercisesList() {
  const session = await requireAuth();
  const [allExercises, customExercises] = await Promise.all([
    getExercisesByUserDefault(session.user.id),
    getExercisesByUser(session.user.id),
  ]);

  return <ExercisesClient allExercises={allExercises} customExercises={customExercises} />;
}

export default async function ExercisesPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Exercise Library</h1>
          <p className="text-gray-600 mt-2">Manage your exercise library and create custom exercises</p>
        </div>
      </div>

      <Suspense fallback={<LoadingSpinner />}>
        <ExercisesList />
      </Suspense>
    </div>
  );
}
