import { publicServerFetch } from '@/lib/api/server';
import { Paginated } from '@/types/common';
import { Review } from '@/types/review';

/** See products.server-api.ts for why this is split from reviews.api.ts. */
export const reviewsServerApi = {
  forProduct: (productId: string, page = 1) =>
    publicServerFetch<Paginated<Review>>(`/products/${productId}/reviews?page=${page}`),
};
