import { z } from 'zod';

const priceString = z
  .string()
  .min(1, 'Price is required')
  .refine((v) => !Number.isNaN(Number(v)) && Number(v) >= 0, 'Enter a valid price');

const optionalNumberString = z
  .string()
  .optional()
  .refine((v) => !v || (!Number.isNaN(Number(v)) && Number(v) >= 0), 'Enter a valid number');

export const vendorVariantSchema = z.object({
  sku: z.string().min(1, 'SKU is required').max(100),
  /** Free-text "Color: Black, Size: M" — parsed into a Record on submit
   * (`parseAttributes` below) rather than a dynamic key/value sub-form, to
   * keep the variant row compact. */
  attributes: z.string().optional(),
  price: priceString,
  discountPrice: optionalNumberString,
  stockQuantity: optionalNumberString,
});
export type VendorVariantFormValues = z.infer<typeof vendorVariantSchema>;

const imageUrlsSchema = z.array(z.string()).max(6, 'Up to 6 images per product');

export const vendorProductCreateSchema = z.object({
  name: z.string().min(2, 'Name is required').max(255),
  categoryId: z.string().min(1, 'Select a category'),
  description: z.string().max(10000).optional(),
  imageUrls: imageUrlsSchema,
  variants: z.array(vendorVariantSchema).min(1, 'Add at least one variant'),
});
export type VendorProductCreateFormValues = z.infer<typeof vendorProductCreateSchema>;

export const vendorProductEditSchema = z.object({
  name: z.string().min(2, 'Name is required').max(255),
  categoryId: z.string().min(1, 'Select a category'),
  description: z.string().max(10000).optional(),
  imageUrls: imageUrlsSchema,
  status: z.enum(['draft', 'active', 'inactive', 'archived']),
});
export type VendorProductEditFormValues = z.infer<typeof vendorProductEditSchema>;

export function parseAttributes(text?: string): Record<string, string> | undefined {
  if (!text?.trim()) return undefined;
  const entries = text
    .split(',')
    .map((pair) => pair.split(':').map((part) => part.trim()))
    .filter(([key, value]) => key && value) as [string, string][];
  return entries.length ? Object.fromEntries(entries) : undefined;
}

export function formatAttributes(attributes: Record<string, string> | null | undefined): string {
  if (!attributes) return '';
  return Object.entries(attributes)
    .map(([key, value]) => `${key}: ${value}`)
    .join(', ');
}
