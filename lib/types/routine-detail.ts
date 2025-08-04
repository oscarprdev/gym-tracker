export interface WorkoutExerciseSet {
  id: string;
  setNumber: number;
  reps: number | null;
  weight: number;
}

export interface WorkoutExercise {
  id: string;
  order: number;
  exercise: {
    id: string;
    name: string;
    muscleGroups: string[];
  };
  sets: WorkoutExerciseSet[];
}

export interface Workout {
  id: string;
  name: string;
  dayOfWeek: number | null;
  order: number;
  estimatedDuration: number | null;
  exercises: WorkoutExercise[];
}

export interface RoutineDetail {
  id: string;
  userId: string;
  name: string;
  description: string | null;
  color: string | null;
  createdAt: Date;
  updatedAt: Date;
  workouts: Workout[];
}
