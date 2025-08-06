'use client';

import { useState, useActionState } from 'react';
import { Trash2, AlertTriangle, Eye, EyeOff } from 'lucide-react';
import { deleteAccountAction } from '@/features/profile/services/actions';
import type { DeleteAccountState } from '@/features/profile/types';
import { Button } from '@/features/shared/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/features/shared/components/ui/dialog';
import { Input } from '@/features/shared/components/ui/input';
import { Label } from '@/features/shared/components/ui/label';

export function DangerZone() {
  const [state, formAction, isPending] = useActionState(deleteAccountAction, {} as DeleteAccountState);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <div className="flex items-start space-x-3">
          <AlertTriangle className="h-6 w-6 text-red-600 mt-0.5 flex-shrink-0" />
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-red-900 mb-2">Delete Account</h3>
            <p className="text-red-700 text-sm mb-4">
              Once you delete your account, there is no going back. This action cannot be undone. All of your workout
              data, routines, and progress will be permanently deleted.
            </p>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="destructive" className="bg-red-600 hover:bg-red-700">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete Account
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle className="text-red-900">Delete Account</DialogTitle>
                  <DialogDescription className="text-red-700">
                    This action cannot be undone. This will permanently delete your account and remove all your data
                    from our servers.
                  </DialogDescription>
                </DialogHeader>

                <form action={formAction} className="space-y-4">
                  {state?.error && (
                    <div className="p-3 text-sm text-destructive-foreground bg-destructive/10 border border-destructive/20 rounded-md">
                      {state.error}
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-red-900">
                      Enter your password to confirm deletion
                    </Label>
                    <div className="relative">
                      <Input
                        id="password"
                        name="password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Enter your password"
                        className="pr-10 border-red-300 focus:border-red-500 focus:ring-red-500"
                        disabled={isPending}
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={togglePasswordVisibility}
                        disabled={isPending}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        <span className="sr-only">{showPassword ? 'Hide password' : 'Show password'}</span>
                      </Button>
                    </div>
                    {state?.fieldErrors?.password?.[0] && (
                      <p className="text-sm text-destructive">{state.fieldErrors.password[0]}</p>
                    )}
                  </div>

                  <DialogFooter className="flex gap-2 sm:gap-0">
                    <Button type="button" variant="outline" onClick={handleDialogClose} disabled={isPending}>
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      variant="destructive"
                      className="bg-red-600 hover:bg-red-700"
                      disabled={isPending}
                    >
                      {isPending ? 'Deleting...' : 'Delete Account'}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>
    </div>
  );
}
