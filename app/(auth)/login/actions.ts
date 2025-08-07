'use server';

import { redirect } from 'next/navigation';
import { parseLogin, parseRegister } from '@/features/auth/validations';
import { to, toSync, handleValidationError } from '@/lib/utils/error-handler';
import type { LoginState, RegisterState } from '@/features/auth/types';
import signInEmail from '@/features/auth/services/sign-in-email';
import signUpEmail from '@/features/auth/services/sign-up-email';

export async function loginAction(formData: FormData): Promise<LoginState> {
  const [validationError, validatedData] = toSync(() => parseLogin(formData));

  const validationErrorResult = handleValidationError(validationError, validatedData);
  if (validationErrorResult || !validatedData) {
    return { error: validationErrorResult?.error || 'Invalid Data' };
  }

  const [authError, result] = await to(signInEmail({ email: validatedData.email, password: validatedData.password }));
  if (authError || !result?.user) {
    return {
      error: authError?.message || 'Invalid email or password',
    };
  }

  redirect('/');
}

export async function registerAction(formData: FormData): Promise<RegisterState> {
  const [validationError, validatedData] = toSync(() => parseRegister(formData));

  const validationErrorResult = handleValidationError(validationError, validatedData);
  if (validationErrorResult || !validatedData) {
    return { error: validationErrorResult?.error || 'Invalid form data' };
  }

  if (validatedData.confirmPassword !== validatedData.password) {
    return { error: 'Password does not match with Confirmation Password' };
  }

  const [authError, result] = await to(
    signUpEmail({
      name: validatedData.name,
      email: validatedData.email,
      password: validatedData.password,
    })
  );

  if (authError || !result?.user) {
    return {
      error: authError?.message || 'Failed to create account',
    };
  }

  redirect('/login');
}
