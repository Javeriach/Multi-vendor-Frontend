'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { useCurrentUser } from '@/features/auth/hooks/use-current-user';
import { CheckoutInput } from '@/types/order';
import { ordersApi } from '../api/orders.api';

export function useOrders(page = 1) {
  const { isAuthenticated } = useCurrentUser();
  return useQuery({ queryKey: ['orders', page], queryFn: () => ordersApi.list(page), enabled: isAuthenticated });
}

/**
 * `awaitingPayment` polls briefly after a Stripe redirect back — the
 * webhook that flips paymentStatus to "paid" arrives asynchronously, so the
 * order can still read "pending" for a moment right after checkout.
 */
export function useOrder(id: string, awaitingPayment = false) {
  return useQuery({
    queryKey: ['orders', id],
    queryFn: () => ordersApi.byId(id),
    enabled: !!id,
    refetchInterval: (query) => {
      if (!awaitingPayment) return false;
      return query.state.data?.paymentStatus === 'pending' ? 3000 : false;
    },
  });
}

export function useCheckout() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CheckoutInput) => ordersApi.checkout(input),
    onSuccess: () => {
      // Cart clears server-side only once payment is confirmed (see the
      // backend checkout design), so we deliberately do NOT clear it here —
      // just invalidate so it reflects the reservation next time it's read.
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
  });
}
