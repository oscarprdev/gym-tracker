import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { authClient } from '@/lib/auth/auth-client';

export function useAuthSession() {
  return useQuery({
    queryKey: ['auth', 'session'],
    queryFn: async () => {
      const session = await authClient.getSession();
      return session;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}

export function useAuthUser() {
  return useQuery({
    queryKey: ['auth', 'user'],
    queryFn: async () => {
      const { data: session } = await authClient.getSession();
      return session?.user || null;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}

export function useSignIn() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      email,
      password,
    }: {
      email: string;
      password: string;
    }) => {
      const result = await authClient.signIn.email({
        email,
        password,
      });
      return result;
    },
    onSuccess: () => {
      // Invalidate and refetch auth queries
      queryClient.invalidateQueries({ queryKey: ['auth'] });
    },
  });
}

export function useSignUp() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      email,
      password,
      name,
    }: {
      email: string;
      password: string;
      name: string;
    }) => {
      const result = await authClient.signUp.email({
        email,
        password,
        name,
      });
      return result;
    },
    onSuccess: () => {
      // Invalidate and refetch auth queries
      queryClient.invalidateQueries({ queryKey: ['auth'] });
    },
  });
}

export function useSignOut() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      await authClient.signOut();
    },
    onSuccess: () => {
      // Clear all auth queries
      queryClient.removeQueries({ queryKey: ['auth'] });
      // Clear all other queries as well since user context changed
      queryClient.clear();
    },
  });
}
