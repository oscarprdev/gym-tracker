'use server';

import { cache } from 'react';
import { headers } from 'next/headers';
import { auth } from './auth';

/**
 * Data Access Layer for authentication
 * This follows Next.js 15 best practices by keeping auth checks close to data access
 */

/**
 * Verify the current user session
 * Uses React's cache to ensure the session is only fetched once per request
 */
export const verifySession = cache(async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  console.log('session', session);

  if (!session) {
    return null;
  }

  return {
    isAuth: true,
    userId: session.user.id,
    user: session.user,
    session: session.session,
  };
});

/**
 * Get the current authenticated user
 * Returns null if user is not authenticated
 */
export const getUser = cache(async () => {
  const sessionData = await verifySession();

  if (!sessionData) {
    return null;
  }

  return sessionData.user;
});

/**
 * Require authentication - throws if user is not authenticated
 * Use this in server components and server actions that require authentication
 */
export const requireAuth = cache(async () => {
  const sessionData = await verifySession();

  if (!sessionData) {
    throw new Error('Authentication required');
  }

  return sessionData;
});

/**
 * Check if user has specific role
 * Add role-based authorization logic here
 */
export const hasRole = cache(async (_role: string) => {
  const sessionData = await verifySession();

  if (!sessionData) {
    return false;
  }

  // Add your role checking logic here
  // This depends on how you store roles in your user model
  return true; // Placeholder - implement based on your needs
});

/**
 * Get user session for middleware
 * Optimized for middleware use cases
 */
export const getSessionForMiddleware = async (request: Request) => {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    return session;
  } catch (error) {
    console.error('Session verification failed:', error);
    return null;
  }
};
