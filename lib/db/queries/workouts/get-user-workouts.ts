import { db } from '@/lib/db/client';
import { workouts } from '@/lib/db/schema';
import { eq, desc } from 'drizzle-orm';
import { to } from '@/features/shared/utils/error-handler';

export interface UserWorkoutRecord {
  id: string;
  userId: string;
  name: string;
  muscleGroups: string[];
  dayOfWeek: number | null;
  createdAt: Date;
  updatedAt: Date;
}

export async function getUserWorkouts(userId: string): Promise<UserWorkoutRecord[]> {
  const [error, result] = await to(
    db
      .select({
        id: workouts.id,
        userId: workouts.userId,
        name: workouts.name,
        muscleGroups: workouts.muscleGroups,
        dayOfWeek: workouts.dayOfWeek,
        createdAt: workouts.createdAt,
        updatedAt: workouts.updatedAt,
      })
      .from(workouts)
      .where(eq(workouts.userId, userId))
      .orderBy(desc(workouts.createdAt))
  );

  if (error) {
    throw new Error('Failed to fetch workouts for user');
  }

  return result || [];
}
