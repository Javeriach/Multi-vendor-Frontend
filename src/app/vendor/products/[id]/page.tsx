'use client';

import { useParams } from 'next/navigation';

import { Skeleton } from '@/components/ui/skeleton';
import { ErrorState } from '@/components/shared/error-state';
import { useVendorProduct } from '@/features/products/hooks/use-vendor-products';
import { VendorProductEditForm } from '@/features/products/components/vendor-product-edit-form';
import { VariantManager } from '@/features/products/components/variant-manager';

export default function EditVendorProductPage() {
  const { id } = useParams<{ id: string }>();
  const { data: product, isLoading, isError, refetch } = useVendorProduct(id);

  if (isLoading) {
    return (
      <div className="max-w-2xl space-y-4">
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (isError || !product) {
    return <ErrorState message="We couldn't load this product." onRetry={() => refetch()} />;
  }

  return (
    <div className="max-w-2xl space-y-6">
      <h2 className="text-lg font-semibold">Edit Product</h2>
      <VendorProductEditForm product={product} />
      <VariantManager product={product} />
    </div>
  );
}
