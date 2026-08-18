'use client';

import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { formatMoney } from '@/lib/format';
import { CartItem } from '@/types/cart';

/** Multi-vendor carts settle in one currency today (USD, matching the
 * backend's Stripe integration) — this simply sums selected items'
 * effective price × quantity. */
export function CartSummary({ items }: { items: CartItem[] }) {
  const selected = items.filter((item) => item.selectedForPurchase && item.variant.product.status === 'active');
  const subtotal = selected.reduce((sum, item) => {
    const price = Number(item.variant.discountPrice ?? item.variant.price);
    return sum + price * item.quantity;
  }, 0);
  const itemCount = selected.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Order Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>Items ({itemCount})</span>
          <span>{formatMoney(subtotal)}</span>
        </div>
        <p className="text-xs text-muted-foreground">Shipping and taxes calculated at checkout.</p>
        <Separator />
        <div className="flex justify-between font-semibold">
          <span>Subtotal</span>
          <span>{formatMoney(subtotal)}</span>
        </div>
      </CardContent>
      <CardFooter>
        <Button asChild size="lg" className="w-full" disabled={selected.length === 0}>
          <Link
            href="/checkout"
            aria-disabled={selected.length === 0}
            onClick={(e) => selected.length === 0 && e.preventDefault()}
          >
            Proceed to Checkout
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
