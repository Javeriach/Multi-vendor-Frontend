import { apiFetch } from '@/lib/api/client';
import { Category } from '@/types/catalog';

export const categoriesApi = {
  list: () => apiFetch<Category[]>('/categories'),
  bySlug: (slug: string) => apiFetch<Category>(`/categories/slug/${slug}`),
};
