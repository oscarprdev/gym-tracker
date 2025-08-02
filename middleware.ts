import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { auth } from '@/lib/auth/auth';

export async function middleware(request: NextRequest) {
  const url = request.nextUrl;
  const session = await auth.api.getSession({ headers: request.headers });

  const protectedRoutes = [
    '/dashboard',
    '/routines',
    '/workout',
    '/history',
    '/profile',
    '/settings',
  ];
  const authRoutes = ['/auth/login', '/auth/register'];

  const isProtectedRoute = protectedRoutes.some((route) =>
    url.pathname.startsWith(route)
  );

  const isAuthRoute = authRoutes.some((route) =>
    url.pathname.startsWith(route)
  );

  if (isProtectedRoute && !session) {
    const loginUrl = new URL('/auth/login', request.url);
    loginUrl.searchParams.set('from', url.pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (isAuthRoute && session) {
    const dashboardUrl = new URL('/dashboard', request.url);
    return NextResponse.redirect(dashboardUrl);
  }

  if (url.pathname === '/') {
    if (session) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    } else {
      return NextResponse.redirect(new URL('/auth/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
