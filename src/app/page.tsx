import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, BadgeCheck, Headset, RotateCcw, ShieldCheck } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { HeroCarousel } from '@/components/marketing/hero-carousel';
import { cn } from '@/lib/utils';
import { ProductGrid } from '@/features/products/components/product-grid';
import { categoriesServerApi } from '@/features/categories/api/categories.server-api';
import { productsServerApi } from '@/features/products/api/products.server-api';

export const revalidate = 60;

const TRUST_POINTS = [
  { icon: ShieldCheck, title: 'Verified vendors', description: 'Every seller is reviewed before they can list products.' },
  { icon: BadgeCheck, title: 'Secure checkout', description: 'Your payment details are always protected.' },
  { icon: RotateCcw, title: 'Easy returns', description: "Not the right fit? Send it back, hassle-free." },
  { icon: Headset, title: 'Real support', description: 'Message vendors directly or reach our team any time.' },
] as const;

export default async function HomePage() {
  const [categories, latestProducts] = await Promise.all([
    categoriesServerApi.list().catch(() => []),
    productsServerApi.list({ sort: 'newest', limit: 8 }).catch(() => ({ data: [], meta: { page: 1, limit: 8, total: 0, totalPages: 1 } })),
  ]);

  return (
    <div className="space-y-12 pb-8 sm:space-y-16">
      <HeroCarousel />

      <div className="container space-y-12 sm:space-y-16">
        <section className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {TRUST_POINTS.map(({ icon: Icon, title, description }) => (
            <div key={title} className="flex flex-col items-center gap-2 text-center sm:flex-row sm:items-start sm:text-left">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent text-primary">
                <Icon className="h-5 w-5" aria-hidden="true" />
              </span>
              <div>
                <p className="text-sm font-semibold">{title}</p>
                <p className="hidden text-xs text-muted-foreground sm:block">{description}</p>
              </div>
            </div>
          ))}
        </section>

        {categories.length > 0 && (
          <section className="space-y-4">
            <h2 className="text-xl font-semibold">Shop by category</h2>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
              {categories.map((category) => (
                <Link key={category.id} href={`/categories/${category.slug}`} className="group">
                  <Card className="overflow-hidden border-none shadow-sm transition-all duration-300 group-hover:-translate-y-0.5 group-hover:shadow-lg">
                    <div
                      className="relative flex h-36 items-end justify-center overflow-hidden sm:h-40"
                      style={!category.imageUrl && category.backgroundColor ? { backgroundColor: category.backgroundColor } : undefined}
                    >
                      {category.imageUrl ? (
                        <>
                          <Image
                            src={category.imageUrl}
                            alt=""
                            fill
                            sizes="(min-width: 768px) 16vw, 33vw"
                            className="object-cover transition-transform duration-500 group-hover:scale-110"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent" />
                        </>
                      ) : (
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/15 via-accent to-muted" />
                      )}
                      <span
                        className={cn(
                          'relative z-10 w-full truncate px-3 pb-3 text-center text-base font-semibold',
                          category.imageUrl ? 'text-white drop-shadow-[0_1px_4px_rgba(0,0,0,0.5)]' : 'text-foreground',
                        )}
                      >
                        {category.name}
                      </span>
                    </div>
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
    </div>
  );
}
