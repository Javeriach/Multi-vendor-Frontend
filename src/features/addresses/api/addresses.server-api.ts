import { serverApiFetch } from '@/lib/api/server';
import { Address } from '@/types/address';

/** See products.server-api.ts for why this is split from addresses.api.ts. */
export const addressesServerApi = {
  list: () => serverApiFetch<Address[]>('/addresses'),
};
