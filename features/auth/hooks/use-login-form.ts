'use client';

import { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { loginSchema, type LoginInput } from '@/features/auth/validations';
import { loginAction } from '@/app/(auth)/login/actions';

export function useLoginForm() {
  const [isPending, startTransition] = useTransition();
  const [serverError, setServerError] = useState<string | null>(null);

  const form = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
    mode: 'onChange',
  });

  const onSubmit = (data: LoginInput) => {
    setServerError(null);

    startTransition(async () => {
      try {
        const formData = new FormData();
        formData.append('email', data.email);
        formData.append('password', data.password);

        const result = await loginAction(formData);

        if (result?.error) {
          setServerError(result.error);
          toast.error(result.error);
        }

        if (result?.fieldErrors) {
          Object.entries(result.fieldErrors).forEach(([field, errors]) => {
            if (errors?.[0]) {
              form.setError(field as keyof LoginInput, {
                message: errors[0],
              });
            }
          });
        }
      } catch (error) {
        console.error('Login error:', error);
        setServerError('An unexpected error occurred');
        toast.error('An unexpected error occurred');
      }
    });
  };

  return {
    form,
    onSubmit: form.handleSubmit(onSubmit),
    isPending,
    serverError,
  };
}
