'use client';

import { useState, useTransition } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/features/shared/components/ui/card';
import { Button } from '@/features/shared/components/ui/button';
import { Input } from '@/features/shared/components/ui/input';
import { Label } from '@/features/shared/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/features/shared/components/ui/dialog';
import { createWorkoutSessionAction } from '../services/actions';
import { quickWorkoutFormSchema, type QuickWorkoutFormData } from '../validations';
import { Routine } from '@/lib/db/schema/routines';
import { Plus, Dumbbell, Calendar, Zap, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';
import { format } from 'date-fns';

interface QuickActionsProps {
  activeRoutine?: Routine | null;
}

export function QuickActions({ activeRoutine }: QuickActionsProps) {
  const [isPending, startTransition] = useTransition();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState<QuickWorkoutFormData>({
    name: '',
    scheduledDate: format(new Date(), 'yyyy-MM-dd'),
  });
  const [formErrors, setFormErrors] = useState<Partial<Record<keyof QuickWorkoutFormData, string>>>({});

  const handleInputChange = (field: keyof QuickWorkoutFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Clear error when user starts typing
    if (formErrors[field]) {
      setFormErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleCreateQuickWorkout = () => {
    // Reset errors
    setFormErrors({});

    // Validate form data
    const result = quickWorkoutFormSchema.safeParse(formData);

    if (!result.success) {
      const errors: Partial<Record<keyof QuickWorkoutFormData, string>> = {};
      result.error.issues.forEach((error) => {
        if (error.path.length > 0) {
          const field = error.path[0] as keyof QuickWorkoutFormData;
          errors[field] = error.message;
        }
      });
      setFormErrors(errors);
      return;
    }

    const validatedData = result.data;

    startTransition(async () => {
      const workoutData = {
        name: validatedData.name,
        scheduledDate: validatedData.scheduledDate ? new Date(validatedData.scheduledDate) : undefined,
      };

      const result = await createWorkoutSessionAction(workoutData);

      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success('Quick workout created successfully!');
        setIsDialogOpen(false);
        setFormData({
          name: '',
          scheduledDate: format(new Date(), 'yyyy-MM-dd'),
        });
      }
    });
  };

  const quickActionButtons = [
    {
      icon: Calendar,
      label: 'Schedule Workout',
      description: 'Plan a workout session',
      href: '/workouts/new',
      variant: 'outline' as const,
    },
    {
      icon: Dumbbell,
      label: 'Browse Exercises',
      description: 'Explore exercise library',
      href: '/exercises',
      variant: 'outline' as const,
    },
    {
      icon: Plus,
      label: 'New Routine',
      description: 'Create a workout routine',
      href: '/routines/new',
      variant: 'outline' as const,
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="w-5 h-5 text-yellow-600" />
          Quick Actions
        </CardTitle>
        <CardDescription>Fast access to common tasks and workout management</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Quick Workout Creation */}
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="w-full" size="lg">
                <Plus className="w-4 h-4 mr-2" />
                Create Quick Workout
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Create Quick Workout</DialogTitle>
                <DialogDescription>
                  Create a custom workout session that&apos;s not part of your routine.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="workout-name">Workout Name</Label>
                  <Input
                    id="workout-name"
                    placeholder="e.g., Upper Body, Cardio Session..."
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className={formErrors.name ? 'border-red-500' : ''}
                  />
                  {formErrors.name && <p className="text-sm text-red-600">{formErrors.name}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="scheduled-date">Scheduled Date (Optional)</Label>
                  <Input
                    id="scheduled-date"
                    type="date"
                    value={formData.scheduledDate}
                    onChange={(e) => handleInputChange('scheduledDate', e.target.value)}
                    className={formErrors.scheduledDate ? 'border-red-500' : ''}
                  />
                  {formErrors.scheduledDate && <p className="text-sm text-red-600">{formErrors.scheduledDate}</p>}
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)} disabled={isPending}>
                  Cancel
                </Button>
                <Button onClick={handleCreateQuickWorkout} disabled={isPending}>
                  {isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4 mr-2" />
                      Create Workout
                    </>
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Action Buttons Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {quickActionButtons.map((action) => (
              <Button
                key={action.label}
                variant={action.variant}
                size="sm"
                asChild
                className="h-auto p-3 flex flex-col items-center gap-2"
              >
                <Link href={action.href}>
                  <action.icon className="w-5 h-5" />
                  <div className="text-center">
                    <div className="text-sm font-medium">{action.label}</div>
                    <div className="text-xs text-muted-foreground">{action.description}</div>
                  </div>
                </Link>
              </Button>
            ))}
          </div>

          {/* Active Routine Quick Access */}
          {activeRoutine && (
            <div className="pt-2 border-t border-gray-200">
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-gray-700">Active Routine</h4>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: activeRoutine.color || '#6b7280' }} />
                  <span className="text-sm text-gray-600">{activeRoutine.name}</span>
                </div>
                <Button variant="outline" size="sm" asChild className="w-full">
                  <Link href={`/routines/${activeRoutine.id}`}>
                    <Calendar className="w-4 h-4 mr-2" />
                    View Routine Details
                  </Link>
                </Button>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
