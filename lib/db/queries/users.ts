import { db } from '../client';
import { users } from '../schema/auth';
import { eq } from 'drizzle-orm';

/**
 * User-related database queries
 */

export async function getUserById(id: string) {
  const result = await db.select().from(users).where(eq(users.id, id)).limit(1);

  return result[0] || null;
}

export async function getUserByEmail(email: string) {
  const result = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  return result[0] || null;
}

export async function updateUserProfile(
  userId: string,
  data: { name: string; email: string }
) {
  await db
    .update(users)
    .set({
      name: data.name,
      email: data.email,
      updatedAt: new Date(),
    })
    .where(eq(users.id, userId));
}

export async function deleteUser(userId: string) {
  await db.delete(users).where(eq(users.id, userId));
}
