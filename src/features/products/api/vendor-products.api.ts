import { apiFetch } from '@/lib/api/client';
import { Paginated } from '@/types/common';
import { Inventory, Product, ProductsQuery, ProductVariant } from '@/types/catalog';
import { toSearchParams } from './products.api';

export interface VariantInput {
  sku: string;
  attributes?: Record<string, string>;
  price: number;
  discountPrice?: number;
  stockQuantity?: number;
}

export interface CreateProductInput {
  name: string;
  categoryId: string;
  description?: string;
  imageUrls?: string[];
  variants: VariantInput[];
}

export interface UpdateProductInput {
  name?: string;
  categoryId?: string;
  description?: string;
  imageUrls?: string[];
  status?: Product['status'];
}

export const vendorProductsApi = {
  listMine: (query: ProductsQuery = {}) =>
    apiFetch<Paginated<Product>>(`/vendor/products${toSearchParams(query)}`),
  getMine: (id: string) => apiFetch<Product>(`/vendor/products/${id}`),
  create: (input: CreateProductInput) => apiFetch<Product>('/vendor/products', { method: 'POST', body: input }),
  update: (id: string, input: UpdateProductInput) =>
    apiFetch<Product>(`/vendor/products/${id}`, { method: 'PATCH', body: input }),
  remove: (id: string) => apiFetch<void>(`/vendor/products/${id}`, { method: 'DELETE' }),
  addVariant: (productId: string, input: VariantInput) =>
    apiFetch<ProductVariant>(`/vendor/products/${productId}/variants`, { method: 'POST', body: input }),
  updateVariant: (productId: string, variantId: string, input: Partial<VariantInput>) =>
    apiFetch<ProductVariant>(`/vendor/products/${productId}/variants/${variantId}`, {
      method: 'PATCH',
      body: input,
    }),
  removeVariant: (productId: string, variantId: string) =>
    apiFetch<void>(`/vendor/products/${productId}/variants/${variantId}`, { method: 'DELETE' }),
  adjustStock: (productId: string, variantId: string, stockQuantity: number) =>
    apiFetch<Inventory>(`/vendor/products/${productId}/variants/${variantId}/stock`, {
      method: 'PATCH',
      body: { stockQuantity },
    }),
};
