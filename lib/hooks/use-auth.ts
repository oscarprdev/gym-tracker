'use client';

import { useSession } from '@/lib/auth/auth-client';

export function useAuth() {
  const { data: session, isPending: isLoading, error } = useSession();

  const user = session?.user;
  const isAuthenticated = !!session && !!user;

  return {
    session,
    user,
    isLoading,
    error,
    isAuthenticated,
  };
}
