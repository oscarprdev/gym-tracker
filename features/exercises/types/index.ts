// Exercise-related types
export interface Exercise {
  id: string;
  name: string;
  muscleGroups: string[];
  createdBy: string | null;
  createdAt: Date;
  updatedAt: Date;
}
