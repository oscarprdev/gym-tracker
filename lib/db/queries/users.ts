import { db } from '../client';
import { users } from '../schema/auth';
import { eq } from 'drizzle-orm';

export const USERS = {
  GET_BY_EMAIL: async (email: string) => {
    return db.query.users.findFirst({
      where: eq(users.email, email),
      with: {
        routines: true,
      },
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

  DELETE: async (userId: string) => {
    await db.delete(users).where(eq(users.id, userId));
  },
};

export const getUserByEmail = USERS.GET_BY_EMAIL;
export const updateUserProfile = USERS.UPDATE;
export const deleteUser = USERS.DELETE;
