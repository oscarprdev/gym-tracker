import { Suspense } from 'react';
import Link from 'next/link';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { requireAuth } from '@/lib/auth/utils';
import {
  getAllExercises,
  getUserCustomExercises,
} from '@/lib/db/queries/exercises';
import type { Exercise } from '@/lib/db/schema/exercises';
import { LoadingSpinner } from '@/components/common/loading-spinner';

async function ExercisesList() {
  const session = await requireAuth();
  const [allExercises, customExercises] = await Promise.all([
    getAllExercises(),
    getUserCustomExercises(session.user.id),
  ]);

  if (allExercises.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <h3 className="text-lg font-semibold text-foreground mb-2">
          No exercises found
        </h3>
        <p className="text-muted-foreground mb-4 max-w-sm">
          Start building your exercise library by creating your first exercise.
        </p>
        <Link href="/exercises/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Create Exercise
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {customExercises.length > 0 && (
        <section>
          <h2 className="text-xl font-semibold mb-4">Your Custom Exercises</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {customExercises.map((exercise) => (
              <ExerciseCard key={exercise.id} exercise={exercise} isCustom />
            ))}
          </div>
        </section>
      )}

      <section>
        <h2 className="text-xl font-semibold mb-4">
          {customExercises.length > 0 ? 'Built-in Exercises' : 'All Exercises'}
        </h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {allExercises
            .filter((exercise) => !exercise.isCustom)
            .map((exercise) => (
              <ExerciseCard
                key={exercise.id}
                exercise={exercise}
                isCustom={false}
              />
            ))}
        </div>
      </section>
    </div>
  );
}

function ExerciseCard({
  exercise,
  isCustom,
}: {
  exercise: Exercise;
  isCustom: boolean;
}) {
  return (
    <Link href={`/exercises/${exercise.id}`}>
      <Card className="h-full hover:shadow-md transition-shadow cursor-pointer">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <CardTitle className="text-lg leading-tight">
              {exercise.name}
            </CardTitle>
            {isCustom && (
              <Badge variant="secondary" className="text-xs">
                Custom
              </Badge>
            )}
          </div>
          {exercise.equipment && (
            <p className="text-sm text-gray-600">{exercise.equipment}</p>
          )}
        </CardHeader>
        <CardContent className="pt-0">
          {exercise.description && (
            <p className="text-sm text-gray-700 mb-3 line-clamp-2">
              {exercise.description}
            </p>
          )}
          <div className="flex flex-wrap gap-1">
            {exercise.muscleGroups.slice(0, 3).map((group: string) => (
              <Badge key={group} variant="outline" className="text-xs">
                {group}
              </Badge>
            ))}
            {exercise.muscleGroups.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{exercise.muscleGroups.length - 3}
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

export default async function ExercisesPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Exercise Library</h1>
          <p className="text-gray-600 mt-2">
            Manage your exercise library and create custom exercises
          </p>
        </div>
        <Link href="/exercises/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Create Exercise
          </Button>
        </Link>
      </div>

      <Suspense fallback={<LoadingSpinner />}>
        <ExercisesList />
      </Suspense>
    </div>
  );
}
