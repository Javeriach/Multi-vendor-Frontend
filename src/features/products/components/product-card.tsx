'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Heart, ImageOff } from 'lucide-react';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PriceDisplay } from '@/components/shared/price-display';
import { RatingStars } from '@/components/shared/rating-stars';
import { useCurrentUser } from '@/features/auth/hooks/use-current-user';
import { useIsWishlisted, useToggleWishlist } from '@/features/wishlist/hooks/use-wishlist';
import { Product } from '@/types/catalog';
import { cn } from '@/lib/utils';
import { getDisplayVariant } from '../lib/pricing';

interface ProductCardProps {
  product: Product;
  className?: string;
}

/**
 * The one card used everywhere a product appears in a grid — home,
 * category pages, search results, wishlist. Differences between those
 * contexts (e.g. a "remove" action on the wishlist page) are handled by
 * composition around this component, not by forking it.
 */
export function ProductCard({ product, className }: ProductCardProps) {
  const { isAuthenticated } = useCurrentUser();
  const isWishlisted = useIsWishlisted(product.id);
  const toggleWishlist = useToggleWishlist();
  const displayVariant = getDisplayVariant(product);
  const image = product.images[0];

  return (
    <Card className={cn('group relative overflow-hidden transition-shadow hover:shadow-md', className)}>
      <Link href={`/products/${product.slug}`} className="block">
        <div className="relative aspect-square w-full overflow-hidden bg-muted">
          {image ? (
            <Image
              src={image.url}
              alt={product.name}
              fill
              sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-muted-foreground">
              <ImageOff className="h-8 w-8" aria-hidden="true" />
            </div>
          )}
        </div>
      </Link>

      {isAuthenticated && (
        <Button
          type="button"
          variant="secondary"
          size="icon"
          className="absolute right-2 top-2 h-8 w-8 rounded-full opacity-90 shadow"
          aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          aria-pressed={isWishlisted}
          loading={toggleWishlist.isPending}
          onClick={(e) => {
            e.preventDefault();
            toggleWishlist.mutate(product.id);
          }}
        >
          <Heart className={cn('h-4 w-4', isWishlisted && 'fill-destructive text-destructive')} />
        </Button>
      )}

      <div className="space-y-1.5 p-3">
        <p className="truncate text-xs text-muted-foreground">{product.store.name}</p>
        <Link href={`/products/${product.slug}`}>
          <h3 className="line-clamp-2 min-h-[2.5rem] text-sm font-medium leading-tight hover:underline">
            {product.name}
          </h3>
        </Link>
        <RatingStars rating={Number(product.ratingAverage)} reviewCount={product.reviewCount} size={14} />
        {displayVariant && (
          <PriceDisplay price={displayVariant.price} discountPrice={displayVariant.discountPrice} currency={displayVariant.currency} />
        )}
      </div>
    </Card>
  );
}
