'use client';

import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { LogOut, User, Settings, Loader2 } from 'lucide-react';
import { logoutAction } from '@/features/dashboard/services/actions';
import { useAuth } from '@/features/auth/hooks/use-auth';
import { Button } from '@/features/shared/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/features/shared/components/ui/dropdown-menu';
import { to } from '@/lib/utils/error-handler';

export function UserMenu() {
  const router = useRouter();
  const { user } = useAuth();
  const [isPending, startTransition] = useTransition();

  const handleSignOut = () => {
    startTransition(async () => {
      const [error] = await to(logoutAction());
      if (error) console.error('Sign out error:', error);
    });
  };

  if (!user) return null;

  const initials = user.name
    ? user.name
        .split(' ')
        .map((name: string) => name[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : user.email[0].toUpperCase();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="relative h-10 w-10 rounded-full bg-secondary hover:bg-accent transition-colors duration-200"
        >
          <span className="text-sm font-medium text-secondary-foreground">{initials}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user.name}</p>
            <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="cursor-pointer" onClick={() => router.push('/profile')}>
          <User className="mr-2 h-4 w-4" />
          <span>Profile</span>
        </DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer" onClick={() => router.push('/settings')}>
          <Settings className="mr-2 h-4 w-4" />
          <span>Settings</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="cursor-pointer text-destructive focus:text-destructive"
          onClick={handleSignOut}
          disabled={isPending}
        >
          {isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              <span>Signing out...</span>
            </>
          ) : (
            <>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Sign out</span>
            </>
          )}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
