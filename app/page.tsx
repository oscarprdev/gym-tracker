import { requireAuth } from '@/lib/auth/utils';
import { RoutinesDashboard } from '@/features/routines';
import { getUserRoutines } from '@/lib/db/queries/routines';

export default async function Home() {
  const session = await requireAuth();
  const routines = await getUserRoutines(session.userId);

  return (
    <main>
      <RoutinesDashboard routines={routines} />
    </main>
  );
}
