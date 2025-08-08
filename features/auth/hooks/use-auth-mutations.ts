'use client';

import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { loginAction } from '@/app/(auth)/login/actions';
import { registerAction } from '@/app/(auth)/register/actions';
import type { LoginFormValues, RegisterFormValues } from '../validations';
import { to } from '@/features/shared/utils';

export function useLogin() {
  return useMutation({
    mutationFn: async (data: LoginFormValues) => {
      const [error] = await to(loginAction(data));
      if (error) {
        throw new Error(error.message);
      }
    },
    onSuccess: () => {
      toast.success('Login successful');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Login failed');
    },
  });
}

export function useRegister() {
  return useMutation({
    mutationFn: async (data: RegisterFormValues) => {
      const [error] = await to(registerAction(data));
      if (error) {
        throw new Error(error.message);
      }
    },
    onSuccess: () => {
      toast.success('Account created successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Registration failed');
    },
  });
}
