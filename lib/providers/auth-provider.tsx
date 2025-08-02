'use client';

import React from 'react';
import { authClient } from '@/lib/auth/auth-client';

interface AuthProviderProps {
  children: React.ReactNode;
}

export const { useSession, useUser, signIn, signUp, signOut } = authClient;

export function AuthProvider({ children }: AuthProviderProps) {
  return <>{children}</>;
}
