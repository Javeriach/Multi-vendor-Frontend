import { publicServerFetch } from '@/lib/api/server';
import { Category } from '@/types/catalog';

/** See products.server-api.ts for why this is split from categories.api.ts. */
export const categoriesServerApi = {
  list: () => publicServerFetch<Category[]>('/categories'),
  bySlug: (slug: string) => publicServerFetch<Category>(`/categories/slug/${slug}`),
};
