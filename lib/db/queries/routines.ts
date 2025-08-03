import { db } from '../client';
import { routines } from '../schema/routines';
import { workouts, workoutExercises, workoutExerciseSets } from '../schema/workouts';
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

export async function getRoutineWithWorkouts(routineId: string) {
  const routine = await getRoutineById(routineId);
  if (!routine) return null;

  const workoutsData = await db
    .select({
      id: workouts.id,
      name: workouts.name,
      description: workouts.description,
      dayOfWeek: workouts.dayOfWeek,
      order: workouts.order,
      estimatedDuration: workouts.estimatedDuration,
    })
    .from(workouts)
    .where(eq(workouts.routineId, routineId))
    .orderBy(asc(workouts.order));

  // Fetch exercises and sets for each workout
  const workoutsWithExercises = await Promise.all(
    workoutsData.map(async (workout) => {
      const workoutExercisesData = await db
        .select({
          id: workoutExercises.id,
          order: workoutExercises.order,
          notes: workoutExercises.notes,
          exercise: {
            id: exercises.id,
            name: exercises.name,
            muscleGroups: exercises.muscleGroups,
          },
        })
        .from(workoutExercises)
        .innerJoin(exercises, eq(workoutExercises.exerciseId, exercises.id))
        .where(eq(workoutExercises.workoutId, workout.id))
        .orderBy(asc(workoutExercises.order));

      // Fetch sets for each exercise
      const exercisesWithSets = await Promise.all(
        workoutExercisesData.map(async (workoutExercise) => {
          const sets = await db
            .select({
              id: workoutExerciseSets.id,
              setNumber: workoutExerciseSets.setNumber,
              reps: workoutExerciseSets.reps,
              weight: workoutExerciseSets.weight,
              restTime: workoutExerciseSets.restTime,
              isWarmup: workoutExerciseSets.isWarmup,
            })
            .from(workoutExerciseSets)
            .where(eq(workoutExerciseSets.workoutExerciseId, workoutExercise.id))
            .orderBy(asc(workoutExerciseSets.setNumber));

          return {
            ...workoutExercise,
            sets,
          };
        })
      );

      return {
        ...workout,
        exercises: exercisesWithSets,
      };
    })
  );

  return {
    ...routine,
    workouts: workoutsWithExercises,
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

export async function getRoutineStats(routineId: string) {
  const [error, data] = await to(
    db
      .select({
        muscleGroups: exercises.muscleGroups,
        setsCount: workoutExerciseSets.id,
      })
      .from(workouts)
      .innerJoin(workoutExercises, eq(workouts.id, workoutExercises.workoutId))
      .innerJoin(exercises, eq(workoutExercises.exerciseId, exercises.id))
      .leftJoin(workoutExerciseSets, eq(workoutExercises.id, workoutExerciseSets.workoutExerciseId))
      .where(eq(workouts.routineId, routineId))
  );

  if (error || !data) {
    return {
      muscleGroups: [],
      totalWorkouts: 0,
      totalExercises: 0,
      totalSets: 0,
    };
  }

  const muscleGroups = new Set<string>();
  let totalSets = 0;
  const uniqueWorkouts = new Set();
  const uniqueExercises = new Set();

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
  });

  return {
    muscleGroups: Array.from(muscleGroups).sort(),
    totalWorkouts: uniqueWorkouts.size,
    totalExercises: uniqueExercises.size,
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
