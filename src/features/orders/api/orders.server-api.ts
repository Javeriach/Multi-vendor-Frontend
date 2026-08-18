import { serverApiFetch } from '@/lib/api/server';
import { Paginated } from '@/types/common';
import { Order } from '@/types/order';

/** See products.server-api.ts for why this is split from orders.api.ts. */
export const ordersServerApi = {
  list: (page = 1) => serverApiFetch<Paginated<Order>>(`/orders?page=${page}`),
  byId: (id: string) => serverApiFetch<Order>(`/orders/${id}`),
};
