'use server';

import { redirect } from 'next/navigation';
import { parseRegister, RegisterFormValues } from '@/features/auth/validations';
import { to, toSync } from '@/features/shared/utils/error-handler';
import signUpEmail from '@/features/auth/services/sign-up-email';
import { Nullable } from '@/features/shared';

export interface RegisterActionOutput {
  error: Nullable<string>;
}

export async function registerAction(input: RegisterFormValues): Promise<RegisterActionOutput> {
  const [validationError, validatedData] = toSync(() => parseRegister(input));
  if (validationError || !validatedData) {
    return { error: validationError?.message || 'Invalid form data' };
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
