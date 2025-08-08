'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { RegisterFormValues, registerSchema } from '@/features/auth/validations';
import { useRegister } from './use-auth-mutations';
import { to } from '@/features/shared/utils';

const defaultFormState: RegisterFormValues = {
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
};

interface UseRegisterFormProps {
  onSuccess?: () => void;
}

export function useRegisterForm({ onSuccess }: UseRegisterFormProps = {}) {
  const registerMutation = useRegister();

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: defaultFormState,
    mode: 'onChange',
  });

  const onSubmit = async (data: RegisterFormValues) => {
    const [error] = await to(registerMutation.mutateAsync(data));
    if (error) {
      throw new Error(error.message);
    }
    form.reset();
    onSuccess?.();
  };

  return {
    form,
    onSubmit: form.handleSubmit(onSubmit),
    isPending: registerMutation.isPending,
  };
}
