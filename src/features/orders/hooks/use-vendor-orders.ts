'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';

import { useCurrentUser } from '@/features/auth/hooks/use-current-user';
import { ApiError } from '@/lib/api/error';
import { ordersApi, UpdateVendorOrderStatusInput, VendorOrdersQuery } from '../api/orders.api';

export function useVendorOrders(query: VendorOrdersQuery = {}) {
  const { user, isAuthenticated } = useCurrentUser();
  return useQuery({
    queryKey: ['vendor-orders', query],
    queryFn: () => ordersApi.vendorList(query),
    enabled: isAuthenticated && user?.role === 'vendor',
    placeholderData: (previous) => previous,
  });
}

export function useVendorOrder(id: string) {
  return useQuery({
    queryKey: ['vendor-orders', id],
    queryFn: () => ordersApi.vendorById(id),
    enabled: !!id,
  });
}

export function useUpdateVendorOrderStatus(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: UpdateVendorOrderStatusInput) => ordersApi.vendorUpdateStatus(id, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vendor-orders'] });
      toast.success('Order status updated');
    },
    onError: (error) => {
      toast.error(error instanceof ApiError ? error.message : 'Something went wrong');
    },
  });
}
