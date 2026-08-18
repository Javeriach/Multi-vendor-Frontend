'use client';

import { ReactNode, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { ProductVariant } from '@/types/catalog';
import { useAddVariant, useUpdateVariant } from '../hooks/use-vendor-products';
import { formatAttributes, parseAttributes, vendorVariantSchema, VendorVariantFormValues } from '../lib/vendor-schemas';

interface VariantFormDialogProps {
  trigger: ReactNode;
  productId: string;
  variant?: ProductVariant;
}

/** One dialog for both "add variant" and "edit variant" — stock is edited
 * here too (via `PATCH .../variants/:id`, which accepts `stockQuantity`
 * same as the create DTO) rather than a separate stock-only dialog, since a
 * vendor adjusting price/attributes is very often also correcting stock in
 * the same pass. */
export function VariantFormDialog({ trigger, productId, variant }: VariantFormDialogProps) {
  const [open, setOpen] = useState(false);
  const addVariant = useAddVariant(productId);
  const updateVariant = useUpdateVariant(productId);
  const isEditing = !!variant;
  const isPending = addVariant.isPending || updateVariant.isPending;

  const defaults = (): VendorVariantFormValues =>
    variant
      ? {
          sku: variant.sku,
          attributes: formatAttributes(variant.attributes),
          price: variant.price,
          discountPrice: variant.discountPrice ?? '',
          stockQuantity: String(variant.inventory?.stockQuantity ?? 0),
        }
      : { sku: '', attributes: '', price: '', discountPrice: '', stockQuantity: '' };

  const form = useForm<VendorVariantFormValues>({
    resolver: zodResolver(vendorVariantSchema),
    defaultValues: defaults(),
  });

  const onSubmit = (values: VendorVariantFormValues) => {
    const input = {
      sku: values.sku,
      attributes: parseAttributes(values.attributes),
      price: Number(values.price),
      discountPrice: values.discountPrice ? Number(values.discountPrice) : undefined,
      stockQuantity: values.stockQuantity ? Number(values.stockQuantity) : undefined,
    };
    const onSuccess = () => setOpen(false);
    if (isEditing) {
      updateVariant.mutate({ variantId: variant.id, input }, { onSuccess });
    } else {
      addVariant.mutate(input, { onSuccess });
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (next) form.reset(defaults());
      }}
    >
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit Variant' : 'Add Variant'}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4" noValidate>
            <FormField
              control={form.control}
              name="sku"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>SKU</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="attributes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Attributes (optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="Color: Black, Size: M" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-3 gap-3">
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price</FormLabel>
                    <FormControl>
                      <Input inputMode="decimal" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="discountPrice"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sale price</FormLabel>
                    <FormControl>
                      <Input inputMode="decimal" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="stockQuantity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Stock</FormLabel>
                    <FormControl>
                      <Input inputMode="numeric" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter>
              <Button type="submit" loading={isPending}>
                {isPending ? 'Saving…' : 'Save Variant'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
