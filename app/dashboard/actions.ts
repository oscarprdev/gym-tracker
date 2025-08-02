'use server';

import { redirect } from 'next/navigation';
import { headers } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { auth } from '@/lib/auth/auth';
import { protectServerAction } from '@/lib/auth/page-protection';
import { to } from '@/lib/utils/error-handler';

export async function logoutAction() {
  // For logout, we don't need to protect since anyone should be able to logout
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

// Example of a protected server action
export async function updateProfileAction(formData: FormData) {
  // Protect the server action - this will throw if user is not authenticated
  const sessionData = await protectServerAction();

  const name = formData.get('name') as string;

  if (!name || name.trim().length === 0) {
    throw new Error('Name is required');
  }

  // Here you would update the user's profile in the database
  console.log('Updating profile for user:', sessionData.userId);
  console.log('New name:', name);

  // Example: await db.user.update({ where: { id: sessionData.userId }, data: { name } });

  // Revalidate the dashboard page to show updated data
  revalidatePath('/dashboard');

  return { success: true, message: 'Profile updated successfully' };
}
