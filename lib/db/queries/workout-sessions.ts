import { db } from '../client';
import { workoutSessions, exerciseLogs, setLogs } from '../schema/workout-sessions';
import { exercises } from '../schema/exercises';
import { eq, desc, asc, and } from 'drizzle-orm';
import { to } from '@/lib/utils';

// Workout Session Management
export async function getWorkoutSessionById(id: string) {
  const result = await db.select().from(workoutSessions).where(eq(workoutSessions.id, id)).limit(1);
  return result[0] || null;
}

export async function getWorkoutSessionsByUserId(userId: string, limit?: number) {
  return db
    .select()
    .from(workoutSessions)
    .where(eq(workoutSessions.userId, userId))
    .orderBy(desc(workoutSessions.createdAt))
    .limit(limit || 50);
}

export async function getWorkoutSessionsByWorkoutId(workoutId: string, limit?: number) {
  return db
    .select()
    .from(workoutSessions)
    .where(eq(workoutSessions.workoutId, workoutId))
    .orderBy(desc(workoutSessions.createdAt))
    .limit(limit || 20);
}

export async function getWorkoutSessionWithDetails(sessionId: string) {
  const session = await getWorkoutSessionById(sessionId);
  if (!session) return null;

  const exerciseLogsData = await db
    .select({
      id: exerciseLogs.id,
      order: exerciseLogs.order,
      notes: exerciseLogs.notes,
      exercise: {
        id: exercises.id,
        name: exercises.name,
        muscleGroups: exercises.muscleGroups,
      },
    })
    .from(exerciseLogs)
    .innerJoin(exercises, eq(exerciseLogs.exerciseId, exercises.id))
    .where(eq(exerciseLogs.sessionId, sessionId))
    .orderBy(asc(exerciseLogs.order));

  // Fetch sets for each exercise
  const exercisesWithSets = await Promise.all(
    exerciseLogsData.map(async (exerciseLog) => {
      const sets = await db
        .select({
          id: setLogs.id,
          setNumber: setLogs.setNumber,
          reps: setLogs.reps,
          weight: setLogs.weight,
          isCompleted: setLogs.isCompleted,
          isWarmup: setLogs.isWarmup,
          restTime: setLogs.restTime,
          rpe: setLogs.rpe,
          notes: setLogs.notes,
        })
        .from(setLogs)
        .where(eq(setLogs.exerciseLogId, exerciseLog.id))
        .orderBy(asc(setLogs.setNumber));

      return {
        ...exerciseLog,
        sets,
      };
    })
  );

  return {
    ...session,
    exercises: exercisesWithSets,
  };
}

export async function createWorkoutSession(data: {
  userId: string;
  workoutId?: string;
  name: string;
  status?: 'planned' | 'in_progress' | 'completed' | 'skipped';
}) {
  const result = await db
    .insert(workoutSessions)
    .values({
      ...data,
      status: data.status || 'planned',
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    .returning();

  return result[0];
}

export async function updateWorkoutSession(
  id: string,
  data: {
    name?: string;
    status?: 'planned' | 'in_progress' | 'completed' | 'skipped';
    startedAt?: Date;
    completedAt?: Date;
    duration?: number;
    notes?: string;
  }
) {
  const result = await db
    .update(workoutSessions)
    .set({
      ...data,
      updatedAt: new Date(),
    })
    .where(eq(workoutSessions.id, id))
    .returning();

  return result[0];
}

export async function deleteWorkoutSession(id: string) {
  await db.delete(workoutSessions).where(eq(workoutSessions.id, id));
}

// Exercise Log Management
export async function addExerciseToSession(data: {
  sessionId: string;
  exerciseId: string;
  order: number;
  notes?: string;
}) {
  const result = await db.insert(exerciseLogs).values(data).returning();
  return result[0];
}

export async function updateExerciseLog(
  id: string,
  data: {
    order?: number;
    notes?: string;
  }
) {
  const result = await db.update(exerciseLogs).set(data).where(eq(exerciseLogs.id, id)).returning();
  return result[0];
}

export async function removeExerciseFromSession(id: string) {
  await db.delete(exerciseLogs).where(eq(exerciseLogs.id, id));
}

// Set Log Management
export async function addSetToExerciseLog(data: {
  exerciseLogId: string;
  setNumber: number;
  reps?: number;
  weight?: number;
  isCompleted?: boolean;
  isWarmup?: boolean;
  restTime?: number;
  rpe?: number;
  notes?: string;
}) {
  const result = await db.insert(setLogs).values(data).returning();
  return result[0];
}

export async function updateSetLog(
  id: string,
  data: {
    reps?: number;
    weight?: number;
    isCompleted?: boolean;
    isWarmup?: boolean;
    restTime?: number;
    rpe?: number;
    notes?: string;
  }
) {
  const result = await db.update(setLogs).set(data).where(eq(setLogs.id, id)).returning();
  return result[0];
}

export async function removeSetFromExerciseLog(id: string) {
  await db.delete(setLogs).where(eq(setLogs.id, id));
}

// Statistics and Analytics
export async function getWorkoutSessionStats(sessionId: string) {
  const [error, data] = await to(
    db
      .select({
        muscleGroups: exercises.muscleGroups,
        setsCount: setLogs.id,
        completedSets: setLogs.isCompleted,
      })
      .from(exerciseLogs)
      .innerJoin(exercises, eq(exerciseLogs.exerciseId, exercises.id))
      .leftJoin(setLogs, eq(exerciseLogs.id, setLogs.exerciseLogId))
      .where(eq(exerciseLogs.sessionId, sessionId))
  );

  if (error || !data) {
    return {
      muscleGroups: [],
      totalExercises: 0,
      totalSets: 0,
      completedSets: 0,
      completionRate: 0,
    };
  }

  const muscleGroups = new Set<string>();
  let totalSets = 0;
  let completedSets = 0;

  data.forEach((item) => {
    if (item.muscleGroups && Array.isArray(item.muscleGroups)) {
      item.muscleGroups.forEach((group: string) => {
        if (group && typeof group === 'string') {
          muscleGroups.add(group);
        }
      });
    }
    if (item.setsCount) {
      totalSets++;
    }
    if (item.completedSets) {
      completedSets++;
    }
  });

  return {
    muscleGroups: Array.from(muscleGroups).sort(),
    totalExercises: new Set(data.map((item) => item.muscleGroups)).size,
    totalSets,
    completedSets,
    completionRate: totalSets > 0 ? (completedSets / totalSets) * 100 : 0,
  };
}

// Get workout sessions with statistics
export async function getWorkoutSessionsWithStatsByUserId(userId: string, limit?: number) {
  const sessionsData = await getWorkoutSessionsByUserId(userId, limit);

  const sessionsWithStats = await Promise.all(
    sessionsData.map(async (session) => {
      const stats = await getWorkoutSessionStats(session.id);
      return {
        ...session,
        stats,
      };
    })
  );

  return sessionsWithStats;
}

// Get workout history for a specific workout
export async function getWorkoutHistory(workoutId: string, limit?: number) {
  const sessions = await getWorkoutSessionsByWorkoutId(workoutId, limit);

  const sessionsWithStats = await Promise.all(
    sessions.map(async (session) => {
      const stats = await getWorkoutSessionStats(session.id);
      return {
        ...session,
        stats,
      };
    })
  );

  return sessionsWithStats;
}

// Get last weight used for an exercise
export async function getLastWeightForExercise(userId: string, exerciseId: string) {
  const [error, result] = await to(
    db
      .select({
        weight: setLogs.weight,
        completedAt: workoutSessions.completedAt,
      })
      .from(setLogs)
      .innerJoin(exerciseLogs, eq(setLogs.exerciseLogId, exerciseLogs.id))
      .innerJoin(workoutSessions, eq(exerciseLogs.sessionId, workoutSessions.id))
      .innerJoin(exercises, eq(exerciseLogs.exerciseId, exercises.id))
      .where(and(eq(workoutSessions.userId, userId), eq(exercises.id, exerciseId)))
      .orderBy(desc(workoutSessions.completedAt))
      .limit(1)
  );

  if (error || !result || result.length === 0) {
    return null;
  }

  return result[0];
}
