'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';

import { ApiError } from '@/lib/api/error';
import { cartApi } from '../api/cart.api';
import { cartQueryKey } from './use-cart';

function useCartMutation<TArgs extends unknown[]>(mutationFn: (...args: TArgs) => ReturnType<typeof cartApi.get>) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (args: TArgs) => mutationFn(...args),
    onSuccess: (cart) => {
      queryClient.setQueryData(cartQueryKey, cart);
    },
    onError: (error) => {
      toast.error(error instanceof ApiError ? error.message : 'Something went wrong');
    },
  });
}

export function useAddToCart() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ variantId, quantity }: { variantId: string; quantity: number }) =>
      cartApi.addItem(variantId, quantity),
    onSuccess: (cart) => {
      queryClient.setQueryData(cartQueryKey, cart);
      toast.success('Added to cart');
    },
    onError: (error) => {
      toast.error(error instanceof ApiError ? error.message : 'Something went wrong');
    },
  });
}

export function useUpdateCartItem() {
  return useCartMutation<[string, { quantity?: number; selectedForPurchase?: boolean }]>(cartApi.updateItem);
}

export function useRemoveCartItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (itemId: string) => cartApi.removeItem(itemId),
    onSuccess: (cart) => {
      queryClient.setQueryData(cartQueryKey, cart);
      toast.success('Removed from cart');
    },
    onError: (error) => {
      toast.error(error instanceof ApiError ? error.message : 'Something went wrong');
    },
  });
}
