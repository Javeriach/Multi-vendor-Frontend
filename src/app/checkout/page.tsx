'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { MapPin, ShoppingBag } from 'lucide-react';
import toast from 'react-hot-toast';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Skeleton } from '@/components/ui/skeleton';
import { EmptyState } from '@/components/shared/empty-state';
import { ErrorState } from '@/components/shared/error-state';
import { AddressFormDialog } from '@/features/addresses/components/address-form-dialog';
import { useAddresses } from '@/features/addresses/hooks/use-addresses';
import { useCurrentUser } from '@/features/auth/hooks/use-current-user';
import { useCart } from '@/features/cart/hooks/use-cart';
import { CheckoutOrderSummary } from '@/features/orders/components/checkout-order-summary';
import { useCheckout } from '@/features/orders/hooks/use-orders';
import { ApiError } from '@/lib/api/error';

export default function CheckoutPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading } = useCurrentUser();
  const { data: cart, isLoading: cartLoading, isError: cartError, refetch: refetchCart } = useCart();
  const { data: addresses, isLoading: addressesLoading, isError: addressesError, refetch: refetchAddresses } = useAddresses();
  const checkout = useCheckout();

  const [addressId, setAddressId] = useState<string>('');
  const [contactPhone, setContactPhone] = useState('');

  if (!authLoading && !isAuthenticated) {
    return (
      <div className="container max-w-lg py-16">
        <EmptyState
          icon={ShoppingBag}
          title="Sign in to check out"
          description="Log in to complete your purchase."
          actionLabel="Log In"
          actionHref="/login?redirect=/checkout"
        />
      </div>
    );
  }

  if (authLoading || cartLoading || addressesLoading) {
    return (
      <div className="container grid max-w-4xl gap-8 py-8 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          <Skeleton className="h-40 w-full" />
          <Skeleton className="h-24 w-full" />
        </div>
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (cartError) {
    return (
      <div className="container max-w-lg py-16">
        <ErrorState message="We couldn't load your cart." onRetry={() => refetchCart()} />
      </div>
    );
  }

  const selectedItems = (cart?.items ?? []).filter(
    (item) => item.selectedForPurchase && item.variant.product.status === 'active',
  );

  if (selectedItems.length === 0) {
    return (
      <div className="container max-w-lg py-16">
        <EmptyState
          icon={ShoppingBag}
          title="No items selected"
          description="Go back to your cart and select at least one item to check out."
          actionLabel="Go to Cart"
          actionHref="/cart"
        />
      </div>
    );
  }

  const canSubmit = !!addressId && contactPhone.trim().length > 0 && !checkout.isPending;

  const handleSubmit = () => {
    if (!canSubmit) return;
    checkout.mutate(
      { addressId, contactPhone: contactPhone.trim(), paymentMethod: 'card' },
      {
        onSuccess: ({ checkoutUrl }) => {
          if (checkoutUrl) {
            window.location.href = checkoutUrl;
          } else {
            toast.error('Could not start payment. Please try again.');
          }
        },
        onError: (error) => {
          toast.error(error instanceof ApiError ? error.message : 'Something went wrong');
        },
      },
    );
  };

  return (
    <div className="container max-w-4xl space-y-6 py-8">
      <h1 className="text-2xl font-bold tracking-tight">Checkout</h1>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold">Shipping Address</h2>
              <AddressFormDialog
                trigger={
                  <Button type="button" variant="outline" size="sm">
                    Add New
                  </Button>
                }
              />
            </div>

            {addressesError ? (
              <ErrorState message="We couldn't load your addresses." onRetry={() => refetchAddresses()} />
            ) : !addresses || addresses.length === 0 ? (
              <EmptyState
                icon={MapPin}
                title="No addresses saved"
                description="Add a shipping address to continue."
              />
            ) : (
              <RadioGroup value={addressId} onValueChange={setAddressId} className="gap-3">
                {addresses.map((address) => (
                  <Card key={address.id} className={addressId === address.id ? 'border-primary' : undefined}>
                    <CardContent className="flex items-start gap-3 p-4">
                      <RadioGroupItem value={address.id} id={address.id} className="mt-1" />
                      <Label htmlFor={address.id} className="flex-1 cursor-pointer font-normal">
                        <p className="font-medium text-foreground">{address.streetAddress}</p>
                        <p className="text-sm text-muted-foreground">
                          {address.city}, {address.area} {address.postalCode}
                        </p>
                        <p className="text-sm text-muted-foreground">{address.country}</p>
                      </Label>
                    </CardContent>
                  </Card>
                ))}
              </RadioGroup>
            )}
          </section>

          <section className="space-y-2">
            <Label htmlFor="contactPhone">Contact phone</Label>
            <Input
              id="contactPhone"
              type="tel"
              placeholder="+1 555 123 4567"
              value={contactPhone}
              onChange={(e) => setContactPhone(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">Used only if a courier needs to reach you about delivery.</p>
          </section>

          <section className="space-y-2 rounded-lg border p-4">
            <h2 className="font-semibold">Payment</h2>
            <p className="text-sm text-muted-foreground">
              You&apos;ll enter your card details securely on Stripe&apos;s payment page after placing your order.
            </p>
          </section>
        </div>

        <div className="space-y-4">
          <CheckoutOrderSummary items={selectedItems} />
          <Button size="lg" className="w-full" disabled={!canSubmit} loading={checkout.isPending} onClick={handleSubmit}>
            {checkout.isPending ? 'Placing order…' : 'Place Order & Pay'}
          </Button>
        </div>
      </div>
    </div>
  );
}
