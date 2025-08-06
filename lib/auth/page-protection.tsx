import { redirect } from 'next/navigation';
import { getUser, requireAuth } from './dal';

/**
 * Higher-order function to protect server components
 * Redirects to login if user is not authenticated
 */
export function withAuth<P extends Record<string, unknown>>(Component: React.ComponentType<P>) {
  return async function AuthProtectedComponent(props: P) {
    const user = await getUser();

    if (!user) {
      redirect('/login');
    }

    return <Component {...props} />;
  };
}

/**
 * Higher-order function that passes user data to protected components
 * Redirects to login if user is not authenticated
 */
type UserType = NonNullable<Awaited<ReturnType<typeof getUser>>>;

export function withAuthUser<P extends Record<string, unknown>>(
  Component: React.ComponentType<P & { user: UserType }>
) {
  return async function AuthUserComponent(props: P) {
    const user = await getUser();

    if (!user) {
      redirect('/auth/login');
    }

    return <Component {...props} user={user} />;
  };
}

/**
 * Component that conditionally renders children based on auth state
 */
export async function AuthGuard({
  children,
  fallback = null,
  redirectTo = '/auth/login',
}: {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  redirectTo?: string;
}) {
  const user = await getUser();

  if (!user) {
    if (redirectTo) {
      redirect(redirectTo);
    }
    return <>{fallback}</>;
  }

  return <>{children}</>;
}

/**
 * Component that renders different content based on auth state
 */
export async function AuthContent({
  authenticated,
  unauthenticated,
}: {
  authenticated: React.ReactNode;
  unauthenticated: React.ReactNode;
}) {
  const user = await getUser();

  return <>{user ? authenticated : unauthenticated}</>;
}

/**
 * Utility function for protecting server actions
 * Call this at the beginning of any server action that requires authentication
 */
export async function protectServerAction() {
  const sessionData = await requireAuth();
  return sessionData;
}
