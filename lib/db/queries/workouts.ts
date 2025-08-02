// import { db } from '../client';
// import { workoutSessions } from '../schema/workout-sessions';
// import { eq } from 'drizzle-orm';

/**
 * Workout session-related database queries
 * TODO: Implement when workout sessions schema is ready
 */

// export async function getWorkoutSessionById(id: string) {
//   const result = await db
//     .select()
//     .from(workoutSessions)
//     .where(eq(workoutSessions.id, id))
//     .limit(1);
//
//   return result[0] || null;
// }

// export async function getWorkoutSessionsByUserId(userId: string) {
//   return db
//     .select()
//     .from(workoutSessions)
//     .where(eq(workoutSessions.userId, userId));
// }

// Placeholder to prevent empty file linting error
export const WORKOUTS_QUERIES_PLACEHOLDER = true;
