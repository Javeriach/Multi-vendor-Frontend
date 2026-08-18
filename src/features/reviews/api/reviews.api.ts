import { apiFetch } from '@/lib/api/client';
import { Paginated } from '@/types/common';
import { CreateReviewInput, Review } from '@/types/review';

export const reviewsApi = {
  forProduct: (productId: string, page = 1) =>
    apiFetch<Paginated<Review>>(`/products/${productId}/reviews?page=${page}`),
  create: (productId: string, input: CreateReviewInput) =>
    apiFetch<Review>(`/products/${productId}/reviews`, { method: 'POST', body: input }),
  update: (reviewId: string, input: CreateReviewInput) =>
    apiFetch<Review>(`/reviews/${reviewId}`, { method: 'PATCH', body: input }),
  remove: (reviewId: string) => apiFetch<void>(`/reviews/${reviewId}`, { method: 'DELETE' }),
};
