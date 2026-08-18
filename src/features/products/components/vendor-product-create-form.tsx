'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useFieldArray, useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { Plus, Trash2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { CategorySelectField } from './category-select-field';
import { ImageUploadField } from './image-upload-field';
import { useCreateVendorProduct } from '../hooks/use-vendor-products';
import { parseAttributes, VendorProductCreateFormValues, vendorProductCreateSchema } from '../lib/vendor-schemas';

const emptyVariant = { sku: '', attributes: '', price: '', discountPrice: '', stockQuantity: '' };

export function VendorProductCreateForm() {
  const router = useRouter();
  const createProduct = useCreateVendorProduct();

  const form = useForm<VendorProductCreateFormValues>({
    resolver: zodResolver(vendorProductCreateSchema),
    defaultValues: { name: '', categoryId: '', description: '', imageUrls: [], variants: [emptyVariant] },
  });
  const { fields, append, remove } = useFieldArray({ control: form.control, name: 'variants' });

  const onSubmit = (values: VendorProductCreateFormValues) => {
    createProduct.mutate(
      {
        name: values.name,
        categoryId: values.categoryId,
        description: values.description || undefined,
        imageUrls: values.imageUrls,
        variants: values.variants.map((v) => ({
          sku: v.sku,
          attributes: parseAttributes(v.attributes),
          price: Number(v.price),
          discountPrice: v.discountPrice ? Number(v.discountPrice) : undefined,
          stockQuantity: v.stockQuantity ? Number(v.stockQuantity) : undefined,
        })),
      },
      { onSuccess: (product) => router.push(`/vendor/products/${product.id}`) },
    );
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6" noValidate>
        <Card>
          <CardHeader>
            <CardTitle>Product Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <CategorySelectField control={form.control} name="categoryId" />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description (optional)</FormLabel>
                  <FormControl>
                    <Textarea rows={4} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <ImageUploadField control={form.control} name="imageUrls" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex-row items-center justify-between space-y-0">
            <CardTitle>Variants</CardTitle>
            <Button type="button" variant="outline" size="sm" className="gap-1.5" onClick={() => append(emptyVariant)}>
              <Plus className="h-4 w-4" /> Add Variant
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {form.formState.errors.variants?.root && (
              <p className="text-sm font-medium text-destructive">{form.formState.errors.variants.root.message}</p>
            )}
            {fields.map((variantField, index) => (
              <div key={variantField.id}>
                {index > 0 && <Separator className="mb-4" />}
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
                  <FormField
                    control={form.control}
                    name={`variants.${index}.sku`}
                    render={({ field }) => (
                      <FormItem className="col-span-2 sm:col-span-1">
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
                    name={`variants.${index}.attributes`}
                    render={({ field }) => (
                      <FormItem className="col-span-2 sm:col-span-1">
                        <FormLabel>Attributes</FormLabel>
                        <FormControl>
                          <Input placeholder="Color: Black" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`variants.${index}.price`}
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
                    name={`variants.${index}.discountPrice`}
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
                  <div className="flex items-end gap-2">
                    <FormField
                      control={form.control}
                      name={`variants.${index}.stockQuantity`}
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormLabel>Stock</FormLabel>
                          <FormControl>
                            <Input inputMode="numeric" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    {fields.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        aria-label="Remove variant"
                        onClick={() => remove(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Button type="submit" loading={createProduct.isPending}>
          {createProduct.isPending ? 'Creating…' : 'Create Product'}
        </Button>
      </form>
    </Form>
  );
}
