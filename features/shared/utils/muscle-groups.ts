export const MUSCLE_GROUP_COLORS = {
  Chest: 'bg-red-100 text-red-800',
  Back: 'bg-blue-100 text-blue-800',
  Shoulders: 'bg-green-100 text-green-800',
  Biceps: 'bg-purple-100 text-purple-800',
  Triceps: 'bg-orange-100 text-orange-800',
  Legs: 'bg-yellow-100 text-yellow-800',
  Core: 'bg-pink-100 text-pink-800',
  Glutes: 'bg-indigo-100 text-indigo-800',
} as const;

export function getMuscleGroupColor(muscleGroup: string): string {
  return MUSCLE_GROUP_COLORS[muscleGroup as keyof typeof MUSCLE_GROUP_COLORS] || 'bg-gray-100 text-gray-800';
}
