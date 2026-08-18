'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { useCurrentUser } from '@/features/auth/hooks/use-current-user';
import { ApiError } from '@/lib/api/error';
import { CreateAddressInput } from '@/types/address';
import { addressesApi } from '../api/addresses.api';

export const addressesQueryKey = ['addresses'] as const;

export function useAddresses() {
  const { isAuthenticated } = useCurrentUser();
  return useQuery({ queryKey: addressesQueryKey, queryFn: () => addressesApi.list(), enabled: isAuthenticated });
}

export function useCreateAddress() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateAddressInput) => addressesApi.create(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: addressesQueryKey });
      toast.success('Address saved');
    },
    onError: (error) => {
      toast.error(error instanceof ApiError ? error.message : 'Something went wrong');
    },
  });
}

export function useUpdateAddress() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: Partial<CreateAddressInput> }) =>
      addressesApi.update(id, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: addressesQueryKey });
      toast.success('Address updated');
    },
    onError: (error) => {
      toast.error(error instanceof ApiError ? error.message : 'Something went wrong');
    },
  });
}

export function useDeleteAddress() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => addressesApi.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: addressesQueryKey });
      toast.success('Address removed');
    },
    onError: (error) => {
      toast.error(error instanceof ApiError ? error.message : 'Something went wrong');
    },
  });
}
