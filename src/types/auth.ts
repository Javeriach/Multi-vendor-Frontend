export type UserRole = 'customer' | 'vendor' | 'admin';
export type VendorStatus = 'pending' | 'approved' | 'rejected' | 'suspended';

export interface Vendor {
  id: string;
  status: VendorStatus;
  businessName: string;
  taxId: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  photoUrl: string | null;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
  vendor?: Vendor | null;
}
