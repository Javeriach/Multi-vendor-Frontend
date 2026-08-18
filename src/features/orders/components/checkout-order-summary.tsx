'use client';

import Image from 'next/image';
import { ImageOff } from 'lucide-react';

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { formatMoney } from '@/lib/format';
import { CartItem } from '@/types/cart';

/** Read-only mirror of how the backend groups a checkout by store — every
 * VendorOrder becomes its own line group so the buyer sees, before paying,
 * the same split their order will settle into. */
export function CheckoutOrderSummary({ items }: { items: CartItem[] }) {
  const groups = new Map<string, { storeName: string; items: CartItem[] }>();
  items.forEach((item) => {
    const storeId = item.variant.product.store.id;
    if (!groups.has(storeId)) groups.set(storeId, { storeName: item.variant.product.store.name, items: [] });
    groups.get(storeId)!.items.push(item);
  });

  const subtotal = items.reduce((sum, item) => {
    const price = Number(item.variant.discountPrice ?? item.variant.price);
    return sum + price * item.quantity;
  }, 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Order Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {Array.from(groups.values()).map((group) => (
          <div key={group.storeName} className="space-y-2">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{group.storeName}</p>
            {group.items.map((item) => {
              const image = item.variant.product.images[0];
              const price = Number(item.variant.discountPrice ?? item.variant.price);
              return (
                <div key={item.id} className="flex items-center gap-3">
                  <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded bg-muted">
                    {image ? (
                      <Image src={image.url} alt={item.variant.product.name} fill sizes="48px" className="object-cover" />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                        <ImageOff className="h-4 w-4" aria-hidden="true" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 text-sm">
                    <p className="line-clamp-1 font-medium">{item.variant.product.name}</p>
                    <p className="text-xs text-muted-foreground">Qty {item.quantity}</p>
                  </div>
                  <p className="text-sm font-medium">{formatMoney(price * item.quantity)}</p>
                </div>
              );
            })}
          </div>
        ))}
      </CardContent>
      <CardFooter className="flex-col items-stretch gap-2">
        <Separator />
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>Shipping</span>
          <span>Calculated after order placement</span>
        </div>
        <div className="flex justify-between font-semibold">
          <span>Total</span>
          <span>{formatMoney(subtotal)}</span>
        </div>
      </CardFooter>
    </Card>
  );
}
