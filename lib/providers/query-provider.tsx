'use client';

import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { ReactQueryStreamedHydration } from '@tanstack/react-query-next-experimental';
import { Suspense, useState } from 'react';
import { makeQueryClient } from '@/lib/queries/query-client';

interface QueryProvidersProps {
  children: React.ReactNode;
}

export function QueryProviders({ children }: QueryProvidersProps) {
  const [queryClient] = useState(() => makeQueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <ReactQueryStreamedHydration>
        <Suspense fallback={<div>Loading...</div>}>{children}</Suspense>
      </ReactQueryStreamedHydration>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
