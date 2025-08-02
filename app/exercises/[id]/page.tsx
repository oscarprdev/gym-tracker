import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Edit2, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { requireAuth } from '@/lib/auth/utils';
import { getExerciseById } from '@/lib/db/queries/exercises';

interface ExercisePageProps {
  params: {
    id: string;
  };
}

export default async function ExercisePage({ params }: ExercisePageProps) {
  const session = await requireAuth();
  const exercise = await getExerciseById(params.id);

  if (!exercise) {
    notFound();
  }

  const isOwner = exercise.isCustom && exercise.createdBy === session.user.id;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link
          href="/exercises"
          className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Exercises
        </Link>

        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold">{exercise.name}</h1>
              {exercise.isCustom && <Badge variant="secondary">Custom</Badge>}
            </div>
            {exercise.equipment && (
              <p className="text-gray-600">Equipment: {exercise.equipment}</p>
            )}
          </div>

          {isOwner && (
            <div className="flex gap-2">
              <Link href={`/exercises/${exercise.id}/edit`}>
                <Button variant="outline" size="sm">
                  <Edit2 className="mr-2 h-4 w-4" />
                  Edit
                </Button>
              </Link>
              <Button
                variant="outline"
                size="sm"
                className="text-red-600 hover:text-red-700"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </Button>
            </div>
          )}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          {exercise.description && (
            <Card>
              <CardHeader>
                <CardTitle>Description</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">{exercise.description}</p>
              </CardContent>
            </Card>
          )}

          {exercise.instructions && exercise.instructions.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Instructions</CardTitle>
              </CardHeader>
              <CardContent>
                <ol className="space-y-2">
                  {exercise.instructions.map((instruction, index) => (
                    <li key={index} className="flex gap-3">
                      <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-800 text-sm font-medium rounded-full flex items-center justify-center">
                        {index + 1}
                      </span>
                      <span className="text-gray-700">{instruction}</span>
                    </li>
                  ))}
                </ol>
              </CardContent>
            </Card>
          )}

          {exercise.imageUrl && (
            <Card>
              <CardHeader>
                <CardTitle>Exercise Image</CardTitle>
              </CardHeader>
              <CardContent>
                <Image
                  src={exercise.imageUrl}
                  alt={exercise.name}
                  width={600}
                  height={256}
                  className="w-full h-64 object-cover rounded-lg"
                />
              </CardContent>
            </Card>
          )}

          {exercise.videoUrl && (
            <Card>
              <CardHeader>
                <CardTitle>Exercise Video</CardTitle>
              </CardHeader>
              <CardContent>
                <a
                  href={exercise.videoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800"
                >
                  Watch exercise video →
                </a>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Muscle Groups</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {exercise.muscleGroups.map((group) => (
                  <Badge key={group} variant="outline">
                    {group}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full">Add to Routine</Button>
              <Button variant="outline" className="w-full">
                Start Quick Workout
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Exercise Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Type:</span>
                <span>{exercise.isCustom ? 'Custom' : 'Built-in'}</span>
              </div>
              {exercise.equipment && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Equipment:</span>
                  <span>{exercise.equipment}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-gray-600">Created:</span>
                <span>{exercise.createdAt.toLocaleDateString()}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
