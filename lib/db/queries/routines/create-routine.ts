import { db } from '@/lib/db/client';
import { routines } from '@/lib/db/schema';
import { to } from '@/features/shared/utils/error-handler';
import type { RoutineRecord } from './get-user-routines';

export interface CreateRoutineData {
  name: string;
  userId: string;
}

export async function createRoutine(data: CreateRoutineData): Promise<RoutineRecord> {
  const [error, result] = await to(
    db
      .insert(routines)
      .values({
        id: crypto.randomUUID(),
        userId: data.userId,
        name: data.name,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning({
        id: routines.id,
        name: routines.name,
        userId: routines.userId,
        createdAt: routines.createdAt,
        updatedAt: routines.updatedAt,
      })
  );

  if (error || !result?.[0]) {
    throw new Error('Failed to create routine');
  }

  return result[0];
}
