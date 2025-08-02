'use server';

import { redirect } from 'next/navigation';
import { headers } from 'next/headers';
import { auth } from '@/lib/auth/auth';
import { to } from '@/lib/utils/error-handler';

export async function logoutAction() {
  const [logoutError] = await to(
    auth.api.signOut({
      headers: await headers(),
    })
  );

  if (logoutError) {
    console.error('Logout error:', logoutError);
  }

  redirect('/auth/login');
}
