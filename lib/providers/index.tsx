'use client';

import { QueryProviders } from './query-provider';
import { AuthProvider } from './auth-provider';

interface ProvidersProps {
  children: React.ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <QueryProviders>
      <AuthProvider>{children}</AuthProvider>
    </QueryProviders>
  );
}
