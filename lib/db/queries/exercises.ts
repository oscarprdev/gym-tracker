import { db } from '../client';
import { exercises } from '../schema/exercises';
import { eq, and, arrayOverlaps } from 'drizzle-orm';
import type { Exercise, NewExercise } from '../schema/exercises';

export const EXERCISES = {
  CREATE: async (data: NewExercise): Promise<Exercise> => {
    const [exercise] = await db.insert(exercises).values(data).returning();
    if (!exercise) throw new Error('Failed to create exercise');
    return exercise;
  },

  GET_BY_ID: async (id: string): Promise<Exercise | null> => {
    const result = await db.query.exercises.findFirst({
      where: eq(exercises.id, id),
      with: {
        workoutExercises: true,
        createdBy: true,
      },
    });

    return result ?? null;
  },

  GET_BY_USER: async (userId: string): Promise<Exercise[]> => {
    const result = await db.query.exercises.findMany({
      where: eq(exercises.createdBy, userId),
      with: {
        workoutExercises: true,
        createdBy: true,
      },
      orderBy: (exercises, { desc }) => [desc(exercises.createdAt)],
    });

    return result;
  },

  UPDATE: async (id: string, userId: string, data: Partial<NewExercise>): Promise<Exercise> => {
    const [exercise] = await db
      .update(exercises)
      .set({
        ...data,
        updatedAt: new Date(),
      })
      .where(and(eq(exercises.id, id), eq(exercises.createdBy, userId)))
      .returning();
    if (!exercise) throw new Error('Exercise not found or unauthorized');
    return exercise;
  },

  DELETE: async (id: string, userId: string): Promise<void> => {
    const result = await db
      .delete(exercises)
      .where(and(eq(exercises.id, id), eq(exercises.createdBy, userId)))
      .returning({ id: exercises.id });
    if (result.length === 0) throw new Error('Exercise not found or unauthorized');
  },

  GET_BY_USER_AND_MUSCLE_GROUPS: async (userId: string, muscleGroups: string[]): Promise<Exercise[]> => {
    if (muscleGroups.length === 0) {
      return [];
    }

    const result = await db.query.exercises.findMany({
      where: and(eq(exercises.createdBy, userId), arrayOverlaps(exercises.muscleGroups, muscleGroups)),
      orderBy: (exercises, { desc }) => [desc(exercises.createdAt)],
      limit: 10,
    });

    return result;
  },
};

export const createExercise = EXERCISES.CREATE;
export const getExerciseById = EXERCISES.GET_BY_ID;
export const getExercisesByUser = EXERCISES.GET_BY_USER;
export const getExercisesByUserAndMuscleGroups = EXERCISES.GET_BY_USER_AND_MUSCLE_GROUPS;
export const updateExercise = EXERCISES.UPDATE;
export const deleteExercise = EXERCISES.DELETE;
