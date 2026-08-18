'use client';

import Link from 'next/link';
import { ShoppingBag } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { EmptyState } from '@/components/shared/empty-state';
import { ErrorState } from '@/components/shared/error-state';
import { useCurrentUser } from '@/features/auth/hooks/use-current-user';
import { useCart } from '@/features/cart/hooks/use-cart';
import { CartItemRow } from '@/features/cart/components/cart-item-row';
import { CartSummary } from '@/features/cart/components/cart-summary';

export default function CartPage() {
  const { isAuthenticated, isLoading: authLoading } = useCurrentUser();
  const { data: cart, isLoading, isError, refetch } = useCart();

  return (
    <div className="container max-w-5xl space-y-6 py-8">
      <h1 className="text-2xl font-bold tracking-tight">Shopping Cart</h1>

      {!authLoading && !isAuthenticated ? (
        <EmptyState
          icon={ShoppingBag}
          title="Sign in to view your cart"
          description="Log in to see items you've added and continue checkout."
          actionLabel="Log In"
          actionHref="/login?redirect=/cart"
        />
      ) : isLoading || authLoading ? (
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="space-y-4 lg:col-span-2">
            {Array.from({ length: 3 }, (_, i) => (
              <Skeleton key={i} className="h-24 w-full" />
            ))}
          </div>
          <Skeleton className="h-64 w-full" />
        </div>
      ) : isError ? (
        <ErrorState message="We couldn't load your cart." onRetry={() => refetch()} />
      ) : !cart || cart.items.length === 0 ? (
        <EmptyState
          icon={ShoppingBag}
          title="Your cart is empty"
          description="Browse products and add something you like."
          actionLabel="Start Shopping"
          actionHref="/products"
        />
      ) : (
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="divide-y lg:col-span-2">
            {cart.items.map((item) => (
              <CartItemRow key={item.id} item={item} />
            ))}
          </div>
          <div className="space-y-4">
            <CartSummary items={cart.items} />
            <Separator className="lg:hidden" />
            <Button asChild variant="link" className="px-0">
              <Link href="/products">Continue shopping</Link>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
