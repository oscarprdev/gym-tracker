'use server';

import { redirect } from 'next/navigation';
import { z } from 'zod';
import { auth } from '@/lib/auth/auth';
import { registerSchema } from '@/lib/validations/auth';
import { to, toSync } from '@/lib/utils/error-handler';
import type { RegisterState } from '@/lib/types/auth';

export async function registerAction(
  prevState: RegisterState | null,
  formData: FormData
): Promise<RegisterState> {
  const name = formData.get('name') as string;
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const confirmPassword = formData.get('confirmPassword') as string;

  const [validationError, validatedData] = toSync(() =>
    registerSchema.parse({
      name,
      email,
      password,
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
    auth.api.signUpEmail({
      body: {
        name: validatedData.name,
        email: validatedData.email,
        password: validatedData.password,
      },
    })
  );

  if (authError) {
    console.error('Registration error:', authError);
    return {
      error: authError.message || 'Failed to create account',
    };
  }

  if (!result?.user) {
    return {
      error: 'Failed to create account',
    };
  }

  redirect('/auth/login');
}
