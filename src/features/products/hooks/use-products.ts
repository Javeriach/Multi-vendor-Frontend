'use client';

import { useQuery } from '@tanstack/react-query';

import { ProductsQuery } from '@/types/catalog';
import { productsApi } from '../api/products.api';

export function useProducts(query: ProductsQuery) {
  return useQuery({
    queryKey: ['products', query],
    queryFn: () => productsApi.list(query),
    placeholderData: (previous) => previous, // keeps the grid stable while a new page/filter loads
  });
}

export function useProduct(slug: string) {
  return useQuery({
    queryKey: ['products', 'slug', slug],
    queryFn: () => productsApi.bySlug(slug),
    enabled: !!slug,
  });
}
