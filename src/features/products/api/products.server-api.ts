import { publicServerFetch } from '@/lib/api/server';
import { Paginated } from '@/types/common';
import { Product, ProductsQuery } from '@/types/catalog';
import { toSearchParams } from './products.api';

/**
 * Split from `products.api.ts` on purpose: this file imports `next/headers`
 * transitively (via `publicServerFetch`), which breaks the build the moment
 * any Client Component pulls it in. Server Components import this file
 * directly; hooks/Client Components must only ever import `products.api.ts`.
 */
export const productsServerApi = {
  list: (query: ProductsQuery = {}) =>
    publicServerFetch<Paginated<Product>>(`/products${toSearchParams(query)}`),
  bySlug: (slug: string) => publicServerFetch<Product>(`/products/slug/${slug}`),
};
