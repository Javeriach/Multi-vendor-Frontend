'use client';

import Link from 'next/link';
import { Clock, Package, ShoppingBag } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useVendorProducts } from '@/features/products/hooks/use-vendor-products';
import { useVendorOrders } from '@/features/orders/hooks/use-vendor-orders';

function StatCard({ icon: Icon, label, value, isLoading }: { icon: typeof Package; label: string; value: number; isLoading: boolean }) {
  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{label}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
      </CardHeader>
      <CardContent>{isLoading ? <Skeleton className="h-8 w-16" /> : <p className="text-3xl font-bold">{value}</p>}</CardContent>
    </Card>
  );
}

export default function VendorOverviewPage() {
  const { data: allProducts, isLoading: productsLoading } = useVendorProducts({ limit: 1 });
  const { data: activeProducts, isLoading: activeLoading } = useVendorProducts({ limit: 1, status: 'active' });
  const { data: allOrders, isLoading: ordersLoading } = useVendorOrders({ limit: 1 });
  const { data: processingOrders, isLoading: processingLoading } = useVendorOrders({ limit: 1, status: 'processing' });

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard icon={Package} label="Total Products" value={allProducts?.meta.total ?? 0} isLoading={productsLoading} />
        <StatCard icon={Package} label="Active Products" value={activeProducts?.meta.total ?? 0} isLoading={activeLoading} />
        <StatCard icon={ShoppingBag} label="Total Orders" value={allOrders?.meta.total ?? 0} isLoading={ordersLoading} />
        <StatCard icon={Clock} label="Awaiting Fulfillment" value={processingOrders?.meta.total ?? 0} isLoading={processingLoading} />
      </div>

      <div className="flex flex-wrap gap-3">
        <Button asChild>
          <Link href="/vendor/products/new">Add a Product</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/vendor/orders">View Orders</Link>
        </Button>
      </div>
    </div>
  );
}
