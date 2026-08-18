export interface Address {
  id: string;
  streetAddress: string;
  city: string;
  area: string;
  country: string;
  postalCode: string;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAddressInput {
  streetAddress: string;
  city: string;
  area: string;
  country: string;
  postalCode: string;
  isDefault?: boolean;
}
