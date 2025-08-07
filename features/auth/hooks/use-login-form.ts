'use client';

import { useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { loginSchema, type LoginFormValues } from '@/features/auth/validations';
import { loginAction } from '@/app/(auth)/login/actions';

const defaultFormState = {
  email: '',
  password: '',
};

export function useLoginForm() {
  const [isPending, startTransition] = useTransition();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: defaultFormState,
    mode: 'onChange',
  });

  const onSubmit = (data: LoginFormValues) => {
    startTransition(async () => {
      try {
        const result = await loginAction(data);

        if (result?.error) {
          toast.error(result.error);
        }
      } catch {
        toast.error('An unexpected error occurred');
      }
    });
  };

  return {
    form,
    onSubmit: form.handleSubmit(onSubmit),
    isPending,
  };
}
