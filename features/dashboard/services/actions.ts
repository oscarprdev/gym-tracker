'use server';

import { redirect } from 'next/navigation';
import { headers } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { auth } from '@/lib/auth/auth';
import { to, protectedAction } from '@/lib/utils/error-handler';
import {
  startWorkoutSession,
  completeWorkoutSession,
  skipWorkoutSession,
  createWorkoutSession,
} from '@/lib/db/queries/workout-sessions';
import { setUserActiveRoutine } from '@/lib/db/queries/users';

export async function logoutAction() {
  const [logoutError] = await to(
    auth.api.signOut({
      headers: await headers(),
    })
  );

  if (logoutError) {
    console.error('Logout error:', logoutError);
  }

  redirect('/auth/login');
}

export const assignActiveRoutine = protectedAction(async (session, routineId: string) => {
  if (!routineId) {
    return { error: 'Routine ID is required' };
  }

  const [error] = await to(setUserActiveRoutine(session.user.id, routineId));

  if (error) {
    return { error: 'Failed to assign active routine' };
  }

  revalidatePath('/dashboard');
  return { success: true };
});

export const unassignActiveRoutine = protectedAction(async (session) => {
  const [error] = await to(setUserActiveRoutine(session.user.id, null));

  if (error) {
    return { error: 'Failed to unassign active routine' };
  }

  revalidatePath('/dashboard');
  return { success: true };
});

export const startWorkoutSessionAction = protectedAction(async (session, sessionId: string) => {
  if (!sessionId) {
    return { error: 'Session ID is required' };
  }

  const [error, workoutSession] = await to(startWorkoutSession(sessionId));

  if (error || !workoutSession) {
    return { error: 'Failed to start workout session' };
  }

  revalidatePath('/dashboard');
  return { success: true, session: workoutSession };
});

export const completeWorkoutSessionAction = protectedAction(
  async (session, sessionId: string, durationMinutes?: number) => {
    if (!sessionId) {
      return { error: 'Session ID is required' };
    }

    const [error, workoutSession] = await to(completeWorkoutSession(sessionId, durationMinutes));

    if (error || !workoutSession) {
      return { error: 'Failed to complete workout session' };
    }

    revalidatePath('/dashboard');
    return { success: true, session: workoutSession };
  }
);

export const skipWorkoutSessionAction = protectedAction(async (session, sessionId: string) => {
  if (!sessionId) {
    return { error: 'Session ID is required' };
  }

  const [error, workoutSession] = await to(skipWorkoutSession(sessionId));

  if (error || !workoutSession) {
    return { error: 'Failed to skip workout session' };
  }

  revalidatePath('/dashboard');
  return { success: true, session: workoutSession };
});

export const createWorkoutSessionAction = protectedAction(
  async (
    session,
    data: {
      workoutId?: string;
      name: string;
      scheduledDate?: Date;
    }
  ) => {
    if (!data.name) {
      return { error: 'Workout name is required' };
    }

    const [error, workoutSession] = await to(
      createWorkoutSession({
        userId: session.user.id,
        workoutId: data.workoutId,
        name: data.name,
        scheduledDate: data.scheduledDate,
        status: 'planned',
      })
    );

    if (error || !workoutSession) {
      return { error: 'Failed to create workout session' };
    }

    revalidatePath('/dashboard');
    return { success: true, session: workoutSession };
  }
);
