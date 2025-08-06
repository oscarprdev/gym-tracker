'use server';

import { redirect } from 'next/navigation';
import { headers } from 'next/headers';
import { auth } from './auth';

export async function getSession() {
  const headersList = await headers();

  const session = await auth.api.getSession({
    headers: headersList,
  });

  return session;
}

export async function requireAuth() {
  const session = await getSession();

  if (!session) redirect('/login');

  return session;
}

export async function getCurrentUser() {
  const session = await getSession();
  return session?.user || null;
}
