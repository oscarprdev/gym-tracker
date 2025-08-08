import { eq, desc } from 'drizzle-orm';
import { db } from '@/lib/db/client';
import { routines } from '@/lib/db/schema';
import { to } from '@/features/shared/utils/error-handler';

export interface RoutineRecord {
  id: string;
  name: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

export async function getUserRoutines(userId: string): Promise<RoutineRecord[]> {
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
      .where(eq(routines.userId, userId))
      .orderBy(desc(routines.createdAt))
  );

  if (error) {
    throw new Error('Failed to fetch user routines');
  }

  return result || [];
}
