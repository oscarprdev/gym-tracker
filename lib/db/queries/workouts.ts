import { eq } from 'drizzle-orm';
import { db } from '../client';
import { workouts, workoutExercises, workoutExerciseSets } from '../schema/workouts';

export const WORKOUTS = {
  CREATE: async (data: {
    routineId: string;
    name: string;
    description?: string;
    dayOfWeek?: number;
    order: number;
    estimatedDuration?: number;
  }) => {
    const result = await db
      .insert(workouts)
      .values({
        ...data,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();

    return result[0];
  },

  ADD_EXERCISE: async (data: { workoutId: string; exerciseId: string; order: number }) => {
    const result = await db
      .insert(workoutExercises)
      .values({
        ...data,
        createdAt: new Date(),
      })
      .returning();

    return result[0];
  },

  ADD_SETS: async (
    workoutExerciseId: string,
    setsData: Array<{
      setNumber: number;
      reps?: number;
      weight: number;
    }>
  ) => {
    const setsToInsert = setsData.map((set) => ({
      workoutExerciseId,
      setNumber: set.setNumber,
      reps: set.reps ?? null,
      weight: set.weight,
      createdAt: new Date(),
    }));

    const result = await db.insert(workoutExerciseSets).values(setsToInsert).returning();

    return result;
  },
  DELETE: async (workoutId: string) => {
    await Promise.all([
      db.delete(workoutExercises).where(eq(workoutExercises.workoutId, workoutId)),
      db.delete(workoutExerciseSets).where(eq(workoutExerciseSets.workoutExerciseId, workoutId)),
      db.delete(workouts).where(eq(workouts.id, workoutId)),
    ]);
  },

  DELETE_BY_ROUTINE: async (routineId: string) => {
    const workoutIds = await db.query.workouts.findMany({
      where: eq(workouts.routineId, routineId),
      columns: { id: true },
    });

    for (const workout of workoutIds) {
      await WORKOUTS.DELETE(workout.id);
    }
  },
};

export const createWorkout = WORKOUTS.CREATE;
export const addExerciseToWorkout = WORKOUTS.ADD_EXERCISE;
export const addSetsToWorkoutExercise = WORKOUTS.ADD_SETS;
export const deleteWorkout = WORKOUTS.DELETE;
export const deleteWorkoutsByRoutine = WORKOUTS.DELETE_BY_ROUTINE;
