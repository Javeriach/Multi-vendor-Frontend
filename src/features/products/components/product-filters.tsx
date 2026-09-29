'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { X } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Category } from '@/types/catalog';
import { CategoryFilter } from './category-filter';
import { PriceRangeFilter } from './price-range-filter';
import { ProductSortSelect } from './product-sort-select';

/** Client-side filter bar for the product listing page. Every control reads
 * and writes URL search params directly so filters are shareable/back-button
 * friendly and the listing page itself stays a Server Component. */
export function ProductFilters({ categories }: { categories: Category[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const hasFilters = ['categoryId', 'minPrice', 'maxPrice', 'search'].some((key) => searchParams.has(key));

  const clear = () => router.push('/products');

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
        <CategoryFilter categories={categories} />
        <PriceRangeFilter />
        {hasFilters && (
          <Button variant="ghost" size="sm" onClick={clear} className="gap-1 text-muted-foreground">
            <X className="h-3.5 w-3.5" />
            Clear filters
          </Button>
        )}
      </div>
      <ProductSortSelect />
    </div>
  );
}
