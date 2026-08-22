'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';

import { useCurrentUser } from '@/features/auth/hooks/use-current-user';
import { ApiError } from '@/lib/api/error';
import { AdminVendorsQuery, VendorStatus } from '@/types/vendor';
import { adminVendorsApi } from '../api/admin-vendors.api';

export function useAdminVendors(query: AdminVendorsQuery) {
  const { user, isAuthenticated } = useCurrentUser();
  return useQuery({
    queryKey: ['admin', 'vendors', query],
    queryFn: () => adminVendorsApi.list(query),
    enabled: isAuthenticated && user?.role === 'admin',
    placeholderData: (previous) => previous,
  });
}

export function useUpdateVendorStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: VendorStatus }) => adminVendorsApi.updateStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'vendors'] });
      toast.success('Vendor status updated');
    },
    onError: (error) => {
      toast.error(error instanceof ApiError ? error.message : 'Something went wrong');
    },
  });
}
