'use client';

import { useActionState } from 'react';
import { User } from 'lucide-react';
import { updateProfileAction } from '@/app/profile/actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface ProfileFormProps {
  user: {
    id: string;
    name: string;
    email: string;
  };
}

export function ProfileForm({ user }: ProfileFormProps) {
  const [state, formAction, isPending] = useActionState(updateProfileAction, null);

  return (
    <div className="space-y-6">
      <form action={formAction} className="space-y-6">
        {state?.error && (
          <div className="p-3 text-sm text-destructive-foreground bg-destructive/10 border border-destructive/20 rounded-md">
            {state.error}
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="name">Full Name</Label>
          <div className="relative">
            <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              id="name"
              name="name"
              type="text"
              placeholder="Enter your full name"
              className="pl-10"
              defaultValue={user.name}
              disabled={isPending}
              required
            />
          </div>
          {state?.fieldErrors?.name?.[0] && <p className="text-sm text-destructive">{state.fieldErrors.name[0]}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email Address</Label>
          <div className="relative">
            <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="Enter your email"
              className="pl-10"
              defaultValue={user.email}
              disabled={isPending}
              required
            />
          </div>
          {state?.fieldErrors?.email?.[0] && <p className="text-sm text-destructive">{state.fieldErrors.email[0]}</p>}
        </div>

        <div className="flex justify-end">
          <Button type="submit" disabled={isPending}>
            {isPending ? 'Updating...' : 'Update Profile'}
          </Button>
        </div>
      </form>
    </div>
  );
}
