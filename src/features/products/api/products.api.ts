import { apiFetch } from '@/lib/api/client';
import { Paginated } from '@/types/common';
import { Product, ProductsQuery } from '@/types/catalog';

function toSearchParams<T extends object>(query: T): string {
  const params = new URLSearchParams();
  Object.entries(query).forEach(([key, value]) => {
    if (value !== undefined && value !== '') params.set(key, String(value));
  });
  const qs = params.toString();
  return qs ? `?${qs}` : '';
}

export const productsApi = {
  list: (query: ProductsQuery = {}) => apiFetch<Paginated<Product>>(`/products${toSearchParams(query)}`),
  bySlug: (slug: string) => apiFetch<Product>(`/products/slug/${slug}`),
};

export { toSearchParams };
