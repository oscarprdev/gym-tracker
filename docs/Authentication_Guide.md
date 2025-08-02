# Better Auth Session Management & Page Protection Guide

This guide explains how to use Better Auth with proper session management and page protection in your Next.js application, following the latest Next.js authentication best practices.

## Overview

The authentication system uses a **Data Access Layer (DAL)** pattern, which is the recommended approach for Next.js applications. This keeps authentication checks close to data access and provides better security than relying solely on middleware.

## Key Components

### 1. Data Access Layer (`lib/auth/dal.ts`)

The DAL contains all authentication-related functions:

- `verifySession()` - Check if user has a valid session
- `getUser()` - Get current authenticated user
- `requireAuth()` - Throw error if user is not authenticated
- `hasRole()` - Check user permissions
- `getSessionForMiddleware()` - Optimized session check for middleware

### 2. Page Protection (`lib/auth/page-protection.tsx`)

Higher-order components and utilities for protecting pages:

- `withAuth()` - Protect a component, redirect if not authenticated
- `withAuthUser()` - Protect a component and pass user data
- `AuthGuard` - Conditional rendering based on auth state
- `protectServerAction()` - Protect server actions

### 3. Middleware (`middleware.ts`)

Application-wide route protection for initial checks.

## Usage Examples

### Protecting Server Components

#### Method 1: Using Higher-Order Components

```tsx
// app/dashboard/page.tsx
import { withAuthUser } from '@/lib/auth/page-protection';

async function DashboardPage({ user }: { user: User }) {
  return (
    <div>
      <h1>Welcome, {user.name}!</h1>
      {/* Your dashboard content */}
    </div>
  );
}

// Protect the page and pass user data
export default withAuthUser(DashboardPage);
```

#### Method 2: Direct Auth Checks

```tsx
// app/profile/page.tsx
import { requireAuth } from '@/lib/auth/dal';

export default async function ProfilePage() {
  const sessionData = await requireAuth();

  return (
    <div>
      <h1>Profile: {sessionData.user.name}</h1>
      <p>Email: {sessionData.user.email}</p>
    </div>
  );
}
```

#### Method 3: Conditional Rendering

```tsx
// app/settings/page.tsx
import { getUser } from '@/lib/auth/dal';
import { redirect } from 'next/navigation';

export default async function SettingsPage() {
  const user = await getUser();

  if (!user) {
    redirect('/auth/login');
  }

  return (
    <div>
      <h1>Settings for {user.name}</h1>
    </div>
  );
}
```

### Protecting Server Actions

```tsx
// app/dashboard/actions.ts
'use server';

import { protectServerAction } from '@/lib/auth/page-protection';
import { revalidatePath } from 'next/cache';

export async function updateProfileAction(formData: FormData) {
  // This will throw if user is not authenticated
  const sessionData = await protectServerAction();

  const name = formData.get('name') as string;

  // Update user profile in database
  // await db.user.update({ where: { id: sessionData.userId }, data: { name } });

  revalidatePath('/dashboard');
  return { success: true };
}
```

### Protecting API Routes

```tsx
// app/api/protected/user/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { verifySession } from '@/lib/auth/dal';

export async function GET(request: NextRequest) {
  const sessionData = await verifySession();

  if (!sessionData) {
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
  }

  // Return protected data
  return NextResponse.json({
    user: sessionData.user,
    message: 'This is protected data',
  });
}
```

### Conditional UI Components

```tsx
// components/conditional-content.tsx
import { AuthContent } from '@/lib/auth/page-protection';

export function ConditionalContent() {
  return (
    <AuthContent
      authenticated={<div>Welcome! You are logged in.</div>}
      unauthenticated={<div>Please log in to access this content.</div>}
    />
  );
}
```

### Client-Side Authentication

For client components, use the existing `useAuth` hook:

```tsx
'use client';

import { useAuth } from '@/lib/hooks/use-auth';

export function ClientComponent() {
  const { user, isLoading, isAuthenticated } = useAuth();

  if (isLoading) return <div>Loading...</div>;

  if (!isAuthenticated) {
    return <div>Please log in</div>;
  }

  return <div>Hello, {user.name}!</div>;
}
```

## Security Best Practices

### 1. Multi-layered Protection

```tsx
// Example: Multiple layers of protection
export default async function SecurePage() {
  // Layer 1: Server component auth check
  const user = await getUser();
  if (!user) redirect('/auth/login');

  // Layer 2: Additional permission check
  const hasPermission = await hasRole('admin');
  if (!hasPermission) redirect('/unauthorized');

  return <div>Super secure content</div>;
}
```

### 2. Data Access Protection

```tsx
// Always protect data access functions
async function fetchSensitiveData(userId: string) {
  // Verify session before accessing data
  const sessionData = await verifySession();
  if (!sessionData) throw new Error('Unauthorized');

  // Check if user can access this specific data
  if (sessionData.userId !== userId) throw new Error('Forbidden');

  // Fetch and return data
  return await db.sensitiveData.findMany({ where: { userId } });
}
```

### 3. Server Action Protection

```tsx
'use server';

export async function deleteUserAction(userId: string) {
  // Always protect server actions
  const sessionData = await protectServerAction();

  // Additional authorization checks
  if (sessionData.userId !== userId && !(await hasRole('admin'))) {
    throw new Error('Unauthorized to delete this user');
  }

  // Perform the action
  await db.user.delete({ where: { id: userId } });
}
```

## Middleware Configuration

The middleware provides initial route protection:

```typescript
// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getSessionForMiddleware } from '@/lib/auth/dal';

// Define public and protected routes
const publicRoutes = ['/', '/auth/login', '/auth/register'];
const protectedRoutes = ['/dashboard', '/profile'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Handle protected routes
  if (protectedRoutes.some((route) => pathname.startsWith(route))) {
    const session = await getSessionForMiddleware(request);

    if (!session) {
      const loginUrl = new URL('/auth/login', request.url);
      loginUrl.searchParams.set('redirectTo', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}
```

## Key Principles

1. **Data Access Layer First**: Always use the DAL for authentication checks
2. **Proximity Principle**: Keep auth checks close to data access
3. **Multi-layered Security**: Don't rely on a single layer of protection
4. **Server-side Validation**: Never trust client-side auth state alone
5. **Graceful Error Handling**: Provide good UX for auth failures

## Migration from Old Auth Utils

If you're migrating from the old auth utils:

```tsx
// OLD
import { requireAuth } from '@/lib/auth/utils';

// NEW
import { requireAuth } from '@/lib/auth/dal';
```

The API is the same, but the new DAL provides better caching and follows modern Next.js patterns.

## Testing

When testing protected components, mock the auth functions:

```tsx
// tests/dashboard.test.tsx
import { vi } from 'vitest';

vi.mock('@/lib/auth/dal', () => ({
  requireAuth: vi.fn().mockResolvedValue({
    user: { id: '1', name: 'Test User', email: 'test@example.com' },
    userId: '1',
    isAuth: true,
    session: {},
  }),
}));
```

This authentication system provides robust, secure, and maintainable session management for your Next.js application while following the latest best practices.
