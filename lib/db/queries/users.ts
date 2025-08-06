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

  UPDATE: async (userId: string, data: { name: string; email: string }) => {
    await db
      .update(users)
      .set({
        name: data.name,
        email: data.email,
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId));
  },

  SET_ACTIVE_ROUTINE: async (userId: string, routineId: string | null) => {
    const result = await db
      .update(users)
      .set({
        activeRoutineId: routineId,
        routineAssigned: routineId !== null,
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId))
      .returning();

    return result[0];
  },

  DELETE: async (userId: string) => {
    await db.delete(users).where(eq(users.id, userId));
  },

  // Separate functions for relational queries when needed
  GET_WITH_ROUTINES: async (userId: string) => {
    return db.query.users.findFirst({
      where: eq(users.id, userId),
      with: {
        routines: true,
      },
    });
  },

  GET_WITH_ACTIVE_ROUTINE: async (userId: string) => {
    return db.query.users.findFirst({
      where: eq(users.id, userId),
      with: {
        activeRoutine: true,
      },
    });
  },
};

export const getUserByEmail = USERS.GET_BY_EMAIL;
export const getUserById = USERS.GET_BY_ID;
export const updateUserProfile = USERS.UPDATE;
export const setUserActiveRoutine = USERS.SET_ACTIVE_ROUTINE;
export const deleteUser = USERS.DELETE;
