import { apiFetch } from '@/lib/api/client';
import { Address, CreateAddressInput } from '@/types/address';

export const addressesApi = {
  list: () => apiFetch<Address[]>('/addresses'),
  create: (input: CreateAddressInput) => apiFetch<Address>('/addresses', { method: 'POST', body: input }),
  update: (id: string, input: Partial<CreateAddressInput>) =>
    apiFetch<Address>(`/addresses/${id}`, { method: 'PATCH', body: input }),
  remove: (id: string) => apiFetch<void>(`/addresses/${id}`, { method: 'DELETE' }),
};
