import { db } from '@/lib/db/client';
import { routinesWorkouts } from '@/lib/db/schema';
import { eq, and, sql } from 'drizzle-orm';
import { to } from '@/features/shared/utils/error-handler';

export interface RoutineWorkoutLink {
  routineId: string;
  workoutId: string;
  createdAt: Date;
}

export async function linkWorkoutsToRoutine(routineId: string, workoutIds: string[]): Promise<RoutineWorkoutLink[]> {
  if (workoutIds.length === 0) return [];

  const linksToCreate = workoutIds.map((workoutId) => ({
    routineId,
    workoutId,
    createdAt: new Date(),
  }));

  const [error, result] = await to(
    db.insert(routinesWorkouts).values(linksToCreate).returning({
      routineId: routinesWorkouts.routineId,
      workoutId: routinesWorkouts.workoutId,
      createdAt: routinesWorkouts.createdAt,
    })
  );

  if (error || !result) {
    throw new Error('Failed to link workouts to routine');
  }

  return result;
}

export async function unlinkWorkoutsFromRoutine(routineId: string, workoutIds: string[]): Promise<void> {
  if (workoutIds.length === 0) return;

  const [error] = await to(
    db
      .delete(routinesWorkouts)
      .where(and(eq(routinesWorkouts.routineId, routineId), sql`${routinesWorkouts.workoutId} = ANY(${workoutIds})`))
  );

  if (error) {
    throw new Error('Failed to unlink workouts from routine');
  }
}

export async function unlinkAllWorkoutsFromRoutine(routineId: string): Promise<void> {
  const [error] = await to(db.delete(routinesWorkouts).where(eq(routinesWorkouts.routineId, routineId)));

  if (error) {
    throw new Error('Failed to unlink all workouts from routine');
  }
}

export async function getRoutineWorkoutLinks(routineId: string): Promise<string[]> {
  const [error, result] = await to(
    db
      .select({
        workoutId: routinesWorkouts.workoutId,
      })
      .from(routinesWorkouts)
      .where(eq(routinesWorkouts.routineId, routineId))
  );

  if (error) {
    throw new Error('Failed to fetch routine workout links');
  }

  return result?.map((link) => link.workoutId) || [];
}

export async function getWorkoutRoutineLinks(workoutId: string): Promise<string[]> {
  const [error, result] = await to(
    db
      .select({
        routineId: routinesWorkouts.routineId,
      })
      .from(routinesWorkouts)
      .where(eq(routinesWorkouts.workoutId, workoutId))
  );

  if (error) {
    throw new Error('Failed to fetch workout routine links');
  }

  return result?.map((link) => link.routineId) || [];
}
