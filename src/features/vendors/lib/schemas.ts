import { z } from 'zod';

export const vendorApplicationSchema = z.object({
  businessName: z.string().min(2, 'Business name is required').max(255),
  storeName: z.string().min(2, 'Store name is required').max(255),
  description: z.string().max(2000).optional(),
  contactEmail: z.string().email('Enter a valid email').optional().or(z.literal('')),
  contactPhone: z.string().max(30).optional(),
});
export type VendorApplicationFormValues = z.infer<typeof vendorApplicationSchema>;

export const storeSettingsSchema = z.object({
  name: z.string().min(2, 'Store name is required').max(255),
  description: z.string().max(2000).optional(),
  logoUrl: z.string().url('Enter a valid URL').optional().or(z.literal('')),
  bannerUrl: z.string().url('Enter a valid URL').optional().or(z.literal('')),
  contactEmail: z.string().email('Enter a valid email').optional().or(z.literal('')),
  contactPhone: z.string().max(30).optional(),
});
export type StoreSettingsFormValues = z.infer<typeof storeSettingsSchema>;
