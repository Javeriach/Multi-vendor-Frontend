import { apiFetch } from '@/lib/api/client';
import { Wishlist } from '@/types/wishlist';

export const wishlistApi = {
  get: () => apiFetch<Wishlist>('/wishlist'),
  add: (productId: string) => apiFetch<Wishlist>(`/wishlist/${productId}`, { method: 'POST' }),
  remove: (productId: string) => apiFetch<Wishlist>(`/wishlist/${productId}`, { method: 'DELETE' }),
};
