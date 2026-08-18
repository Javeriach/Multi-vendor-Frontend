'use client';

import { Heart } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { useCurrentUser } from '@/features/auth/hooks/use-current-user';
import { cn } from '@/lib/utils';
import { useIsWishlisted, useToggleWishlist } from '../hooks/use-wishlist';

/** Standalone wishlist toggle for pages outside the product grid (product
 * detail) — the grid's own heart button lives inline on ProductCard since
 * its overlay positioning is specific to the card layout. */
export function WishlistButton({ productId, className }: { productId: string; className?: string }) {
  const { isAuthenticated } = useCurrentUser();
  const isWishlisted = useIsWishlisted(productId);
  const toggleWishlist = useToggleWishlist();

  if (!isAuthenticated) return null;

  return (
    <Button
      type="button"
      variant="outline"
      size="lg"
      className={cn('gap-2', className)}
      aria-pressed={isWishlisted}
      loading={toggleWishlist.isPending}
      onClick={() => toggleWishlist.mutate(productId)}
    >
      <Heart className={cn('h-4 w-4', isWishlisted && 'fill-destructive text-destructive')} />
      {isWishlisted ? 'Wishlisted' : 'Wishlist'}
    </Button>
  );
}
