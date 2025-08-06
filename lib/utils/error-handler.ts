import { z } from 'zod';
import { requireAuth } from '@/lib/auth/utils';

export async function to<T, E = Error>(promise: Promise<T>): Promise<[E | null, T | null]> {
  try {
    const data = await promise;
    return [null, data];
  } catch (error) {
    return [error as E, null];
  }
}

export function toSync<T, E = Error>(fn: () => T): [E | null, T | null] {
  try {
    const data = fn();
    return [null, data];
  } catch (error) {
    return [error as E, null];
  }
}

export interface ValidationErrorResult {
  error: string;
  fieldErrors?: Record<string, string[]>;
}

export function handleValidationError<T>(
  validationError: Error | null,
  validatedData: T | null
): ValidationErrorResult | null {
  if (validationError || !validatedData) {
    if (validationError instanceof z.ZodError) {
      return {
        error: validationError.issues[0]?.message || 'Invalid form data',
        fieldErrors: validationError.flatten().fieldErrors,
      };
    }
    return { error: 'Invalid form data' };
  }
  return null;
}

export function protectedAction<T extends unknown[], R>(
  action: (session: Awaited<ReturnType<typeof requireAuth>>, ...args: T) => Promise<R>
) {
  return async (...args: T): Promise<R | ValidationErrorResult> => {
    const [sessionError, session] = await to(requireAuth());
    if (sessionError || !session) {
      return { error: 'Authentication required' };
    }
    return action(session, ...args);
  };
}
