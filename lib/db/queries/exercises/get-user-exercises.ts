import { eq, desc } from 'drizzle-orm';
import { db } from '@/lib/db/client';
import { exercises } from '@/lib/db/schema';
import { to } from '@/features/shared/utils/error-handler';

export interface ExerciseRecord {
  id: string;
  name: string;
  muscleGroups: string[];
  createdBy: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export async function getUserExercises(userId: string): Promise<ExerciseRecord[]> {
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
      .where(eq(exercises.createdBy, userId))
      .orderBy(desc(exercises.createdAt))
  );

  if (error) {
    throw new Error('Failed to fetch user exercises');
  }

  return result || [];
}
