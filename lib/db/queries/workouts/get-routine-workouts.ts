import { db } from '@/lib/db/client';
import { workouts, routinesWorkouts } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { to } from '@/features/shared/utils/error-handler';

export interface WorkoutRecord {
  id: string;
  userId: string;
  name: string;
  muscleGroups: string[];
  dayOfWeek: number | null;
  createdAt: Date;
  updatedAt: Date;
}

export async function getRoutineWorkouts(routineId: string): Promise<WorkoutRecord[]> {
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
      .innerJoin(routinesWorkouts, eq(workouts.id, routinesWorkouts.workoutId))
      .where(eq(routinesWorkouts.routineId, routineId))
      .orderBy(workouts.name)
  );

  if (error) {
    throw new Error('Failed to fetch routine workouts');
  }

  return result || [];
}
