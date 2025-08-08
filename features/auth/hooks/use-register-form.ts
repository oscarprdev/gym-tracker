'use client';

import { useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { RegisterFormValues, registerSchema } from '@/features/auth/validations';
import { registerAction } from '@/app/(auth)/register/actions';
import { to } from '@/features/shared/utils';

const defaultFormState: RegisterFormValues = {
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
};

export function useRegisterForm() {
  const [isPending, startTransition] = useTransition();

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: defaultFormState,
    mode: 'onChange',
  });

  const onSubmit = (data: RegisterFormValues) => {
    startTransition(async () => {
      const [error, result] = await to(registerAction(data));

      if (error || result?.error) {
        toast.error(error?.message || result?.error || 'An unexpected error occurred');
      }
    });
  };

  return {
    form,
    onSubmit: form.handleSubmit(onSubmit),
    isPending,
  };
}
