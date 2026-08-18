import type { Metadata } from 'next';

import { QueryPagination } from '@/components/shared/query-pagination';
import { categoriesServerApi } from '@/features/categories/api/categories.server-api';
import { ProductFilters } from '@/features/products/components/product-filters';
import { ProductGrid } from '@/features/products/components/product-grid';
import { productsServerApi } from '@/features/products/api/products.server-api';
import { ProductSort } from '@/types/catalog';

export const metadata: Metadata = { title: 'All Products' };

interface ProductsPageProps {
  searchParams: Promise<{
    page?: string;
    search?: string;
    categoryId?: string;
    minPrice?: string;
    maxPrice?: string;
    sort?: ProductSort;
  }>;
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const params = await searchParams;
  const page = Number(params.page) > 0 ? Number(params.page) : 1;

  const [categories, products] = await Promise.all([
    categoriesServerApi.list(),
    productsServerApi.list({
      page,
      limit: 24,
      search: params.search,
      categoryId: params.categoryId,
      minPrice: params.minPrice ? Number(params.minPrice) : undefined,
      maxPrice: params.maxPrice ? Number(params.maxPrice) : undefined,
      sort: params.sort,
    }),
  ]);

  return (
    <div className="container space-y-6 py-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          {params.search ? `Results for "${params.search}"` : 'All Products'}
        </h1>
        <p className="text-sm text-muted-foreground">{products.meta.total} products</p>
      </div>

      <ProductFilters categories={categories} />

      <ProductGrid
        products={products.data}
        emptyTitle="No products found"
        emptyDescription="Try adjusting your search or filters."
      />

      <QueryPagination meta={products.meta} />
    </div>
  );
}
