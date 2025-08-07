'use client';

import React from 'react';
import { authClient } from '@/lib/auth/auth-client';

interface AuthProviderProps {
  children: React.ReactNode;
}

export const { useSession, signIn, signUp, signOut } = authClient;

export function AuthProvider({ children }: AuthProviderProps) {
  return <>{children}</>;
}
