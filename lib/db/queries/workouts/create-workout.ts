import { db } from '@/lib/db/client';
import { workouts } from '@/lib/db/schema';

export interface CreateWorkoutData {
  userId: string;
  name: string;
  dayOfWeek?: number | null;
  muscleGroups: string[];
}

export async function createWorkout(data: CreateWorkoutData) {
  const workoutId = crypto.randomUUID();
  const now = new Date();

  const result = await db
    .insert(workouts)
    .values({
      id: workoutId,
      userId: data.userId,
      name: data.name,
      dayOfWeek: data.dayOfWeek || null,
      muscleGroups: data.muscleGroups,
      createdAt: now,
      updatedAt: now,
    })
    .returning({
      id: workouts.id,
      userId: workouts.userId,
      name: workouts.name,
      dayOfWeek: workouts.dayOfWeek,
      muscleGroups: workouts.muscleGroups,
      createdAt: workouts.createdAt,
      updatedAt: workouts.updatedAt,
    });

  return result[0];
}
