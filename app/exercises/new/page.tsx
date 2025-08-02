import { requireAuth } from '@/lib/auth/utils';
import { ExerciseForm } from '@/components/exercises/exercise-form';

export default async function NewExercisePage() {
  await requireAuth();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Create New Exercise</h1>
        <p className="text-gray-600 mt-2">
          Add a custom exercise to your library with sets, reps, and weight configuration
        </p>
      </div>

      <ExerciseForm mode="create" />
    </div>
  );
}
