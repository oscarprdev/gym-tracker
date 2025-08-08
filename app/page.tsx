import { requireAuth } from '@/lib/auth/utils';
import { getUserRoutines } from '@/lib/db/queries/routines';
import { SidebarProvider } from '@/features/shared/providers/sidebar-provider';
import { RoutinesList } from '@/features/routines';

export default async function Home() {
  const session = await requireAuth();
  const routines = await getUserRoutines(session.userId);

  return (
    <main>
      <SidebarProvider routines={routines}>
        <RoutinesList />
      </SidebarProvider>
    </main>
  );
}
