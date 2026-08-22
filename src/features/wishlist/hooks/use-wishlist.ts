'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';

import { useCurrentUser } from '@/features/auth/hooks/use-current-user';
import { ApiError } from '@/lib/api/error';
import { wishlistApi } from '../api/wishlist.api';

const wishlistQueryKey = ['wishlist'] as const;

export function useWishlist() {
  const { isAuthenticated } = useCurrentUser();
  return useQuery({
    queryKey: wishlistQueryKey,
    queryFn: () => wishlistApi.get(),
    enabled: isAuthenticated,
  });
}

export function useIsWishlisted(productId: string) {
  const { data } = useWishlist();
  return !!data?.items.some((item) => item.product.id === productId);
}

export function useToggleWishlist() {
  const queryClient = useQueryClient();
  const { data: wishlist } = useWishlist();

  return useMutation({
    mutationFn: async (productId: string) => {
      const alreadyIn = wishlist?.items.some((item) => item.product.id === productId);
      return alreadyIn ? wishlistApi.remove(productId) : wishlistApi.add(productId);
    },
    onSuccess: (updated, productId) => {
      queryClient.setQueryData(wishlistQueryKey, updated);
      const stillIn = updated.items.some((item) => item.product.id === productId);
      toast.success(stillIn ? 'Added to wishlist' : 'Removed from wishlist');
    },
    onError: (error) => {
      toast.error(error instanceof ApiError ? error.message : 'Something went wrong');
    },
  });
}
