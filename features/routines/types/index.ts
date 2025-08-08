export interface Routine {
  id: string;
  name: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateRoutineData {
  name: string;
}

export interface UpdateRoutineData {
  id: string;
  name: string;
}
