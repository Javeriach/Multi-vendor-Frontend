import { apiFetch } from '@/lib/api/client';
import { CreateVendorInput, UpdateStoreInput, VendorProfile } from '@/types/vendor';
import { Store } from '@/types/catalog';

export const vendorsApi = {
  apply: (input: CreateVendorInput) => apiFetch<VendorProfile>('/vendors', { method: 'POST', body: input }),
  me: () => apiFetch<VendorProfile>('/vendors/me'),
  updateStore: (input: UpdateStoreInput) => apiFetch<Store>('/vendors/me', { method: 'PATCH', body: input }),
};
