export interface Exercise {
  id: string;
  name: string;
  muscleGroups: string[];
  createdBy: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateExerciseRequest {
  name: string;
  muscleGroups: string[];
}

export interface UpdateExerciseRequest {
  id: string;
  name?: string;
  muscleGroups?: string[];
}

export interface DeleteExerciseRequest {
  id: string;
}
