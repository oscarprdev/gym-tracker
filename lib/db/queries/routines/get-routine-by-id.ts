import { eq, and } from 'drizzle-orm';
import { db } from '@/lib/db/client';
import { routines } from '@/lib/db/schema';
import { to } from '@/features/shared/utils/error-handler';
import type { RoutineRecord } from './get-user-routines';

export async function getRoutineById(id: string, userId: string): Promise<RoutineRecord | null> {
  const [error, result] = await to(
    db
      .select({
        id: routines.id,
        name: routines.name,
        userId: routines.userId,
        createdAt: routines.createdAt,
        updatedAt: routines.updatedAt,
      })
      .from(routines)
      .where(and(eq(routines.id, id), eq(routines.userId, userId)))
      .limit(1)
  );

  if (error) {
    throw new Error('Failed to fetch routine');
  }

  return result?.[0] || null;
}
