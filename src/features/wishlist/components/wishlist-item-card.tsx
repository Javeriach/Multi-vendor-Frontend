'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ImageOff, X } from 'lucide-react';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { WishlistItem } from '@/types/wishlist';
import { useToggleWishlist } from '../hooks/use-wishlist';

interface WishlistItemCardProps {
  item: WishlistItem;
}

/**
 * The wishlist API only returns a partial product (see WishlistItem), not
 * enough for the full ProductCard (price/rating need the complete Product
 * with variants) — this is the dedicated card for that shape instead.
 */
export function WishlistItemCard({ item }: WishlistItemCardProps) {
  const toggleWishlist = useToggleWishlist();
  const { product } = item;
  const image = product.images[0];

  return (
    <Card className="group relative overflow-hidden transition-shadow hover:shadow-md">
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

      <Button
        type="button"
        variant="secondary"
        size="icon"
        className="absolute right-2 top-2 h-8 w-8 rounded-full opacity-90 shadow"
        aria-label="Remove from wishlist"
        loading={toggleWishlist.isPending}
        onClick={() => toggleWishlist.mutate(product.id)}
      >
        <X className="h-4 w-4" />
      </Button>

      <div className="space-y-1.5 p-3">
        <p className="truncate text-xs text-muted-foreground">{product.store.name}</p>
        <Link href={`/products/${product.slug}`}>
          <h3 className="line-clamp-2 min-h-[2.5rem] text-sm font-medium leading-tight hover:underline">
            {product.name}
          </h3>
        </Link>
      </div>
    </Card>
  );
}
