'use client';

import { Suspense } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import { CheckCircle2, PackageSearch } from 'lucide-react';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { EmptyState } from '@/components/shared/empty-state';
import { ErrorState } from '@/components/shared/error-state';
import { StatusBadge } from '@/components/shared/status-badge';
import { VendorOrderCard } from '@/features/orders/components/vendor-order-card';
import { useOrder } from '@/features/orders/hooks/use-orders';
import { formatDateTime, formatMoney } from '@/lib/format';

function OrderDetail() {
  const params = useParams<{ id: string }>();
  const searchParams = useSearchParams();
  const paymentResult = searchParams.get('payment');

  const { data: order, isLoading, isError, refetch } = useOrder(params.id, paymentResult === 'success');

  if (isLoading) {
    return (
      <div className="container max-w-3xl space-y-4 py-8">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-48 w-full" />
      </div>
    );
  }

  if (isError || !order) {
    return (
      <div className="container max-w-3xl py-8">
        <ErrorState title="Order not found" message="We couldn't load this order." onRetry={() => refetch()} />
      </div>
    );
  }

  const isConfirmingPayment = paymentResult === 'success' && order.paymentStatus === 'pending';

  return (
    <div className="container max-w-3xl space-y-6 py-8">
      {paymentResult === 'success' && order.paymentStatus === 'paid' && (
        <Alert variant="success">
          <CheckCircle2 className="h-4 w-4" />
          <AlertTitle>Payment successful</AlertTitle>
          <AlertDescription>Thanks for your order — a confirmation has been recorded.</AlertDescription>
        </Alert>
      )}

      {isConfirmingPayment && (
        <Alert>
          <AlertTitle>Confirming your payment…</AlertTitle>
          <AlertDescription>This usually takes a few seconds. This page will update automatically.</AlertDescription>
        </Alert>
      )}

      {paymentResult === 'cancelled' && (
        <Alert variant="destructive">
          <AlertTitle>Payment was cancelled</AlertTitle>
          <AlertDescription>Your order hasn&apos;t been paid for yet.</AlertDescription>
        </Alert>
      )}

      <div>
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight">Order {order.orderNumber}</h1>
          <StatusBadge status={order.paymentStatus} />
        </div>
        <p className="text-sm text-muted-foreground">Placed {formatDateTime(order.createdAt)}</p>
      </div>

      <div className="space-y-4">
        {order.vendorOrders.map((vendorOrder) => (
          <VendorOrderCard key={vendorOrder.id} vendorOrder={vendorOrder} />
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Shipping & Payment</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-6 sm:grid-cols-2">
          <div className="space-y-1 text-sm">
            <p className="font-medium text-foreground">Shipping to {order.shippingName}</p>
            <p className="text-muted-foreground">{order.shippingStreetAddress}</p>
            <p className="text-muted-foreground">
              {order.shippingCity}, {order.shippingArea} {order.shippingPostalCode}
            </p>
            <p className="text-muted-foreground">{order.shippingCountry}</p>
            <p className="text-muted-foreground">{order.shippingPhone}</p>
          </div>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Subtotal</span>
              <span>{formatMoney(order.subtotal, order.currency)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Shipping</span>
              <span>{formatMoney(order.shippingTotal, order.currency)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Tax</span>
              <span>{formatMoney(order.taxTotal, order.currency)}</span>
            </div>
            <Separator className="my-2" />
            <div className="flex justify-between font-semibold">
              <span>Total</span>
              <span>{formatMoney(order.total, order.currency)}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function OrderDetailPage() {
  return (
    <Suspense
      fallback={
        <div className="container max-w-3xl py-8">
          <EmptyState icon={PackageSearch} title="Loading order…" />
        </div>
      }
    >
      <OrderDetail />
    </Suspense>
  );
}
