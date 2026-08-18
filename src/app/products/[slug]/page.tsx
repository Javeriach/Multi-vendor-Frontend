import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';

import { Separator } from '@/components/ui/separator';
import { RatingStars } from '@/components/shared/rating-stars';
import { productsServerApi } from '@/features/products/api/products.server-api';
import { ProductGallery } from '@/features/products/components/product-gallery';
import { ProductVariantSelector } from '@/features/products/components/product-variant-selector';
import { WishlistButton } from '@/features/wishlist/components/wishlist-button';
import { ApiError } from '@/lib/api/error';

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

async function getProduct(slug: string) {
  try {
    return await productsServerApi.bySlug(slug);
  } catch (error) {
    if (error instanceof ApiError && error.statusCode === 404) return null;
    throw error;
  }
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) return { title: 'Product' };
  return {
    title: product.name,
    description: product.description ?? undefined,
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) notFound();

  return (
    <div className="container py-8">
      <nav aria-label="Breadcrumb" className="mb-6 text-sm text-muted-foreground">
        <Link href="/" className="hover:text-foreground">Home</Link>
        <span className="mx-2">/</span>
        <Link href={`/categories/${product.category.slug}`} className="hover:text-foreground">
          {product.category.name}
        </Link>
        <span className="mx-2">/</span>
        <span className="text-foreground">{product.name}</span>
      </nav>

      <div className="grid gap-8 lg:grid-cols-2">
        <ProductGallery images={product.images} productName={product.name} />

        <div className="space-y-4">
          <div>
            <span className="text-sm font-medium text-muted-foreground">{product.store.name}</span>
            <h1 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">{product.name}</h1>
            <div className="mt-2">
              <RatingStars rating={Number(product.ratingAverage)} reviewCount={product.reviewCount} />
            </div>
          </div>

          <Separator />

          <ProductVariantSelector product={product} slug={slug} />

          <WishlistButton productId={product.id} className="w-full" />

          {product.description && (
            <>
              <Separator />
              <div className="space-y-2">
                <h2 className="font-semibold">Description</h2>
                <p className="whitespace-pre-line text-sm text-muted-foreground">{product.description}</p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
