import { create } from 'zustand';
import { WorkoutRecord } from '../db/queries/workouts';

export type WorkoutToAdd = Pick<WorkoutRecord, 'id' | 'name' | 'muscleGroups'>;

interface RoutinesState {
  workoutToAdd: WorkoutToAdd[];
  addWorkout: (workout: WorkoutToAdd) => void;
  removeWorkout: (workoutId: string) => void;
  clearWorkoutToAdd: () => void;
}

const useRoutinesStore = create<RoutinesState>()((set) => ({
  workoutToAdd: [],
  addWorkout: (workout) => set((state) => ({ workoutToAdd: [...state.workoutToAdd, workout] })),
  removeWorkout: (workoutId) =>
    set((state) => ({ workoutToAdd: state.workoutToAdd.filter((workout) => workout.id !== workoutId) })),
  clearWorkoutToAdd: () => set({ workoutToAdd: [] }),
}));

export default useRoutinesStore;
