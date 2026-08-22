'use client';

import { Heart } from 'lucide-react';

import { Skeleton } from '@/components/ui/skeleton';
import { EmptyState } from '@/components/shared/empty-state';
import { ErrorState } from '@/components/shared/error-state';
import { useCurrentUser } from '@/features/auth/hooks/use-current-user';
import { useWishlist } from '@/features/wishlist/hooks/use-wishlist';
import { WishlistItemCard } from '@/features/wishlist/components/wishlist-item-card';

export default function WishlistPage() {
  const { isAuthenticated, isLoading: authLoading } = useCurrentUser();
  const { data: wishlist, isLoading, isError, refetch } = useWishlist();

  return (
    <div className="container space-y-6 py-8">
      <h1 className="text-2xl font-bold tracking-tight">Wishlist</h1>

      {!authLoading && !isAuthenticated ? (
        <EmptyState
          icon={Heart}
          title="Sign in to view your wishlist"
          description="Log in to see products you've saved for later."
          actionLabel="Log In"
          actionHref="/login?redirect=/wishlist"
        />
      ) : isLoading || authLoading ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {Array.from({ length: 5 }, (_, i) => (
            <Skeleton key={i} className="aspect-square w-full" />
          ))}
        </div>
      ) : isError ? (
        <ErrorState message="We couldn't load your wishlist." onRetry={() => refetch()} />
      ) : !wishlist || wishlist.items.length === 0 ? (
        <EmptyState
          icon={Heart}
          title="Your wishlist is empty"
          description="Save products you love by tapping the heart icon."
          actionLabel="Start Shopping"
          actionHref="/products"
        />
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {wishlist.items.map((item) => (
            <WishlistItemCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}
