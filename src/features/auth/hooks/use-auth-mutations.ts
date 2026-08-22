'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';

import { ApiError } from '@/lib/api/error';
import { authApi, LoginInput, RegisterInput } from '../api/auth.api';
import { currentUserQueryKey } from './use-current-user';

export function useLogin() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: LoginInput) => authApi.login(input),
    onSuccess: ({ user }) => {
      queryClient.setQueryData(currentUserQueryKey, user);
      toast.success('Logged in successfully');
    },
    onError: (error) => {
      toast.error(error instanceof ApiError ? error.message : 'Something went wrong');
    },
  });
}

export function useRegister() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: RegisterInput) => authApi.register(input),
    onSuccess: ({ user }) => {
      queryClient.setQueryData(currentUserQueryKey, user);
      toast.success('Account created successfully');
    },
    onError: (error) => {
      toast.error(error instanceof ApiError ? error.message : 'Something went wrong');
    },
  });
}

export function useLogout() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => authApi.logout(),
    onSuccess: () => {
      queryClient.setQueryData(currentUserQueryKey, null);
      // Cart/wishlist belong to the session that just ended — drop them so
      // the next user (or a logged-out view) never sees stale data.
      queryClient.removeQueries({ queryKey: ['cart'] });
      queryClient.removeQueries({ queryKey: ['wishlist'] });
      queryClient.removeQueries({ queryKey: ['orders'] });
      toast.success('Logged out');
    },
    onError: (error) => {
      toast.error(error instanceof ApiError ? error.message : 'Something went wrong');
    },
  });
}
