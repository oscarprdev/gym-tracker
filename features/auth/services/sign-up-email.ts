import { auth } from '@/lib/auth/auth';

interface SignUpEmail {
  name: string;
  email: string;
  password: string;
}

export default async function signUpEmail({ name, email, password }: SignUpEmail) {
  return auth.api.signUpEmail({
    body: {
      name,
      email,
      password,
    },
  });
}
