'use server';

import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth/auth';
import { parseRegister } from '@/lib/validations/auth';
import { to, toSync, handleValidationError } from '@/lib/utils/error-handler';
import type { RegisterState } from '@/lib/types/auth';

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
