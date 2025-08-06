import { RoutineCard } from './routine-card';
import { EmptyState } from '@/features/shared/components/common/empty-state';
import { Button } from '@/features/shared/components/ui/button';
import { Plus, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { getRoutinesWithStatsByUserId } from '@/lib/db/queries/routines';

interface DashboardRoutinesProps {
  userId: string;
}

export async function DashboardRoutines({ userId }: DashboardRoutinesProps) {
  const routines = await getRoutinesWithStatsByUserId(userId, 3);

  if (routines.length === 0) {
    return (
      <EmptyState
        icon={<Plus className="w-12 h-12 text-gray-400" />}
        title="No routines yet"
        description="Create your first routine to start planning your workouts."
        action={
          <Button asChild>
            <Link href="/routines/new">
              <Plus className="w-4 h-4 mr-2" />
              Create Routine
            </Link>
          </Button>
        }
      />
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {routines.map((routine) => (
          <RoutineCard key={routine.id} routine={routine} />
        ))}
      </div>

      <div className="flex justify-center pt-4">
        <Button asChild variant="outline">
          <Link href="/routines">
            See More Routines
            <ArrowRight className="w-4 h-4 ml-2" />
          </Link>
        </Button>
      </div>
    </div>
  );
}
