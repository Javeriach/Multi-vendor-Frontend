import { apiFetch } from '@/lib/api/client';
import { Cart } from '@/types/cart';

export const cartApi = {
  get: () => apiFetch<Cart>('/cart'),
  addItem: (variantId: string, quantity: number) =>
    apiFetch<Cart>('/cart/items', { method: 'POST', body: { variantId, quantity } }),
  updateItem: (itemId: string, input: { quantity?: number; selectedForPurchase?: boolean }) =>
    apiFetch<Cart>(`/cart/items/${itemId}`, { method: 'PATCH', body: input }),
  removeItem: (itemId: string) => apiFetch<Cart>(`/cart/items/${itemId}`, { method: 'DELETE' }),
  clear: () => apiFetch<Cart>('/cart', { method: 'DELETE' }),
};
