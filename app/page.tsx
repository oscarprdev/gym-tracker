import { requireAuth } from '@/lib/auth/utils';
import { RoutinesDashboard } from '@/features/routines';
import { getUserRoutines } from '@/lib/db/queries/routines';
import { SidebarProvider } from '@/features/shared/providers/sidebar-provider';

export default async function Home() {
  const session = await requireAuth();
  const routines = await getUserRoutines(session.userId);

  return (
    <main>
      <SidebarProvider routines={routines}>
        <RoutinesDashboard routines={routines} />
      </SidebarProvider>
    </main>
  );
}
