import { db } from '@/lib/db/client';
import { exercises } from '@/lib/db/schema';
import { to } from '@/features/shared/utils/error-handler';
import type { ExerciseRecord } from './get-user-exercises';

export interface CreateExerciseData {
  name: string;
  muscleGroups: string[];
  userId: string;
}

export async function createExercise(data: CreateExerciseData): Promise<ExerciseRecord> {
  const [error, result] = await to(
    db
      .insert(exercises)
      .values({
        id: crypto.randomUUID(),
        name: data.name,
        muscleGroups: data.muscleGroups,
        createdBy: data.userId,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning({
        id: exercises.id,
        name: exercises.name,
        muscleGroups: exercises.muscleGroups,
        createdBy: exercises.createdBy,
        createdAt: exercises.createdAt,
        updatedAt: exercises.updatedAt,
      })
  );

  if (error || !result?.[0]) {
    throw new Error('Failed to create exercise');
  }

  return result[0];
}
