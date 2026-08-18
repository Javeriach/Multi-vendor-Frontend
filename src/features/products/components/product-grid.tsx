import { PackageSearch } from 'lucide-react';

import { EmptyState } from '@/components/shared/empty-state';
import { Product } from '@/types/catalog';
import { ProductCard } from './product-card';
import { ProductCardSkeleton } from './product-card-skeleton';

interface ProductGridProps {
  products?: Product[];
  isLoading?: boolean;
  emptyTitle?: string;
  emptyDescription?: string;
}

export function ProductGrid({
  products,
  isLoading,
  emptyTitle = 'No products found',
  emptyDescription = 'Try adjusting your search or filters.',
}: ProductGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 8 }, (_, i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (!products || products.length === 0) {
    return <EmptyState icon={PackageSearch} title={emptyTitle} description={emptyDescription} />;
  }

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
