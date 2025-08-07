'use server';

import { redirect } from 'next/navigation';
import { LoginFormValues, parseLogin } from '@/features/auth/validations';
import { to, toSync } from '@/features/shared/utils/error-handler';
import signInEmail from '@/features/auth/services/sign-in-email';
import { Nullable } from '@/features/shared';

export interface LoginActionOutput {
  error: Nullable<string>;
}

export async function loginAction(input: LoginFormValues): Promise<LoginActionOutput> {
  const [validationError, validatedData] = toSync(() => parseLogin(input));

  if (validationError || !validatedData) {
    return { error: validationError?.message || 'Invalid Data' };
  }

  const [authError, result] = await to(
    signInEmail({
      email: validatedData.email,
      password: validatedData.password,
    })
  );

  if (authError || !result?.user) {
    return {
      error: authError?.message || 'Invalid email or password',
    };
  }

  redirect('/');
}
