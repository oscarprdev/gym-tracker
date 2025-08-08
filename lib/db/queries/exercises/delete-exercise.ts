import { eq, and } from 'drizzle-orm';
import { db } from '@/lib/db/client';
import { exercises } from '@/lib/db/schema';
import { to } from '@/features/shared/utils/error-handler';

export async function deleteExercise(exerciseId: string, userId: string): Promise<void> {
  const [error, result] = await to(
    db
      .delete(exercises)
      .where(and(eq(exercises.id, exerciseId), eq(exercises.createdBy, userId)))
      .returning({ id: exercises.id })
  );

  if (error) {
    throw new Error('Failed to delete exercise');
  }

  if (!result?.[0]) {
    throw new Error('Exercise not found or not authorized');
  }
}
