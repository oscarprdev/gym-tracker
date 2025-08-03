import { db } from '../client';
import { routines, routineExercises, routineExerciseSets } from '../schema/routines';
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
      notes: routineExercises.notes,
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

  // Fetch sets for each exercise
  const exercisesWithSets = await Promise.all(
    routineExercisesData.map(async (routineExercise) => {
      const sets = await db
        .select({
          id: routineExerciseSets.id,
          setNumber: routineExerciseSets.setNumber,
          reps: routineExerciseSets.reps,
          weight: routineExerciseSets.weight,
        })
        .from(routineExerciseSets)
        .where(eq(routineExerciseSets.routineExerciseId, routineExercise.id))
        .orderBy(asc(routineExerciseSets.setNumber));

      return {
        ...routineExercise,
        sets,
      };
    })
  );

  return {
    ...routine,
    exercises: exercisesWithSets,
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
  notes?: string;
}) {
  const result = await db.insert(routineExercises).values(data).returning();

  return result[0];
}

export async function addSetsToRoutineExercise(
  routineExerciseId: string,
  sets: Array<{ setNumber: number; reps?: number; weight: number }>
) {
  const setsData = sets.map((set) => ({
    routineExerciseId,
    setNumber: set.setNumber,
    reps: set.reps,
    weight: set.weight,
  }));

  const result = await db.insert(routineExerciseSets).values(setsData).returning();

  return result;
}

export async function updateRoutineExercise(
  id: string,
  data: {
    order?: number;
    notes?: string;
  }
) {
  const result = await db.update(routineExercises).set(data).where(eq(routineExercises.id, id)).returning();

  return result[0];
}

export async function updateRoutineExerciseSet(
  id: string,
  data: {
    reps?: number;
    weight?: number;
  }
) {
  const result = await db.update(routineExerciseSets).set(data).where(eq(routineExerciseSets.id, id)).returning();

  return result[0];
}

export async function removeExerciseFromRoutine(id: string) {
  await db.delete(routineExercises).where(eq(routineExercises.id, id));
}

export async function removeSetFromRoutineExercise(id: string) {
  await db.delete(routineExerciseSets).where(eq(routineExerciseSets.id, id));
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
        setsCount: routineExerciseSets.id,
      })
      .from(routineExercises)
      .innerJoin(exercises, eq(routineExercises.exerciseId, exercises.id))
      .leftJoin(routineExerciseSets, eq(routineExercises.id, routineExerciseSets.routineExerciseId))
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
    if (exercise.setsCount) {
      totalSets++;
    }
  });

  return {
    muscleGroups: Array.from(muscleGroups).sort(),
    totalExercises: new Set(data.map((ex) => ex.muscleGroups)).size,
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
