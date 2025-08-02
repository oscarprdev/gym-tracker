'use client';

import { useSession, useUser } from '@/lib/auth/auth-client';

export function useAuth() {
  const {
    data: session,
    isPending: sessionLoading,
    error: sessionError,
  } = useSession();
  const { data: user, isPending: userLoading, error: userError } = useUser();

  const isLoading = sessionLoading || userLoading;
  const error = sessionError || userError;
  const isAuthenticated = !!session && !!user;

  return {
    session,
    user,
    isLoading,
    error,
    isAuthenticated,
  };
}
