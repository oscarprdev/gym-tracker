import { db } from '@/lib/db/client';
import { routines } from '@/lib/db/schema';
import { to } from '@/features/shared/utils/error-handler';
import { linkWorkoutsToRoutine } from './routines-workouts';
import type { RoutineRecord } from './get-user-routines';

export interface CreateRoutineData {
  name: string;
  userId: string;
  workoutIds?: string[];
}

export async function createRoutine(data: CreateRoutineData): Promise<RoutineRecord> {
  return await db.transaction(async (tx) => {
    // Step 1: Create the routine
    const [routineError, routineResult] = await to(
      tx
        .insert(routines)
        .values({
          id: crypto.randomUUID(),
          userId: data.userId,
          name: data.name,
          createdAt: new Date(),
          updatedAt: new Date(),
        })
        .returning({
          id: routines.id,
          name: routines.name,
          userId: routines.userId,
          isActive: routines.isActive,
          createdAt: routines.createdAt,
          updatedAt: routines.updatedAt,
        })
    );

    if (routineError || !routineResult?.[0]) {
      throw new Error('Failed to create routine');
    }

    const routine = routineResult[0];

    // Step 2: Link workouts if provided
    if (data.workoutIds && data.workoutIds.length > 0) {
      const [linkError] = await to(linkWorkoutsToRoutine(routine.id, data.workoutIds));

      if (linkError) {
        throw new Error('Failed to link workouts to routine');
      }
    }

    return routine;
  });
}
