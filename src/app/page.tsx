import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ProductGrid } from '@/features/products/components/product-grid';
import { categoriesServerApi } from '@/features/categories/api/categories.server-api';
import { productsServerApi } from '@/features/products/api/products.server-api';

export const revalidate = 60;

export default async function HomePage() {
  const [categories, latestProducts] = await Promise.all([
    categoriesServerApi.list().catch(() => []),
    productsServerApi.list({ sort: 'newest', limit: 8 }).catch(() => ({ data: [], meta: { page: 1, limit: 8, total: 0, totalPages: 1 } })),
  ]);

  return (
    <div className="container space-y-12 py-8">
      <section className="rounded-2xl bg-gradient-to-br from-primary/10 via-primary/5 to-transparent p-8 sm:p-12">
        <div className="max-w-xl space-y-4">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Shop from independent stores, all in one place
          </h1>
          <p className="text-muted-foreground">
            Every purchase supports a real vendor. Browse the marketplace and find something you&apos;ll love.
          </p>
          <Button asChild size="lg">
            <Link href="/products">
              Browse all products <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>

      {categories.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">Shop by category</h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            {categories.map((category) => (
              <Link key={category.id} href={`/categories/${category.slug}`}>
                <Card
                  className="flex h-24 items-center justify-center p-3 text-center text-sm font-medium transition-colors hover:border-primary hover:bg-accent"
                  style={category.backgroundColor ? { backgroundColor: category.backgroundColor } : undefined}
                >
                  {category.name}
                </Card>
              </Link>
            ))}
          </div>
        </section>
      )}

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Newest arrivals</h2>
          <Button variant="link" asChild className="gap-1">
            <Link href="/products">
              View all <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </Button>
        </div>
        <ProductGrid
          products={latestProducts.data}
          emptyTitle="No products yet"
          emptyDescription="Check back soon — vendors are still setting up their stores."
        />
      </section>
    </div>
  );
}
