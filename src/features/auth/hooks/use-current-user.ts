'use client';

import { useQuery } from '@tanstack/react-query';

import { ApiError } from '@/lib/api/error';
import { authApi } from '../api/auth.api';

export const currentUserQueryKey = ['auth', 'me'] as const;

/**
 * The single source of truth for "who is logged in" across the whole app —
 * every place that needs auth state (navbar, protected routes, checkout)
 * reads this hook rather than keeping a parallel copy in a store. A 401
 * here just means "not logged in," not an error to surface.
 */
export function useCurrentUser() {
  const query = useQuery({
    queryKey: currentUserQueryKey,
    queryFn: async () => {
      try {
        const { user } = await authApi.me();
        return user;
      } catch (error) {
        if (error instanceof ApiError && error.statusCode === 401) {
          return null;
        }
        throw error;
      }
    },
    staleTime: 60_000,
  });

  return {
    user: query.data ?? null,
    isLoading: query.isLoading,
    isAuthenticated: !!query.data,
  };
}
