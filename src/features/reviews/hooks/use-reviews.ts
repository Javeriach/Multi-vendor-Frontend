'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { ApiError } from '@/lib/api/error';
import { CreateReviewInput } from '@/types/review';
import { reviewsApi } from '../api/reviews.api';

export function useProductReviews(productId: string, page = 1) {
  return useQuery({
    queryKey: ['reviews', productId, page],
    queryFn: () => reviewsApi.forProduct(productId, page),
    enabled: !!productId,
  });
}

export function useCreateReview(productId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateReviewInput) => reviewsApi.create(productId, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews', productId] });
      queryClient.invalidateQueries({ queryKey: ['products', 'slug'] });
      toast.success('Thanks for your review!');
    },
    onError: (error) => {
      toast.error(error instanceof ApiError ? error.message : 'Something went wrong');
    },
  });
}
