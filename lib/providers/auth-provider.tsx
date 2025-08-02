'use client';

import React, { createContext, useContext } from 'react';
import { authClient } from '@/lib/auth/auth-client';

interface AuthProviderProps {
  children: React.ReactNode;
}

// Re-export the auth client hooks for convenience
export const { useSession, useUser, signIn, signUp, signOut } = authClient;

export function AuthProvider({ children }: AuthProviderProps) {
  return <>{children}</>;
}
