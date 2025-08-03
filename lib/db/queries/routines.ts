import { db } from '../client';
import { routines, routineExercises } from '../schema/routines';
import { exercises } from '../schema/exercises';
import { eq, desc, asc } from 'drizzle-orm';
import { to } from '@/lib/utils';

export async function getRoutinesByUserId(userId: string) {
  return db.select().from(routines).where(eq(routines.userId, userId)).orderBy(desc(routines.updatedAt));
}

export async function getRoutineById(id: string) {
  const result = await db.select().from(routines).where(eq(routines.id, id)).limit(1);

  return result[0] || null;
}

export async function getRoutineWithExercises(routineId: string) {
  const routine = await getRoutineById(routineId);
  if (!routine) return null;

  const routineExercisesData = await db
    .select({
      id: routineExercises.id,
      order: routineExercises.order,
      sets: routineExercises.sets,
      reps: routineExercises.reps,
      weight: routineExercises.weight,
      exercise: {
        id: exercises.id,
        name: exercises.name,
        muscleGroups: exercises.muscleGroups,
      },
    })
    .from(routineExercises)
    .innerJoin(exercises, eq(routineExercises.exerciseId, exercises.id))
    .where(eq(routineExercises.routineId, routineId))
    .orderBy(asc(routineExercises.order));

  return {
    ...routine,
    exercises: routineExercisesData,
  };
}

export async function createRoutine(data: { userId: string; name: string; description?: string }) {
  const result = await db
    .insert(routines)
    .values({
      userId: data.userId,
      name: data.name,
      description: data.description,
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    .returning();

  return result[0];
}

export async function updateRoutine(
  id: string,
  data: {
    name?: string;
    description?: string;
    isTemplate?: boolean;
    color?: string;
    estimatedDuration?: number;
  }
) {
  const result = await db
    .update(routines)
    .set({
      ...data,
      updatedAt: new Date(),
    })
    .where(eq(routines.id, id))
    .returning();

  return result[0];
}

export async function deleteRoutine(id: string) {
  await db.delete(routines).where(eq(routines.id, id));
}

export async function addExerciseToRoutine(data: {
  routineId: string;
  exerciseId: string;
  order: number;
  sets: number;
  reps: number;
  repRangeMin: number;
  repRangeMax: number;
  weight: number;
  restTime: number;
  notes: string;
}) {
  const result = await db.insert(routineExercises).values(data).returning();

  return result[0];
}

export async function updateRoutineExercise(
  id: string,
  data: {
    order?: number;
    sets?: number;
    reps?: number;
    repRangeMin?: number;
    repRangeMax?: number;
    weight?: number;
    restTime?: number;
    notes?: string;
  }
) {
  const result = await db.update(routineExercises).set(data).where(eq(routineExercises.id, id)).returning();

  return result[0];
}

export async function removeExerciseFromRoutine(id: string) {
  await db.delete(routineExercises).where(eq(routineExercises.id, id));
}

export async function reorderRoutineExercises(routineId: string, exerciseOrders: { id: string; order: number }[]) {
  const updates = exerciseOrders.map(({ id, order }) =>
    db.update(routineExercises).set({ order }).where(eq(routineExercises.id, id))
  );

  await Promise.all(updates);
}

export async function getRoutineStats(routineId: string) {
  const [error, data] = await to(
    db
      .select({
        muscleGroups: exercises.muscleGroups,
        sets: routineExercises.sets,
      })
      .from(routineExercises)
      .innerJoin(exercises, eq(routineExercises.exerciseId, exercises.id))
      .where(eq(routineExercises.routineId, routineId))
  );

  if (error || !data) {
    return {
      muscleGroups: [],
      totalExercises: 0,
      totalSets: 0,
    };
  }

  const muscleGroups = new Set<string>();
  let totalSets = 0;

  data.forEach((exercise) => {
    if (exercise.muscleGroups && Array.isArray(exercise.muscleGroups)) {
      exercise.muscleGroups.forEach((group: string) => {
        if (group && typeof group === 'string') {
          muscleGroups.add(group);
        }
      });
    }
    totalSets += exercise.sets || 0;
  });

  return {
    muscleGroups: Array.from(muscleGroups).sort(),
    totalExercises: data.length,
    totalSets,
  };
}

export async function getRoutinesWithStatsByUserId(userId: string, limit?: number) {
  const routinesData = await db
    .select()
    .from(routines)
    .where(eq(routines.userId, userId))
    .orderBy(desc(routines.updatedAt))
    .limit(limit || 10);

  const routinesWithStats = await Promise.all(
    routinesData.map(async (routine) => {
      const stats = await getRoutineStats(routine.id);
      return {
        ...routine,
        stats,
      };
    })
  );

  return routinesWithStats;
}
