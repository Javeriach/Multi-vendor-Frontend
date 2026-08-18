import { z } from 'zod';

export const addressSchema = z.object({
  streetAddress: z.string().min(1, 'Street address is required'),
  city: z.string().min(1, 'City is required'),
  area: z.string().min(1, 'Area / state is required'),
  country: z.string().min(1, 'Country is required'),
  postalCode: z.string().min(1, 'Postal code is required'),
  isDefault: z.boolean().default(false),
});
export type AddressFormValues = z.infer<typeof addressSchema>;
