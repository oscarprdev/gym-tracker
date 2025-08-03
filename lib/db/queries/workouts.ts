import { db } from '../client';
import { workouts, workoutExercises, workoutExerciseSets } from '../schema/workouts';
import { exercises } from '../schema/exercises';
import { eq, asc, count } from 'drizzle-orm';
import { to } from '@/lib/utils';

// Workout Management
export async function getWorkoutById(id: string) {
  const result = await db.select().from(workouts).where(eq(workouts.id, id)).limit(1);
  return result[0] || null;
}

export async function getWorkoutsByRoutineId(routineId: string) {
  return db.select().from(workouts).where(eq(workouts.routineId, routineId)).orderBy(asc(workouts.order));
}

export async function getWorkoutWithExercises(workoutId: string) {
  const workout = await getWorkoutById(workoutId);
  if (!workout) return null;

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
    .where(eq(workoutExercises.workoutId, workoutId))
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
}

export async function createWorkout(data: {
  routineId: string;
  name: string;
  description?: string;
  dayOfWeek?: number;
  order: number;
  estimatedDuration?: number;
}) {
  const [error, workoutCount] = await to(
    db.select({ count: count() }).from(workouts).where(eq(workouts.routineId, data.routineId))
  );

  console.log('workoutCount', error);

  if (error || (workoutCount && workoutCount[0]?.count >= 7)) {
    throw new Error('Routine cannot have more than 7 workouts');
  }

  const result = await db
    .insert(workouts)
    .values({
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    .returning();

  return result[0];
}

export async function updateWorkout(
  id: string,
  data: {
    name?: string;
    description?: string;
    dayOfWeek?: number;
    order?: number;
    estimatedDuration?: number;
  }
) {
  const result = await db
    .update(workouts)
    .set({
      ...data,
      updatedAt: new Date(),
    })
    .where(eq(workouts.id, id))
    .returning();

  return result[0];
}

export async function deleteWorkout(id: string) {
  await db.delete(workouts).where(eq(workouts.id, id));
}

export async function reorderWorkouts(routineId: string, workoutOrders: { id: string; order: number }[]) {
  const updates = workoutOrders.map(({ id, order }) => db.update(workouts).set({ order }).where(eq(workouts.id, id)));

  await Promise.all(updates);
}

// Workout Exercise Management
export async function addExerciseToWorkout(data: {
  workoutId: string;
  exerciseId: string;
  order: number;
  notes?: string;
}) {
  const result = await db.insert(workoutExercises).values(data).returning();
  return result[0];
}

export async function updateWorkoutExercise(
  id: string,
  data: {
    order?: number;
    notes?: string;
  }
) {
  const result = await db.update(workoutExercises).set(data).where(eq(workoutExercises.id, id)).returning();
  return result[0];
}

export async function removeExerciseFromWorkout(id: string) {
  await db.delete(workoutExercises).where(eq(workoutExercises.id, id));
}

export async function reorderWorkoutExercises(workoutId: string, exerciseOrders: { id: string; order: number }[]) {
  const updates = exerciseOrders.map(({ id, order }) =>
    db.update(workoutExercises).set({ order }).where(eq(workoutExercises.id, id))
  );

  await Promise.all(updates);
}

// Workout Exercise Set Management
export async function addSetsToWorkoutExercise(
  workoutExerciseId: string,
  sets: Array<{
    setNumber: number;
    reps?: number;
    weight: number;
    restTime?: number;
    isWarmup?: boolean;
  }>
) {
  const setsData = sets.map((set) => ({
    workoutExerciseId,
    setNumber: set.setNumber,
    reps: set.reps,
    weight: set.weight,
    restTime: set.restTime,
    isWarmup: set.isWarmup || false,
  }));

  const result = await db.insert(workoutExerciseSets).values(setsData).returning();
  return result;
}

export async function updateWorkoutExerciseSet(
  id: string,
  data: {
    reps?: number;
    weight?: number;
    restTime?: number;
    isWarmup?: boolean;
  }
) {
  const result = await db.update(workoutExerciseSets).set(data).where(eq(workoutExerciseSets.id, id)).returning();
  return result[0];
}

export async function removeSetFromWorkoutExercise(id: string) {
  await db.delete(workoutExerciseSets).where(eq(workoutExerciseSets.id, id));
}

// Workout Statistics
export async function getWorkoutStats(workoutId: string) {
  const [error, data] = await to(
    db
      .select({
        muscleGroups: exercises.muscleGroups,
        setsCount: workoutExerciseSets.id,
      })
      .from(workoutExercises)
      .innerJoin(exercises, eq(workoutExercises.exerciseId, exercises.id))
      .leftJoin(workoutExerciseSets, eq(workoutExercises.id, workoutExerciseSets.workoutExerciseId))
      .where(eq(workoutExercises.workoutId, workoutId))
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
    totalExercises: new Set(data.map((item) => item.muscleGroups)).size,
    totalSets,
  };
}

// Get workouts with statistics
export async function getWorkoutsWithStatsByRoutineId(routineId: string) {
  const workoutsData = await getWorkoutsByRoutineId(routineId);

  const workoutsWithStats = await Promise.all(
    workoutsData.map(async (workout) => {
      const stats = await getWorkoutStats(workout.id);
      return {
        ...workout,
        stats,
      };
    })
  );

  return workoutsWithStats;
}
