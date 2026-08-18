'use client';

import { Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Package } from 'lucide-react';

import { Skeleton } from '@/components/ui/skeleton';
import { EmptyState } from '@/components/shared/empty-state';
import { ErrorState } from '@/components/shared/error-state';
import { QueryPagination } from '@/components/shared/query-pagination';
import { useCurrentUser } from '@/features/auth/hooks/use-current-user';
import { OrderListItem } from '@/features/orders/components/order-list-item';
import { useOrders } from '@/features/orders/hooks/use-orders';

function OrdersList() {
  const { isAuthenticated, isLoading: authLoading } = useCurrentUser();
  const searchParams = useSearchParams();
  const page = Number(searchParams.get('page')) > 0 ? Number(searchParams.get('page')) : 1;
  const { data: orders, isLoading, isError, refetch } = useOrders(page);

  if (!authLoading && !isAuthenticated) {
    return (
      <EmptyState
        icon={Package}
        title="Sign in to view your orders"
        description="Log in to see your order history."
        actionLabel="Log In"
        actionHref="/login?redirect=/orders"
      />
    );
  }

  if (isLoading || authLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 3 }, (_, i) => (
          <Skeleton key={i} className="h-24 w-full" />
        ))}
      </div>
    );
  }

  if (isError) {
    return <ErrorState message="We couldn't load your orders." onRetry={() => refetch()} />;
  }

  if (!orders || orders.data.length === 0) {
    return (
      <EmptyState
        icon={Package}
        title="No orders yet"
        description="Your order history will show up here once you make a purchase."
        actionLabel="Start Shopping"
        actionHref="/products"
      />
    );
  }

  return (
    <div className="space-y-4">
      <div className="space-y-3">
        {orders.data.map((order) => (
          <OrderListItem key={order.id} order={order} />
        ))}
      </div>
      <QueryPagination meta={orders.meta} />
    </div>
  );
}

export default function OrdersPage() {
  return (
    <div className="container max-w-3xl space-y-6 py-8">
      <h1 className="text-2xl font-bold tracking-tight">My Orders</h1>
      <Suspense fallback={<Skeleton className="h-24 w-full" />}>
        <OrdersList />
      </Suspense>
    </div>
  );
}
