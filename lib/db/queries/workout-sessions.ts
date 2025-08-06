import { db } from '../client';
import { workoutSessions } from '../schema/workout-sessions';
import { eq, desc, asc, and, gte, lte, isNull, isNotNull, ne, count, sql } from 'drizzle-orm';
import { to } from '@/lib/utils';

export const WORKOUT_SESSIONS = {
  GET_BY_USER_ID: async (userId: string) => {
    return db.query.workoutSessions.findMany({
      where: eq(workoutSessions.userId, userId),
      orderBy: desc(workoutSessions.scheduledDate),
      with: {
        workout: {
          with: {
            routine: true,
          },
        },
      },
    });
  },

  GET_BY_ID: async (id: string) => {
    return db.query.workoutSessions.findFirst({
      where: eq(workoutSessions.id, id),
      with: {
        workout: {
          with: {
            routine: true,
            workoutExercises: {
              orderBy: asc(workoutSessions.createdAt),
              with: {
                exercise: true,
                sets: true,
              },
            },
          },
        },
      },
    });
  },

  GET_SCHEDULED_FOR_DATE_RANGE: async (userId: string, startDate: Date, endDate: Date) => {
    return db.query.workoutSessions.findMany({
      where: and(
        eq(workoutSessions.userId, userId),
        gte(workoutSessions.scheduledDate, startDate),
        lte(workoutSessions.scheduledDate, endDate)
      ),
      orderBy: asc(workoutSessions.scheduledDate),
      with: {
        workout: {
          with: {
            routine: true,
          },
        },
      },
    });
  },

  GET_UPCOMING: async (userId: string, limit = 5) => {
    const now = new Date();
    return db.query.workoutSessions.findMany({
      where: and(
        eq(workoutSessions.userId, userId),
        gte(workoutSessions.scheduledDate, now),
        ne(workoutSessions.status, 'completed')
      ),
      orderBy: asc(workoutSessions.scheduledDate),
      limit,
      with: {
        workout: {
          with: {
            routine: true,
          },
        },
      },
    });
  },

  GET_RECENT_COMPLETED: async (userId: string, limit = 5) => {
    return db.query.workoutSessions.findMany({
      where: and(
        eq(workoutSessions.userId, userId),
        eq(workoutSessions.status, 'completed'),
        isNotNull(workoutSessions.completedAt)
      ),
      orderBy: desc(workoutSessions.completedAt),
      limit,
      with: {
        workout: {
          with: {
            routine: true,
          },
        },
      },
    });
  },

  GET_IN_PROGRESS: async (userId: string) => {
    return db.query.workoutSessions.findFirst({
      where: and(
        eq(workoutSessions.userId, userId),
        eq(workoutSessions.status, 'in_progress'),
        isNotNull(workoutSessions.startedAt),
        isNull(workoutSessions.completedAt)
      ),
      with: {
        workout: {
          with: {
            routine: true,
            workoutExercises: {
              orderBy: asc(workoutSessions.createdAt),
              with: {
                exercise: true,
                sets: true,
              },
            },
          },
        },
      },
    });
  },

  GET_STATS: async (userId: string, days = 30) => {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const [error, sessions] = await to(
      db.query.workoutSessions.findMany({
        where: and(
          eq(workoutSessions.userId, userId),
          gte(workoutSessions.completedAt, startDate),
          eq(workoutSessions.status, 'completed')
        ),
      })
    );

    if (error || !sessions) {
      return {
        totalCompleted: 0,
        totalDurationMinutes: 0,
        averageDurationMinutes: 0,
        completionRate: 0,
      };
    }

    const totalCompleted = sessions.length;
    const totalDurationMinutes = sessions.reduce((sum, session) => sum + (session.durationMinutes || 0), 0);
    const averageDurationMinutes = totalCompleted > 0 ? Math.round(totalDurationMinutes / totalCompleted) : 0;

    // Get completion rate by counting completed vs total scheduled in a single query
    const [statsError, statsResult] = await to(
      db
        .select({
          totalScheduled: count(),
          totalCompletedCount: count(sql`CASE WHEN ${workoutSessions.status} = 'completed' THEN 1 END`),
        })
        .from(workoutSessions)
        .where(
          and(
            eq(workoutSessions.userId, userId),
            gte(workoutSessions.scheduledDate, startDate),
            lte(workoutSessions.scheduledDate, new Date())
          )
        )
    );

    const completionRate =
      statsError || !statsResult || !statsResult[0]
        ? 0
        : statsResult[0].totalScheduled > 0
          ? Math.round((statsResult[0].totalCompletedCount / statsResult[0].totalScheduled) * 100)
          : 0;

    return {
      totalCompleted,
      totalDurationMinutes,
      averageDurationMinutes,
      completionRate,
    };
  },

  CREATE: async (data: {
    userId: string;
    workoutId?: string;
    name: string;
    scheduledDate?: Date;
    status?: 'planned' | 'in_progress' | 'completed' | 'skipped';
  }) => {
    const result = await db
      .insert(workoutSessions)
      .values({
        userId: data.userId,
        workoutId: data.workoutId,
        name: data.name,
        scheduledDate: data.scheduledDate,
        status: data.status || 'planned',
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();

    return result[0];
  },

  START_SESSION: async (id: string) => {
    const result = await db
      .update(workoutSessions)
      .set({
        status: 'in_progress',
        startedAt: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(workoutSessions.id, id))
      .returning();

    return result[0];
  },

  COMPLETE_SESSION: async (id: string, durationMinutes?: number) => {
    const completedAt = new Date();
    const result = await db
      .update(workoutSessions)
      .set({
        status: 'completed',
        completedAt,
        durationMinutes,
        updatedAt: new Date(),
      })
      .where(eq(workoutSessions.id, id))
      .returning();

    return result[0];
  },

  SKIP_SESSION: async (id: string) => {
    const result = await db
      .update(workoutSessions)
      .set({
        status: 'skipped',
        updatedAt: new Date(),
      })
      .where(eq(workoutSessions.id, id))
      .returning();

    return result[0];
  },

  UPDATE: async (
    id: string,
    data: {
      name?: string;
      scheduledDate?: Date;
      status?: 'planned' | 'in_progress' | 'completed' | 'skipped';
    }
  ) => {
    const result = await db
      .update(workoutSessions)
      .set({
        ...data,
        updatedAt: new Date(),
      })
      .where(eq(workoutSessions.id, id))
      .returning();

    return result[0];
  },

  DELETE: async (id: string) => {
    await db.delete(workoutSessions).where(eq(workoutSessions.id, id));
  },
};

export const getWorkoutSessionsByUserId = WORKOUT_SESSIONS.GET_BY_USER_ID;
export const getWorkoutSessionById = WORKOUT_SESSIONS.GET_BY_ID;
export const getScheduledWorkoutSessions = WORKOUT_SESSIONS.GET_SCHEDULED_FOR_DATE_RANGE;
export const getUpcomingWorkoutSessions = WORKOUT_SESSIONS.GET_UPCOMING;
export const getRecentCompletedWorkoutSessions = WORKOUT_SESSIONS.GET_RECENT_COMPLETED;
export const getInProgressWorkoutSession = WORKOUT_SESSIONS.GET_IN_PROGRESS;
export const getWorkoutSessionStats = WORKOUT_SESSIONS.GET_STATS;
export const createWorkoutSession = WORKOUT_SESSIONS.CREATE;
export const startWorkoutSession = WORKOUT_SESSIONS.START_SESSION;
export const completeWorkoutSession = WORKOUT_SESSIONS.COMPLETE_SESSION;
export const skipWorkoutSession = WORKOUT_SESSIONS.SKIP_SESSION;
export const updateWorkoutSession = WORKOUT_SESSIONS.UPDATE;
export const deleteWorkoutSession = WORKOUT_SESSIONS.DELETE;
