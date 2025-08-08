import { eq, and } from 'drizzle-orm';
import { db } from '@/lib/db/client';
import { routines } from '@/lib/db/schema';
import { to } from '@/features/shared/utils/error-handler';

export async function deleteRoutine(id: string, userId: string): Promise<void> {
  const [error] = await to(db.delete(routines).where(and(eq(routines.id, id), eq(routines.userId, userId))));

  if (error) {
    throw new Error('Failed to delete routine');
  }
}
