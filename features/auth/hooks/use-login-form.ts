'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, type LoginFormValues } from '@/features/auth/validations';
import { useLogin } from './use-auth-mutations';
import { to } from '@/features/shared/utils';

const defaultFormState: LoginFormValues = {
  email: '',
  password: '',
};

interface UseLoginFormProps {
  onSuccess?: () => void;
}

export function useLoginForm({ onSuccess }: UseLoginFormProps = {}) {
  const loginMutation = useLogin();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: defaultFormState,
    mode: 'onChange',
  });

  const onSubmit = async (data: LoginFormValues) => {
    const [error] = await to(loginMutation.mutateAsync(data));
    if (error) {
      throw new Error(error.message);
    }
    form.reset();
    onSuccess?.();
  };

  return {
    form,
    onSubmit: form.handleSubmit(onSubmit),
    isPending: loginMutation.isPending,
  };
}
