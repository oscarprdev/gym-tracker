import { db } from '../client';
import { routines } from '../schema/routines';
import { workouts, workoutExercises, workoutExerciseSets } from '../schema/workouts';
import { eq, desc, asc } from 'drizzle-orm';
import { to } from '@/lib/utils';

export const ROUTINES = {
  GET_BY_USER_ID: async (userId: string) => {
    return db.query.routines.findMany({
      where: eq(routines.userId, userId),
      orderBy: desc(routines.updatedAt),
    });
  },

  GET_BY_ID: async (id: string) => {
    return db.query.routines.findFirst({
      where: eq(routines.id, id),
    });
  },

  GET_WITH_WORKOUTS: async (routineId: string) => {
    const result = await db.query.routines.findFirst({
      where: eq(routines.id, routineId),
      with: {
        workouts: {
          orderBy: asc(workouts.order),
          with: {
            workoutExercises: {
              orderBy: asc(workoutExercises.order),
              with: {
                exercise: true,
                sets: {
                  orderBy: asc(workoutExerciseSets.setNumber),
                },
              },
            },
          },
        },
      },
    });

    if (!result) return null;

    const transformedWorkouts = result.workouts.map((workout) => ({
      id: workout.id,
      name: workout.name,
      dayOfWeek: workout.dayOfWeek,
      order: workout.order,
      exercises: workout.workoutExercises.map((workoutExercise) => ({
        id: workoutExercise.id,
        order: workoutExercise.order,
        exercise: {
          id: workoutExercise.exercise.id,
          name: workoutExercise.exercise.name,
          muscleGroups: workoutExercise.exercise.muscleGroups,
        },
        sets: workoutExercise.sets.map((set) => ({
          id: set.id,
          setNumber: set.setNumber,
          reps: set.reps,
          weight: set.weight,
        })),
      })),
    }));

    return {
      ...result,
      workouts: transformedWorkouts,
    };
  },

  CREATE: async (data: { userId: string; name: string }) => {
    const result = await db
      .insert(routines)
      .values({
        userId: data.userId,
        name: data.name,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();

    return result[0];
  },

  UPDATE: async (
    id: string,
    data: {
      name?: string;
      color?: string;
    }
  ) => {
    const result = await db
      .update(routines)
      .set({
        ...data,
        updatedAt: new Date(),
      })
      .where(eq(routines.id, id))
      .returning();

    return result[0];
  },

  DELETE: async (id: string) => {
    await db.delete(routines).where(eq(routines.id, id));
  },

  GET_STATS: async (routineId: string) => {
    const [error, data] = await to(
      db.query.routines.findFirst({
        where: eq(routines.id, routineId),
        with: {
          workouts: {
            with: {
              workoutExercises: {
                with: {
                  exercise: true,
                  sets: true,
                },
              },
            },
          },
        },
      })
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

    data.workouts.forEach((workout) => {
      uniqueWorkouts.add(workout.id);

      workout.workoutExercises.forEach((workoutExercise) => {
        uniqueExercises.add(workoutExercise.id);

        if (workoutExercise.exercise.muscleGroups && Array.isArray(workoutExercise.exercise.muscleGroups)) {
          workoutExercise.exercise.muscleGroups.forEach((group: string) => {
            if (group && typeof group === 'string') {
              muscleGroups.add(group);
            }
          });
        }

        totalSets += workoutExercise.sets.length;
      });
    });

    return {
      muscleGroups: Array.from(muscleGroups).sort(),
      totalWorkouts: uniqueWorkouts.size,
      totalExercises: uniqueExercises.size,
      totalSets,
    };
  },

  GET_WITH_STATS_BY_USER_ID: async (userId: string, limit?: number) => {
    const routinesData = await db.query.routines.findMany({
      where: eq(routines.userId, userId),
      orderBy: desc(routines.updatedAt),
      limit: limit || 10,
      with: {
        workouts: {
          with: {
            workoutExercises: {
              with: {
                exercise: true,
                sets: true,
              },
            },
          },
        },
      },
    });

    return routinesData.map((routine) => {
      const muscleGroups = new Set<string>();
      let totalSets = 0;
      const uniqueWorkouts = new Set();
      const uniqueExercises = new Set();

      routine.workouts.forEach((workout) => {
        uniqueWorkouts.add(workout.id);

        workout.workoutExercises.forEach((workoutExercise) => {
          uniqueExercises.add(workoutExercise.id);

          if (workoutExercise.exercise.muscleGroups && Array.isArray(workoutExercise.exercise.muscleGroups)) {
            workoutExercise.exercise.muscleGroups.forEach((group: string) => {
              if (group && typeof group === 'string') {
                muscleGroups.add(group);
              }
            });
          }

          totalSets += workoutExercise.sets.length;
        });
      });

      const stats = {
        muscleGroups: Array.from(muscleGroups).sort(),
        totalWorkouts: uniqueWorkouts.size,
        totalExercises: uniqueExercises.size,
        totalSets,
      };

      return {
        ...routine,
        stats,
      };
    });
  },
};

export const getRoutinesByUserId = ROUTINES.GET_BY_USER_ID;
export const getRoutineById = ROUTINES.GET_BY_ID;
export const getRoutineWithWorkouts = ROUTINES.GET_WITH_WORKOUTS;
export const createRoutine = ROUTINES.CREATE;
export const updateRoutine = ROUTINES.UPDATE;
export const deleteRoutine = ROUTINES.DELETE;
export const getRoutineStats = ROUTINES.GET_STATS;
export const getRoutinesWithStatsByUserId = ROUTINES.GET_WITH_STATS_BY_USER_ID;
