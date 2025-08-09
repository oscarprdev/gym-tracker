'use server';

import { protectedAction } from '@/features/shared/utils/error-handler';
import { to } from '@/features/shared/utils/error-handler';
import { getUserWorkouts } from '@/lib/db/queries/workouts/get-user-workouts';

export const getUserWorkoutsAction = protectedAction(async (session) => {
  const [error, result] = await to(getUserWorkouts(session.userId));

  if (error) {
    return { error: error.message, workouts: [] };
  }

  return { error: null, workouts: result };
});
