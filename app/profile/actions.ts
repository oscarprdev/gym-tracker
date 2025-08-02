'use server';

import { headers } from 'next/headers';
import { z } from 'zod';
import { requireAuth } from '@/lib/auth/dal';
import { auth } from '@/lib/auth/auth';
import { to, toSync } from '@/lib/utils/error-handler';
import {
  updateProfileSchema,
  changePasswordSchema,
  deleteAccountSchema,
} from '@/lib/validations/auth';
import { getUserByEmail, updateUserProfile } from '@/lib/db/queries';
import type {
  UpdateProfileState,
  ChangePasswordState,
  DeleteAccountState,
} from '@/lib/types/auth';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function updateProfileAction(
  prevState: UpdateProfileState | null,
  formData: FormData
): Promise<UpdateProfileState> {
  const session = await requireAuth();

  const name = formData.get('name') as string;
  const email = formData.get('email') as string;

  const [validationError, validatedData] = toSync(() =>
    updateProfileSchema.parse({ name, email })
  );

  if (validationError || !validatedData) {
    if (validationError instanceof z.ZodError) {
      return {
        error: validationError.issues[0]?.message || 'Invalid form data',
        fieldErrors: validationError.flatten().fieldErrors,
      };
    }
    return {
      error: 'Invalid form data',
    };
  }

  if (email !== session.user.email) {
    const [emailCheckError, existingUser] = await to(getUserByEmail(email));

    if (emailCheckError) {
      return {
        error: 'Failed to validate email. Please try again.',
      };
    }

    if (existingUser && existingUser.id !== session.user.id) {
      return {
        error: 'Email is already taken by another account',
      };
    }
  }

  const [updateError] = await to(
    updateUserProfile(session.user.id, {
      name: validatedData.name,
      email: validatedData.email,
    })
  );

  if (updateError) {
    console.error('Profile update error:', updateError);
    return {
      error: 'Failed to update profile. Please try again.',
    };
  }

  // Success - redirect to refresh the page with updated data
  revalidatePath('/profile');

  return {
    success: true,
    message: 'Profile updated successfully',
  };
}

export async function changePasswordAction(
  prevState: ChangePasswordState | null,
  formData: FormData
): Promise<ChangePasswordState> {
  await requireAuth();

  const currentPassword = formData.get('currentPassword') as string;
  const newPassword = formData.get('newPassword') as string;
  const confirmPassword = formData.get('confirmPassword') as string;

  const [validationError, validatedData] = toSync(() =>
    changePasswordSchema.parse({
      currentPassword,
      newPassword,
      confirmPassword,
    })
  );

  if (validationError || !validatedData) {
    if (validationError instanceof z.ZodError) {
      return {
        error: validationError.issues[0]?.message || 'Invalid form data',
        fieldErrors: validationError.flatten().fieldErrors,
      };
    }
    return {
      error: 'Invalid form data',
    };
  }

  const [authError, result] = await to(
    auth.api.changePassword({
      body: {
        newPassword: validatedData.newPassword,
        currentPassword: validatedData.currentPassword,
        revokeOtherSessions: true,
      },
      headers: await headers(),
    })
  );

  if (authError || !result) {
    return {
      error:
        authError?.message ||
        'Failed to change password. Please check your current password.',
    };
  }

  redirect('/auth/login');

  return {
    success: true,
    message: 'Password changed successfully',
  };
}

export async function deleteAccountAction(
  prevState: DeleteAccountState | null,
  formData: FormData
): Promise<DeleteAccountState> {
  const password = formData.get('password') as string;

  const [validationError, validatedData] = toSync(() =>
    deleteAccountSchema.parse({ password })
  );

  if (validationError || !validatedData) {
    if (validationError instanceof z.ZodError) {
      return {
        error: validationError.issues[0]?.message || 'Password is required',
        fieldErrors: validationError.flatten().fieldErrors,
      };
    }
    return {
      error: 'Password is required to delete account',
    };
  }

  const [authError, result] = await to(
    auth.api.deleteUser({
      body: {
        password: validatedData.password,
      },
      headers: await headers(),
    })
  );

  if (authError || !result) {
    return {
      error:
        authError?.message ||
        'Failed to delete account. Please check your password.',
    };
  }

  redirect('/auth/login');

  return {
    success: true,
    message: 'Account deleted successfully',
  };
}
