import { apiFetch } from '@/lib/api/client';
import { Paginated } from '@/types/common';
import { AdminVendorsQuery, VendorProfile, VendorStatus } from '@/types/vendor';
import { toSearchParams } from '@/features/products/api/products.api';

export const adminVendorsApi = {
  list: (query: AdminVendorsQuery = {}) =>
    apiFetch<Paginated<VendorProfile>>(`/admin/vendors${toSearchParams(query)}`),
  updateStatus: (id: string, status: VendorStatus) =>
    apiFetch<VendorProfile>(`/admin/vendors/${id}/status`, { method: 'PATCH', body: { status } }),
};
