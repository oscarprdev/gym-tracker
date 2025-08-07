'use client';

import { useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { registerSchema, type RegisterInput } from '@/features/auth/validations';
import { registerAction } from '@/app/(auth)/register/actions';
import { to } from '@/features/shared/utils';

const defaultFormState: RegisterInput = {
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
};

export function useRegisterForm() {
  const [isPending, startTransition] = useTransition();

  const form = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: defaultFormState,
    mode: 'onChange',
  });

  const onSubmit = (data: RegisterInput) => {
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
