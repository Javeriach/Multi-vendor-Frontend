'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useApplyVendor } from '../hooks/use-vendor';
import { VendorApplicationFormValues, vendorApplicationSchema } from '../lib/schemas';

/** Applying upgrades the signed-in customer's account into a (pending)
 * vendor in one call — there is no separate "sign up as a seller" account
 * type on the backend, see `POST /vendors`. */
export function VendorApplicationForm() {
  const router = useRouter();
  const applyVendor = useApplyVendor();

  const form = useForm<VendorApplicationFormValues>({
    resolver: zodResolver(vendorApplicationSchema),
    defaultValues: { businessName: '', storeName: '', description: '', contactEmail: '', contactPhone: '' },
  });

  const onSubmit = (values: VendorApplicationFormValues) => {
    applyVendor.mutate(
      {
        businessName: values.businessName,
        storeName: values.storeName,
        description: values.description || undefined,
        contactEmail: values.contactEmail || undefined,
        contactPhone: values.contactPhone || undefined,
      },
      { onSuccess: () => router.push('/vendor') },
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Become a Seller</CardTitle>
        <CardDescription>Tell us about your business and store — an admin will review your application.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4" noValidate>
            <FormField
              control={form.control}
              name="businessName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Business name</FormLabel>
                  <FormControl>
                    <Input placeholder="Acme Trading Co" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="storeName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Store name</FormLabel>
                  <FormControl>
                    <Input placeholder="Acme Store" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Store description (optional)</FormLabel>
                  <FormControl>
                    <Textarea rows={3} placeholder="What do you sell?" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-3">
              <FormField
                control={form.control}
                name="contactEmail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contact email (optional)</FormLabel>
                    <FormControl>
                      <Input type="email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="contactPhone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contact phone (optional)</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <Button type="submit" className="w-full" loading={applyVendor.isPending}>
              {applyVendor.isPending ? 'Submitting…' : 'Submit Application'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
