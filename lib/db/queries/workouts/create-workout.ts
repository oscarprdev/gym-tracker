import { db } from '@/lib/db/client';
import { workouts } from '@/lib/db/schema';
import { sql } from 'drizzle-orm';

export interface CreateWorkoutData {
  routineId: string;
  name: string;
  dayOfWeek?: number | null;
}

export async function createWorkout(data: CreateWorkoutData) {
  const workoutId = crypto.randomUUID();
  const now = new Date();

  // Get the next order value for this routine
  const maxOrderResult = await db
    .select({ maxOrder: sql<number>`COALESCE(MAX(${workouts.order}), 0)` })
    .from(workouts)
    .where(sql`${workouts.routineId} = ${data.routineId}`);

  const nextOrder = (maxOrderResult[0]?.maxOrder || 0) + 1;

  const result = await db
    .insert(workouts)
    .values({
      id: workoutId,
      routineId: data.routineId,
      name: data.name,
      dayOfWeek: data.dayOfWeek || null,
      order: nextOrder,
      createdAt: now,
      updatedAt: now,
    })
    .returning({
      id: workouts.id,
      routineId: workouts.routineId,
      name: workouts.name,
      dayOfWeek: workouts.dayOfWeek,
      order: workouts.order,
      createdAt: workouts.createdAt,
      updatedAt: workouts.updatedAt,
    });

  return result[0];
}
