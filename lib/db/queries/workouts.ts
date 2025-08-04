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
};

export const createWorkout = WORKOUTS.CREATE;
export const addExerciseToWorkout = WORKOUTS.ADD_EXERCISE;
export const addSetsToWorkoutExercise = WORKOUTS.ADD_SETS;
