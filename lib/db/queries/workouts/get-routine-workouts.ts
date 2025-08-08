import { db } from '@/lib/db/client';
import { workouts } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function getRoutineWorkouts(routineId: string) {
  const result = await db
    .select({
      id: workouts.id,
      routineId: workouts.routineId,
      name: workouts.name,
      dayOfWeek: workouts.dayOfWeek,
      order: workouts.order,
      createdAt: workouts.createdAt,
      updatedAt: workouts.updatedAt,
    })
    .from(workouts)
    .where(eq(workouts.routineId, routineId))
    .orderBy(workouts.order);

  return result;
}

export type WorkoutRecord = Awaited<ReturnType<typeof getRoutineWorkouts>>[0];
