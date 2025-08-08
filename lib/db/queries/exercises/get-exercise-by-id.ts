import { eq, and } from 'drizzle-orm';
import { db } from '@/lib/db/client';
import { exercises } from '@/lib/db/schema';
import { to } from '@/features/shared/utils/error-handler';
import type { ExerciseRecord } from './get-user-exercises';

export async function getExerciseById(exerciseId: string, userId: string): Promise<ExerciseRecord | null> {
  const [error, result] = await to(
    db
      .select({
        id: exercises.id,
        name: exercises.name,
        muscleGroups: exercises.muscleGroups,
        createdBy: exercises.createdBy,
        createdAt: exercises.createdAt,
        updatedAt: exercises.updatedAt,
      })
      .from(exercises)
      .where(and(eq(exercises.id, exerciseId), eq(exercises.createdBy, userId)))
      .limit(1)
  );

  if (error) {
    throw new Error('Failed to fetch exercise');
  }

  return result?.[0] || null;
}
