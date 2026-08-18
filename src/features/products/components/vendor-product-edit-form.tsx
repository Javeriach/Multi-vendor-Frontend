'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Product } from '@/types/catalog';
import { CategorySelectField } from './category-select-field';
import { ImageUploadField } from './image-upload-field';
import { useUpdateVendorProduct } from '../hooks/use-vendor-products';
import { VendorProductEditFormValues, vendorProductEditSchema } from '../lib/vendor-schemas';

const STATUS_OPTIONS: Product['status'][] = ['draft', 'active', 'inactive', 'archived'];

export function VendorProductEditForm({ product }: { product: Product }) {
  const updateProduct = useUpdateVendorProduct(product.id);

  const form = useForm<VendorProductEditFormValues>({
    resolver: zodResolver(vendorProductEditSchema),
    defaultValues: {
      name: product.name,
      categoryId: product.category.id,
      description: product.description ?? '',
      imageUrls: product.images.map((image) => image.url),
      status: product.status,
    },
  });

  const onSubmit = (values: VendorProductEditFormValues) => {
    updateProduct.mutate({
      name: values.name,
      categoryId: values.categoryId,
      description: values.description || undefined,
      imageUrls: values.imageUrls,
      status: values.status,
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4" noValidate>
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
        <div className="grid grid-cols-2 gap-3">
          <CategorySelectField control={form.control} name="categoryId" />
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {STATUS_OPTIONS.map((status) => (
                      <SelectItem key={status} value={status}>
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea rows={4} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <ImageUploadField control={form.control} name="imageUrls" />
        <Button type="submit" loading={updateProduct.isPending}>
          {updateProduct.isPending ? 'Saving…' : 'Save Changes'}
        </Button>
      </form>
    </Form>
  );
}
