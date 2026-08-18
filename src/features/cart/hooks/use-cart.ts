'use client';

import { useQuery } from '@tanstack/react-query';

import { useCurrentUser } from '@/features/auth/hooks/use-current-user';
import { cartApi } from '../api/cart.api';

export const cartQueryKey = ['cart'] as const;

export function useCart() {
  const { isAuthenticated } = useCurrentUser();

  return useQuery({
    queryKey: cartQueryKey,
    queryFn: () => cartApi.get(),
    enabled: isAuthenticated, // no session, no cart — avoids a guaranteed 401 on every page load
  });
}
