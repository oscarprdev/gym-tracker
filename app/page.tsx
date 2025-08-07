import { requireAuth } from '@/lib/auth/utils';

export default async function Home() {
  await requireAuth();
  return <main>Home</main>;
}
