'use server';

import { redirect } from 'next/navigation';
import { headers } from 'next/headers';
import { z } from 'zod';
import { auth } from '@/lib/auth/auth';
import { loginSchema } from '@/lib/validations/auth';
import { to, toSync } from '@/lib/utils/error-handler';
import type { LoginState } from '@/lib/types/auth';

export async function loginAction(
  prevState: LoginState | null,
  formData: FormData
): Promise<LoginState> {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  const [validationError, validatedData] = toSync(() =>
    loginSchema.parse({ email, password })
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
    auth.api.signInEmail({
      body: {
        email: validatedData.email,
        password: validatedData.password,
        rememberMe: true,
      },
      headers: await headers(),
    })
  );

  if (authError) {
    console.error('Authentication error:', authError);
    return {
      error: authError.message || 'Invalid email or password',
    };
  }

  if (!result?.user) {
    return {
      error: 'Invalid email or password',
    };
  }

  redirect('/dashboard');
}
