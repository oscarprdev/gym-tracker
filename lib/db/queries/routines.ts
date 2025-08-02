// import { db } from '../client';
// import { routines } from '../schema/routines';
// import { eq } from 'drizzle-orm';

/**
 * Routine-related database queries
 * TODO: Implement when routines schema is ready
 */

// export async function getRoutineById(id: string) {
//   const result = await db
//     .select()
//     .from(routines)
//     .where(eq(routines.id, id))
//     .limit(1);
//
//   return result[0] || null;
// }

// export async function getRoutinesByUserId(userId: string) {
//   return db
//     .select()
//     .from(routines)
//     .where(eq(routines.userId, userId));
// }

// Placeholder to prevent empty file linting error
export const ROUTINES_QUERIES_PLACEHOLDER = true;
