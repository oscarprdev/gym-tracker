import { db } from '@/lib/db/client';
import { workouts, routines } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function getUserWorkouts(userId: string) {
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
    .innerJoin(routines, eq(workouts.routineId, routines.id))
    .where(eq(routines.userId, userId))
    .orderBy(workouts.routineId, workouts.order);

  return result;
}
