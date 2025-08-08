import { requireAuth } from '@/features/shared/utils/error-handler';
import { getUserExercises } from '@/lib/db/queries/exercises/get-user-exercises';
import { ExercisesDashboard } from './components/exercises-dashboard';

export default async function ExercisesPage() {
  const session = await requireAuth();
  const exercises = await getUserExercises(session.userId);

  return (
    <main className="min-h-screen">
      <ExercisesDashboard exercises={exercises} />
    </main>
  );
}
