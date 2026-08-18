'use client';

import { Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Package, Plus } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { EmptyState } from '@/components/shared/empty-state';
import { ErrorState } from '@/components/shared/error-state';
import { QueryPagination } from '@/components/shared/query-pagination';
import { useVendorProducts } from '@/features/products/hooks/use-vendor-products';
import { VendorProductListItem } from '@/features/products/components/vendor-product-list-item';

function VendorProductsList() {
  const searchParams = useSearchParams();
  const page = Number(searchParams.get('page')) > 0 ? Number(searchParams.get('page')) : 1;
  const { data: products, isLoading, isError, refetch } = useVendorProducts({ page });

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
    return <ErrorState message="We couldn't load your products." onRetry={() => refetch()} />;
  }

  if (!products || products.data.length === 0) {
    return (
      <EmptyState
        icon={Package}
        title="No products yet"
        description="Add your first product to start selling."
        actionLabel="Add a Product"
        actionHref="/vendor/products/new"
      />
    );
  }

  return (
    <div className="space-y-4">
      <div className="space-y-3">
        {products.data.map((product) => (
          <VendorProductListItem key={product.id} product={product} />
        ))}
      </div>
      <QueryPagination meta={products.meta} />
    </div>
  );
}

export default function VendorProductsPage() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Products</h2>
        <Button asChild size="sm" className="gap-1.5">
          <Link href="/vendor/products/new">
            <Plus className="h-4 w-4" /> Add Product
          </Link>
        </Button>
      </div>
      <Suspense fallback={<Skeleton className="h-20 w-full" />}>
        <VendorProductsList />
      </Suspense>
    </div>
  );
}
