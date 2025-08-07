'use client';

import { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { registerSchema, type RegisterInput } from '@/features/auth/validations';
import { registerAction } from '@/app/(auth)/login/actions';

export function useRegisterForm() {
  const [isPending, startTransition] = useTransition();
  const [serverError, setServerError] = useState<string | null>(null);

  const form = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
    mode: 'onChange',
  });

  const onSubmit = (data: RegisterInput) => {
    setServerError(null);

    startTransition(async () => {
      try {
        const formData = new FormData();
        formData.append('name', data.name);
        formData.append('email', data.email);
        formData.append('password', data.password);
        formData.append('confirmPassword', data.confirmPassword);

        const result = await registerAction(formData);

        if (result?.error) {
          setServerError(result.error);
          toast.error(result.error);
        }

        if (result?.fieldErrors) {
          Object.entries(result.fieldErrors).forEach(([field, errors]) => {
            if (errors?.[0]) {
              form.setError(field as keyof RegisterInput, {
                message: errors[0],
              });
            }
          });
        }
      } catch (error) {
        console.error('Register error:', error);
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
