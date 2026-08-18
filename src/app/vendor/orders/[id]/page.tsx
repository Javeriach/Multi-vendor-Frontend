'use client';

import { useParams } from 'next/navigation';

import { Skeleton } from '@/components/ui/skeleton';
import { ErrorState } from '@/components/shared/error-state';
import { useVendorOrder } from '@/features/orders/hooks/use-vendor-orders';
import { VendorOrderCard } from '@/features/orders/components/vendor-order-card';
import { VendorOrderBuyerCard } from '@/features/orders/components/vendor-order-buyer-card';
import { VendorOrderStatusForm } from '@/features/orders/components/vendor-order-status-form';

export default function VendorOrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data: vendorOrder, isLoading, isError, refetch } = useVendorOrder(id);

  if (isLoading) {
    return (
      <div className="max-w-2xl space-y-4">
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (isError || !vendorOrder) {
    return <ErrorState message="We couldn't load this order." onRetry={() => refetch()} />;
  }

  return (
    <div className="max-w-2xl space-y-6">
      <h2 className="text-lg font-semibold">Order Details</h2>
      {vendorOrder.order && <VendorOrderBuyerCard order={vendorOrder.order} />}
      <VendorOrderCard vendorOrder={vendorOrder} />
      <VendorOrderStatusForm vendorOrder={vendorOrder} />
    </div>
  );
}
