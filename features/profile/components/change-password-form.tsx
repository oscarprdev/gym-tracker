'use client';

import { useState, useActionState } from 'react';
import { Lock, Eye, EyeOff } from 'lucide-react';
import { changePasswordAction } from '@/features/profile/services/actions';
import type { ChangePasswordState } from '@/features/profile/types';
import { Button } from '@/features/shared/components/ui/button';
import { Input } from '@/features/shared/components/ui/input';
import { Label } from '@/features/shared/components/ui/label';

export function ChangePasswordForm() {
  const [state, formAction, isPending] = useActionState(changePasswordAction, {} as ChangePasswordState);
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const togglePasswordVisibility = (field: keyof typeof showPasswords) => {
    setShowPasswords((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  return (
    <div className="space-y-6">
      <form action={formAction} className="space-y-6">
        {state?.error && (
          <div className="p-3 text-sm text-destructive-foreground bg-destructive/10 border border-destructive/20 rounded-md">
            {state.error}
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="currentPassword">Current Password</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              id="currentPassword"
              name="currentPassword"
              type={showPasswords.current ? 'text' : 'password'}
              placeholder="Enter your current password"
              className="pl-10 pr-10"
              disabled={isPending}
              required
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
              onClick={() => togglePasswordVisibility('current')}
              disabled={isPending}
            >
              {showPasswords.current ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              <span className="sr-only">{showPasswords.current ? 'Hide password' : 'Show password'}</span>
            </Button>
          </div>
          {'fieldErrors' in state && state?.fieldErrors?.currentPassword?.[0] && (
            <p className="text-sm text-destructive">{state.fieldErrors.currentPassword[0]}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="newPassword">New Password</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              id="newPassword"
              name="newPassword"
              type={showPasswords.new ? 'text' : 'password'}
              placeholder="Enter your new password"
              className="pl-10 pr-10"
              disabled={isPending}
              required
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
              onClick={() => togglePasswordVisibility('new')}
              disabled={isPending}
            >
              {showPasswords.new ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              <span className="sr-only">{showPasswords.new ? 'Hide password' : 'Show password'}</span>
            </Button>
          </div>
          {'fieldErrors' in state && state?.fieldErrors?.newPassword?.[0] && (
            <p className="text-sm text-destructive">{state.fieldErrors.newPassword[0]}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Confirm New Password</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type={showPasswords.confirm ? 'text' : 'password'}
              placeholder="Confirm your new password"
              className="pl-10 pr-10"
              disabled={isPending}
              required
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
              onClick={() => togglePasswordVisibility('confirm')}
              disabled={isPending}
            >
              {showPasswords.confirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              <span className="sr-only">{showPasswords.confirm ? 'Hide password' : 'Show password'}</span>
            </Button>
          </div>
          {'fieldErrors' in state && state?.fieldErrors?.confirmPassword?.[0] && (
            <p className="text-sm text-destructive">{state.fieldErrors.confirmPassword[0]}</p>
          )}
        </div>

        <div className="flex justify-end">
          <Button type="submit" disabled={isPending}>
            {isPending ? 'Changing Password...' : 'Change Password'}
          </Button>
        </div>
      </form>
    </div>
  );
}
