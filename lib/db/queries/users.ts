import { db } from '../client';
import { users } from '../schema/auth';
import { eq } from 'drizzle-orm';

export const USERS = {
  GET_BY_EMAIL: async (email: string) => {
    return db.query.users.findFirst({
      where: eq(users.email, email),
    });
  },

  GET_BY_ID: async (userId: string) => {
    return db.query.users.findFirst({
      where: eq(users.id, userId),
    });
  },

  SET_ACTIVE_ROUTINE: async (userId: string, routineId: string | null) => {
    const result = await db
      .update(users)
      .set({
        activeRoutineId: routineId,
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId))
      .returning();

    return result[0];
  },
};

export const getUserByEmail = USERS.GET_BY_EMAIL;
export const getUserById = USERS.GET_BY_ID;
export const setUserActiveRoutine = USERS.SET_ACTIVE_ROUTINE;
