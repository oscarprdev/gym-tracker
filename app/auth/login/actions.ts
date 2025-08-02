'use server';

import { redirect } from 'next/navigation';
import { headers } from 'next/headers';
import { auth } from '@/lib/auth/auth';
import { parseLogin } from '@/lib/validations/auth';
import { to, toSync, handleValidationError } from '@/lib/utils/error-handler';
import type { LoginState } from '@/lib/types/auth';

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
