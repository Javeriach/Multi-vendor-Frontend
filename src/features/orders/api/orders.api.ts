import { apiFetch } from '@/lib/api/client';
import { toSearchParams } from '@/features/products/api/products.api';
import { Paginated } from '@/types/common';
import { CheckoutInput, CheckoutResult, Order, VendorOrder, VendorOrderStatus } from '@/types/order';

export interface VendorOrdersQuery {
  page?: number;
  limit?: number;
  status?: VendorOrderStatus;
}

export interface UpdateVendorOrderStatusInput {
  status: VendorOrderStatus;
  trackingNumber?: string;
  trackingCarrier?: string;
}

export const ordersApi = {
  list: (page = 1) => apiFetch<Paginated<Order>>(`/orders?page=${page}`),
  byId: (id: string) => apiFetch<Order>(`/orders/${id}`),
  checkout: (input: CheckoutInput) => apiFetch<CheckoutResult>('/checkout', { method: 'POST', body: input }),

  // ------------------------------------------------------------- vendor
  vendorList: (query: VendorOrdersQuery = {}) =>
    apiFetch<Paginated<VendorOrder>>(`/vendor/orders${toSearchParams(query)}`),
  vendorById: (id: string) => apiFetch<VendorOrder>(`/vendor/orders/${id}`),
  vendorUpdateStatus: (id: string, input: UpdateVendorOrderStatusInput) =>
    apiFetch<VendorOrder>(`/vendor/orders/${id}/status`, { method: 'PATCH', body: input }),
};
