import { Store } from './catalog';
import { Vendor, VendorStatus } from './auth';

export type { Vendor, VendorStatus };

/** What `/vendors/me`, `/vendors` (onboard), and `/admin/vendors` return —
 * the base `Vendor` (from `types/auth.ts`, embedded in `User.vendor`) plus
 * the one store every vendor owns (see backend: v1 enforces 1:1). */
export interface VendorProfile extends Vendor {
  stores: Store[];
}

export interface CreateVendorInput {
  businessName: string;
  taxId?: string;
  storeName: string;
  storeSlug?: string;
  description?: string;
  logoUrl?: string;
  bannerUrl?: string;
  contactEmail?: string;
  contactPhone?: string;
}

export interface UpdateStoreInput {
  name?: string;
  description?: string;
  logoUrl?: string;
  bannerUrl?: string;
  contactEmail?: string;
  contactPhone?: string;
}

export interface AdminVendorsQuery {
  page?: number;
  limit?: number;
  status?: VendorStatus;
}
