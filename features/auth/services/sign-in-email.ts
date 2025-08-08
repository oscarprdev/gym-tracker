import { auth } from '@/lib/auth/auth';
import { headers } from 'next/headers';

interface SignInEmailInput {
  email: string;
  password: string;
}

export default async function signInEmail({ email, password }: SignInEmailInput) {
  return await auth.api.signInEmail({
    body: {
      email,
      password,
      rememberMe: true,
    },
    headers: await headers(),
  });
}
