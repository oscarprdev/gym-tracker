'use server';

import { redirect } from 'next/navigation';
import { headers } from 'next/headers';
import { auth } from '@/lib/auth/auth';
import { parseLogin, parseRegister } from '@/features/auth/validations';
import { to, toSync, handleValidationError } from '@/lib/utils/error-handler';
import type { LoginState, RegisterState } from '@/features/auth/types';

export async function loginAction(prevState: LoginState | null, formData: FormData): Promise<LoginState> {
  const [validationError, validatedData] = toSync(() => parseLogin(formData));

  const validationErrorResult = handleValidationError(validationError, validatedData);
  if (validationErrorResult) return validationErrorResult;
  if (!validatedData) return { error: 'Invalid form data' };

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

export async function registerAction(prevState: RegisterState | null, formData: FormData): Promise<RegisterState> {
  const [validationError, validatedData] = toSync(() => parseRegister(formData));

  const validationErrorResult = handleValidationError(validationError, validatedData);
  if (validationErrorResult) return validationErrorResult;
  if (!validatedData) return { error: 'Invalid form data' };

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
