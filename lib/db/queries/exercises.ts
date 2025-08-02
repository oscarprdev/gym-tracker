import { db } from '../client';
import { exercises } from '../schema/exercises';
import { eq, and, like, or, asc, sql } from 'drizzle-orm';
import type { Exercise, NewExercise } from '../schema/exercises';
import type { SearchExercisesInput } from '@/lib/validations/exercises';

export async function createExercise(data: NewExercise): Promise<Exercise> {
  const [exercise] = await db.insert(exercises).values(data).returning();

  if (!exercise) {
    throw new Error('Failed to create exercise');
  }

  return exercise;
}

export async function getExerciseById(id: string): Promise<Exercise | null> {
  const result = await db.select().from(exercises).where(eq(exercises.id, id)).limit(1);

  return result[0] || null;
}

export async function getAllExercises(): Promise<Exercise[]> {
  return db.select().from(exercises).orderBy(asc(exercises.name));
}

export async function getUserCustomExercises(userId: string): Promise<Exercise[]> {
  return db
    .select()
    .from(exercises)
    .where(and(eq(exercises.isCustom, true), eq(exercises.createdBy, userId)))
    .orderBy(asc(exercises.name));
}

export async function getBuiltInExercises(): Promise<Exercise[]> {
  return db.select().from(exercises).where(eq(exercises.isCustom, false)).orderBy(asc(exercises.name));
}

export async function searchExercises(params: SearchExercisesInput): Promise<Exercise[]> {
  const { query, muscleGroups, equipment, isCustom, limit, offset } = params;

  const conditions = [];

  if (query) {
    conditions.push(or(like(exercises.name, `%${query}%`), like(exercises.description, `%${query}%`)));
  }

  if (muscleGroups && muscleGroups.length > 0) {
    // PostgreSQL array overlap operator
    conditions.push(sql`${exercises.muscleGroups} && ${muscleGroups}`);
  }

  if (equipment) {
    conditions.push(eq(exercises.equipment, equipment));
  }

  if (typeof isCustom === 'boolean') {
    conditions.push(eq(exercises.isCustom, isCustom));
  }

  return db
    .select()
    .from(exercises)
    .where(conditions.length > 0 ? and(...conditions) : undefined)
    .orderBy(asc(exercises.name))
    .limit(limit)
    .offset(offset);
}

export async function updateExercise(id: string, userId: string, data: Partial<NewExercise>): Promise<Exercise> {
  const [exercise] = await db
    .update(exercises)
    .set({
      ...data,
      updatedAt: new Date(),
    })
    .where(and(eq(exercises.id, id), eq(exercises.createdBy, userId)))
    .returning();

  if (!exercise) {
    throw new Error('Exercise not found or unauthorized');
  }

  return exercise;
}

export async function deleteExercise(id: string, userId: string): Promise<void> {
  const result = await db
    .delete(exercises)
    .where(and(eq(exercises.id, id), eq(exercises.createdBy, userId)))
    .returning({ id: exercises.id });

  if (result.length === 0) {
    throw new Error('Exercise not found or unauthorized');
  }
}

export async function getExercisesByMuscleGroup(muscleGroup: string): Promise<Exercise[]> {
  return db
    .select()
    .from(exercises)
    .where(sql`${exercises.muscleGroups} @> ARRAY[${muscleGroup}]`)
    .orderBy(asc(exercises.name));
}

export async function getExercisesByEquipment(equipment: string): Promise<Exercise[]> {
  return db.select().from(exercises).where(eq(exercises.equipment, equipment)).orderBy(asc(exercises.name));
}
