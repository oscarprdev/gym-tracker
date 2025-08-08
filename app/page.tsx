import { requireAuth } from '@/lib/auth/utils';
import { RoutinesDashboard } from '@/features/routines';
import { getUserRoutines } from '@/lib/db/queries/routines';
import { getUserWorkouts } from '@/lib/db/queries/workouts';

export default async function Home() {
  const session = await requireAuth();
  const [routines, workouts] = await Promise.all([getUserRoutines(session.userId), getUserWorkouts(session.userId)]);

  return (
    <main>
      <RoutinesDashboard routines={routines} workouts={workouts} />
    </main>
  );
}
