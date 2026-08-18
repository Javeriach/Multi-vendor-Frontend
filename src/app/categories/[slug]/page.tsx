import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

import { ProductGrid } from '@/features/products/components/product-grid';
import { categoriesServerApi } from '@/features/categories/api/categories.server-api';
import { productsServerApi } from '@/features/products/api/products.server-api';
import { ApiError } from '@/lib/api/error';

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
}

async function getCategory(slug: string) {
  try {
    return await categoriesServerApi.bySlug(slug);
  } catch (error) {
    if (error instanceof ApiError && error.statusCode === 404) return null;
    throw error;
  }
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = await getCategory(slug);
  return { title: category?.name ?? 'Category' };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  const category = await getCategory(slug);
  if (!category) notFound();

  const products = await productsServerApi.list({ categoryId: category.id, limit: 24 });

  return (
    <div className="container space-y-6 py-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{category.name}</h1>
        <p className="text-sm text-muted-foreground">{products.meta.total} products</p>
      </div>
      <ProductGrid
        products={products.data}
        emptyTitle="No products in this category yet"
        emptyDescription="Check back soon, or browse other categories."
      />
    </div>
  );
}
