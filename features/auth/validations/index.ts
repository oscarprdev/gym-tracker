import { z } from 'zod';

export const authIdSchema = z
  .string()
  .length(32)
  .regex(/^[a-zA-Z0-9_-]+$/, {
    message: 'Invalid Auth ID format',
  });

export const loginSchema = z.object({
  email: z.email('Please enter a valid email address').min(1, 'Email is required'),
  password: z.string().min(1, 'Password is required').min(6, 'Password must be at least 6 characters'),
});

export const registerSchema = z
  .object({
    name: z
      .string()
      .min(1, 'Name is required')
      .min(2, 'Name must be at least 2 characters')
      .max(50, 'Name must be less than 50 characters'),
    email: z.email('Please enter a valid email address').min(1, 'Email is required'),
    password: z
      .string()
      .min(1, 'Password is required')
      .min(6, 'Password must be at least 6 characters')
      .max(100, 'Password must be less than 100 characters'),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

// Types
export type LoginFormValues = z.infer<typeof loginSchema>;
export type RegisterFormValues = z.infer<typeof registerSchema>;

// Parsing functions
export function parseLogin(input: LoginFormValues): LoginFormValues {
  return loginSchema.parse({
    email: input.email,
    password: input.password,
  });
}

export function parseRegister(input: RegisterFormValues): RegisterFormValues {
  return registerSchema.parse({
    name: input.name,
    email: input.email,
    password: input.password,
    confirmPassword: input.confirmPassword,
  });
}
