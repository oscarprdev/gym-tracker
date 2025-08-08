'use server';

import { eq, and, desc } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { db } from '@/lib/db/client';
import { routines, workouts, workoutExercises, users } from '@/lib/db/schema';
import { protectedAction, to, toSync } from '@/features/shared/utils/error-handler';
import { Nullable } from '@/features/shared';
import {
  parseCreateRoutine,
  parseUpdateRoutine,
  parseSetActiveRoutine,
  parseCreateWorkout,
  parseUpdateWorkout,
  parseDeleteWorkout,
  parseReorderWorkouts,
  parseAddExerciseToWorkout,
  parseUpdateWorkoutExercise,
  parseRemoveExerciseFromWorkout,
  parseReorderWorkoutExercises,
  CreateRoutineFormValues,
  UpdateRoutineData,
  SetActiveRoutineData,
  CreateWorkoutData,
  UpdateWorkoutData,
  DeleteWorkoutData,
  ReorderWorkoutsData,
  AddExerciseToWorkoutData,
  UpdateWorkoutExerciseData,
  RemoveExerciseFromWorkoutData,
  ReorderWorkoutExercisesData,
} from '@/features/routines/validations';

interface ActionResponse {
  error: Nullable<string>;
}

interface ActionResponseWithData<T> extends ActionResponse {
  data: Nullable<T>;
}

// ===== ROUTINE ACTIONS =====

export const createRoutineAction = protectedAction(
  async (session, input: CreateRoutineFormValues): Promise<ActionResponseWithData<{ id: string }>> => {
    const [validationError, validatedData] = toSync(() => parseCreateRoutine(input));

    if (validationError || !validatedData) {
      return { error: validationError?.message || 'Invalid data', data: null };
    }

    const [dbError, result] = await to(
      db
        .insert(routines)
        .values({
          id: crypto.randomUUID(),
          userId: session.userId,
          name: validatedData.name,
          createdAt: new Date(),
          updatedAt: new Date(),
        })
        .returning({ id: routines.id })
    );

    if (dbError || !result?.[0]) {
      return { error: 'Failed to create routine', data: null };
    }

    revalidatePath('/');
    return { error: null, data: { id: result[0].id } };
  }
);

export const updateRoutineAction = protectedAction(
  async (session, input: UpdateRoutineData): Promise<ActionResponse> => {
    const [validationError, validatedData] = toSync(() => parseUpdateRoutine(input));

    if (validationError || !validatedData) {
      return { error: validationError?.message || 'Invalid data' };
    }

    const [checkError, existing] = await to(
      db
        .select({ id: routines.id })
        .from(routines)
        .where(and(eq(routines.id, validatedData.id), eq(routines.userId, session.userId)))
        .limit(1)
    );

    if (checkError || !existing?.[0]) {
      return { error: 'Routine not found or access denied' };
    }

    const [dbError] = await to(
      db
        .update(routines)
        .set({
          name: validatedData.name,
          updatedAt: new Date(),
        })
        .where(eq(routines.id, validatedData.id))
    );

    if (dbError) {
      return { error: 'Failed to update routine' };
    }

    revalidatePath('/');
    return { error: null };
  }
);

export const getUserRoutinesAction = protectedAction(
  async (
    session
  ): Promise<ActionResponseWithData<Array<{ id: string; name: string; createdAt: Date; updatedAt: Date }>>> => {
    const [dbError, result] = await to(
      db
        .select({
          id: routines.id,
          name: routines.name,
          createdAt: routines.createdAt,
          updatedAt: routines.updatedAt,
        })
        .from(routines)
        .where(eq(routines.userId, session.userId))
        .orderBy(desc(routines.createdAt))
    );

    if (dbError) {
      return { error: 'Failed to fetch routines', data: null };
    }

    return { error: null, data: result || [] };
  }
);

/**
 * Set or clear the active routine for the authenticated user
 */
export const setActiveRoutineAction = protectedAction(
  async (session, input: SetActiveRoutineData): Promise<ActionResponse> => {
    const [validationError, validatedData] = toSync(() => parseSetActiveRoutine(input));

    if (validationError || !validatedData) {
      return { error: validationError?.message || 'Invalid data' };
    }

    // If setting a routine, verify ownership
    if (validatedData.routineId) {
      const [checkError, existing] = await to(
        db
          .select({ id: routines.id })
          .from(routines)
          .where(and(eq(routines.id, validatedData.routineId), eq(routines.userId, session.userId)))
          .limit(1)
      );

      if (checkError || !existing?.[0]) {
        return { error: 'Routine not found or access denied' };
      }
    }

    const [dbError] = await to(
      db.update(users).set({ activeRoutineId: validatedData.routineId }).where(eq(users.id, session.userId))
    );

    if (dbError) {
      return { error: 'Failed to set active routine' };
    }

    revalidatePath('/');
    return { error: null };
  }
);

// ===== WORKOUT ACTIONS =====

/**
 * Create a new workout within a routine
 */
export const createWorkoutAction = protectedAction(
  async (session, input: CreateWorkoutData): Promise<ActionResponseWithData<{ id: string }>> => {
    const [validationError, validatedData] = toSync(() => parseCreateWorkout(input));

    if (validationError || !validatedData) {
      return { error: validationError?.message || 'Invalid data', data: null };
    }

    // Verify routine ownership
    const [checkError, existing] = await to(
      db
        .select({ id: routines.id })
        .from(routines)
        .where(and(eq(routines.id, validatedData.routineId), eq(routines.userId, session.userId)))
        .limit(1)
    );

    if (checkError || !existing?.[0]) {
      return { error: 'Routine not found or access denied', data: null };
    }

    // Get next order number
    const [, maxOrderResult] = await to(
      db
        .select({ maxOrder: workouts.order })
        .from(workouts)
        .where(eq(workouts.routineId, validatedData.routineId))
        .orderBy(desc(workouts.order))
        .limit(1)
    );

    const nextOrder = (maxOrderResult?.[0]?.maxOrder || 0) + 1;

    const [dbError, result] = await to(
      db
        .insert(workouts)
        .values({
          id: crypto.randomUUID(),
          routineId: validatedData.routineId,
          name: validatedData.name,
          dayOfWeek: validatedData.dayOfWeek || null,
          order: nextOrder,
          createdAt: new Date(),
          updatedAt: new Date(),
        })
        .returning({ id: workouts.id })
    );

    if (dbError || !result?.[0]) {
      return { error: 'Failed to create workout', data: null };
    }

    revalidatePath('/');
    return { error: null, data: { id: result[0].id } };
  }
);

/**
 * Update an existing workout
 */
export const updateWorkoutAction = protectedAction(
  async (session, input: UpdateWorkoutData): Promise<ActionResponse> => {
    const [validationError, validatedData] = toSync(() => parseUpdateWorkout(input));

    if (validationError || !validatedData) {
      return { error: validationError?.message || 'Invalid data' };
    }

    // Verify workout ownership through routine
    const [checkError, existing] = await to(
      db
        .select({ id: workouts.id })
        .from(workouts)
        .innerJoin(routines, eq(workouts.routineId, routines.id))
        .where(and(eq(workouts.id, validatedData.id), eq(routines.userId, session.userId)))
        .limit(1)
    );

    if (checkError || !existing?.[0]) {
      return { error: 'Workout not found or access denied' };
    }

    const updateData: Partial<typeof workouts.$inferInsert> = {
      updatedAt: new Date(),
    };

    if (validatedData.name !== undefined) {
      updateData.name = validatedData.name;
    }
    if (validatedData.dayOfWeek !== undefined) {
      updateData.dayOfWeek = validatedData.dayOfWeek;
    }

    const [dbError] = await to(db.update(workouts).set(updateData).where(eq(workouts.id, validatedData.id)));

    if (dbError) {
      return { error: 'Failed to update workout' };
    }

    revalidatePath('/');
    return { error: null };
  }
);

/**
 * Delete a workout and all associated exercises
 */
export const deleteWorkoutAction = protectedAction(
  async (session, input: DeleteWorkoutData): Promise<ActionResponse> => {
    const [validationError, validatedData] = toSync(() => parseDeleteWorkout(input));

    if (validationError || !validatedData) {
      return { error: validationError?.message || 'Invalid data' };
    }

    // Verify workout ownership through routine
    const [checkError, existing] = await to(
      db
        .select({ id: workouts.id, routineId: workouts.routineId })
        .from(workouts)
        .innerJoin(routines, eq(workouts.routineId, routines.id))
        .where(and(eq(workouts.id, validatedData.id), eq(routines.userId, session.userId)))
        .limit(1)
    );

    if (checkError || !existing?.[0]) {
      return { error: 'Workout not found or access denied' };
    }

    // Delete workout (cascade will handle workout exercises)
    const [dbError] = await to(db.delete(workouts).where(eq(workouts.id, validatedData.id)));

    if (dbError) {
      return { error: 'Failed to delete workout' };
    }

    revalidatePath('/');
    return { error: null };
  }
);

/**
 * Reorder workouts within a routine
 */
export const reorderWorkoutsAction = protectedAction(
  async (session, input: ReorderWorkoutsData): Promise<ActionResponse> => {
    const [validationError, validatedData] = toSync(() => parseReorderWorkouts(input));

    if (validationError || !validatedData) {
      return { error: validationError?.message || 'Invalid data' };
    }

    // Verify routine ownership
    const [checkError, existing] = await to(
      db
        .select({ id: routines.id })
        .from(routines)
        .where(and(eq(routines.id, validatedData.routineId), eq(routines.userId, session.userId)))
        .limit(1)
    );

    if (checkError || !existing?.[0]) {
      return { error: 'Routine not found or access denied' };
    }

    // Update order for each workout
    const updatePromises = validatedData.workoutIds.map((workoutId, index) =>
      db
        .update(workouts)
        .set({ order: index + 1, updatedAt: new Date() })
        .where(and(eq(workouts.id, workoutId), eq(workouts.routineId, validatedData.routineId)))
    );

    const [dbError] = await to(Promise.all(updatePromises));

    if (dbError) {
      return { error: 'Failed to reorder workouts' };
    }

    revalidatePath('/');
    return { error: null };
  }
);

// ===== WORKOUT EXERCISE ACTIONS =====

/**
 * Add an exercise to a workout
 */
export const addExerciseToWorkoutAction = protectedAction(
  async (session, input: AddExerciseToWorkoutData): Promise<ActionResponseWithData<{ id: string }>> => {
    const [validationError, validatedData] = toSync(() => parseAddExerciseToWorkout(input));

    if (validationError || !validatedData) {
      return { error: validationError?.message || 'Invalid data', data: null };
    }

    // Verify workout ownership through routine
    const [checkError, existing] = await to(
      db
        .select({ id: workouts.id })
        .from(workouts)
        .innerJoin(routines, eq(workouts.routineId, routines.id))
        .where(and(eq(workouts.id, validatedData.workoutId), eq(routines.userId, session.userId)))
        .limit(1)
    );

    if (checkError || !existing?.[0]) {
      return { error: 'Workout not found or access denied', data: null };
    }

    // Get next order number within the workout
    const [, maxOrderResult] = await to(
      db
        .select({ maxOrder: workoutExercises.order })
        .from(workoutExercises)
        .where(eq(workoutExercises.workoutId, validatedData.workoutId))
        .orderBy(desc(workoutExercises.order))
        .limit(1)
    );

    const nextOrder = (maxOrderResult?.[0]?.maxOrder || 0) + 1;

    const [dbError, result] = await to(
      db
        .insert(workoutExercises)
        .values({
          id: crypto.randomUUID(),
          workoutId: validatedData.workoutId,
          exerciseId: validatedData.exerciseId,
          setNumber: validatedData.setNumber,
          reps: validatedData.reps || null,
          weight: validatedData.weight,
          order: nextOrder,
          createdAt: new Date(),
        })
        .returning({ id: workoutExercises.id })
    );

    if (dbError || !result?.[0]) {
      return { error: 'Failed to add exercise to workout', data: null };
    }

    revalidatePath('/');
    return { error: null, data: { id: result[0].id } };
  }
);

/**
 * Update a workout exercise
 */
export const updateWorkoutExerciseAction = protectedAction(
  async (session, input: UpdateWorkoutExerciseData): Promise<ActionResponse> => {
    const [validationError, validatedData] = toSync(() => parseUpdateWorkoutExercise(input));

    if (validationError || !validatedData) {
      return { error: validationError?.message || 'Invalid data' };
    }

    // Verify workout exercise ownership through routine
    const [checkError, existing] = await to(
      db
        .select({ id: workoutExercises.id })
        .from(workoutExercises)
        .innerJoin(workouts, eq(workoutExercises.workoutId, workouts.id))
        .innerJoin(routines, eq(workouts.routineId, routines.id))
        .where(and(eq(workoutExercises.id, validatedData.id), eq(routines.userId, session.userId)))
        .limit(1)
    );

    if (checkError || !existing?.[0]) {
      return { error: 'Exercise not found or access denied' };
    }

    const updateData: Partial<typeof workoutExercises.$inferInsert> = {};

    if (validatedData.setNumber !== undefined) {
      updateData.setNumber = validatedData.setNumber;
    }
    if (validatedData.reps !== undefined) {
      updateData.reps = validatedData.reps;
    }
    if (validatedData.weight !== undefined) {
      updateData.weight = validatedData.weight;
    }

    const [dbError] = await to(
      db.update(workoutExercises).set(updateData).where(eq(workoutExercises.id, validatedData.id))
    );

    if (dbError) {
      return { error: 'Failed to update exercise' };
    }

    revalidatePath('/');
    return { error: null };
  }
);

/**
 * Remove an exercise from a workout
 */
export const removeExerciseFromWorkoutAction = protectedAction(
  async (session, input: RemoveExerciseFromWorkoutData): Promise<ActionResponse> => {
    const [validationError, validatedData] = toSync(() => parseRemoveExerciseFromWorkout(input));

    if (validationError || !validatedData) {
      return { error: validationError?.message || 'Invalid data' };
    }

    // Verify workout exercise ownership through routine
    const [checkError, existing] = await to(
      db
        .select({ id: workoutExercises.id, workoutId: workoutExercises.workoutId })
        .from(workoutExercises)
        .innerJoin(workouts, eq(workoutExercises.workoutId, workouts.id))
        .innerJoin(routines, eq(workouts.routineId, routines.id))
        .where(and(eq(workoutExercises.id, validatedData.id), eq(routines.userId, session.userId)))
        .limit(1)
    );

    if (checkError || !existing?.[0]) {
      return { error: 'Exercise not found or access denied' };
    }

    // Delete the workout exercise
    const [dbError] = await to(db.delete(workoutExercises).where(eq(workoutExercises.id, validatedData.id)));

    if (dbError) {
      return { error: 'Failed to remove exercise from workout' };
    }

    revalidatePath('/');
    return { error: null };
  }
);

/**
 * Reorder exercises within a workout
 */
export const reorderWorkoutExercisesAction = protectedAction(
  async (session, input: ReorderWorkoutExercisesData): Promise<ActionResponse> => {
    const [validationError, validatedData] = toSync(() => parseReorderWorkoutExercises(input));

    if (validationError || !validatedData) {
      return { error: validationError?.message || 'Invalid data' };
    }

    // Verify workout ownership through routine
    const [checkError, existing] = await to(
      db
        .select({ id: workouts.id })
        .from(workouts)
        .innerJoin(routines, eq(workouts.routineId, routines.id))
        .where(and(eq(workouts.id, validatedData.workoutId), eq(routines.userId, session.userId)))
        .limit(1)
    );

    if (checkError || !existing?.[0]) {
      return { error: 'Workout not found or access denied' };
    }

    // Update order for each exercise
    const updatePromises = validatedData.exerciseIds.map((exerciseId, index) =>
      db
        .update(workoutExercises)
        .set({ order: index + 1 })
        .where(and(eq(workoutExercises.id, exerciseId), eq(workoutExercises.workoutId, validatedData.workoutId)))
    );

    const [dbError] = await to(Promise.all(updatePromises));

    if (dbError) {
      return { error: 'Failed to reorder exercises' };
    }

    revalidatePath('/');
    return { error: null };
  }
);
