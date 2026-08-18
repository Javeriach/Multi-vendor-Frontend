'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { ShoppingBag } from 'lucide-react';

import { Skeleton } from '@/components/ui/skeleton';
import { EmptyState } from '@/components/shared/empty-state';
import { ErrorState } from '@/components/shared/error-state';
import { QueryPagination } from '@/components/shared/query-pagination';
import { useVendorOrders } from '@/features/orders/hooks/use-vendor-orders';
import { VendorOrderListItem } from '@/features/orders/components/vendor-order-list-item';

function VendorOrdersList() {
  const searchParams = useSearchParams();
  const page = Number(searchParams.get('page')) > 0 ? Number(searchParams.get('page')) : 1;
  const { data: orders, isLoading, isError, refetch } = useVendorOrders({ page });

  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 3 }, (_, i) => (
          <Skeleton key={i} className="h-20 w-full" />
        ))}
      </div>
    );
  }

  if (isError) {
    return <ErrorState message="We couldn't load your orders." onRetry={() => refetch()} />;
  }

  if (!orders || orders.data.length === 0) {
    return <EmptyState icon={ShoppingBag} title="No orders yet" description="Orders containing your products will show up here." />;
  }

  return (
    <div className="space-y-4">
      <div className="space-y-3">
        {orders.data.map((vendorOrder) => (
          <VendorOrderListItem key={vendorOrder.id} vendorOrder={vendorOrder} />
        ))}
      </div>
      <QueryPagination meta={orders.meta} />
    </div>
  );
}

export default function VendorOrdersPage() {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Orders</h2>
      <Suspense fallback={<Skeleton className="h-20 w-full" />}>
        <VendorOrdersList />
      </Suspense>
    </div>
  );
}
