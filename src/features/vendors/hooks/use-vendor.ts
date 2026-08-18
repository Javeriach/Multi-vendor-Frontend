'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { currentUserQueryKey, useCurrentUser } from '@/features/auth/hooks/use-current-user';
import { ApiError } from '@/lib/api/error';
import { CreateVendorInput, UpdateStoreInput } from '@/types/vendor';
import { vendorsApi } from '../api/vendors.api';

export const myVendorQueryKey = ['vendors', 'me'] as const;

/** Only fetches once the account is actually flagged as a vendor
 * (`user.role === 'vendor'`) — a plain customer has no `/vendors/me` row and
 * the request would just 404. */
export function useMyVendor() {
  const { user, isAuthenticated } = useCurrentUser();
  return useQuery({
    queryKey: myVendorQueryKey,
    queryFn: () => vendorsApi.me(),
    enabled: isAuthenticated && user?.role === 'vendor',
  });
}

export function useApplyVendor() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateVendorInput) => vendorsApi.apply(input),
    onSuccess: (vendor) => {
      queryClient.setQueryData(myVendorQueryKey, vendor);
      // The apply call flips the account's role to "vendor" server-side —
      // refetch /auth/me so the navbar and role-gated routes see it too.
      queryClient.invalidateQueries({ queryKey: currentUserQueryKey });
      toast.success('Application submitted — waiting on admin approval.');
    },
    onError: (error) => {
      toast.error(error instanceof ApiError ? error.message : 'Something went wrong');
    },
  });
}

export function useUpdateStore() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: UpdateStoreInput) => vendorsApi.updateStore(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: myVendorQueryKey });
      toast.success('Store settings saved');
    },
    onError: (error) => {
      toast.error(error instanceof ApiError ? error.message : 'Something went wrong');
    },
  });
}
