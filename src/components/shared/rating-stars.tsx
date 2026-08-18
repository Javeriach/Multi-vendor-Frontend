import { Star } from 'lucide-react';

import { cn } from '@/lib/utils';

interface RatingStarsProps {
  rating: number;
  reviewCount?: number;
  size?: number;
  className?: string;
}

/** Read-only display only — rating INPUT (for submitting a review) is a
 * separate component, since the interaction model is entirely different. */
export function RatingStars({ rating, reviewCount, size = 16, className }: RatingStarsProps) {
  const rounded = Math.round(rating);

  return (
    <div className={cn('flex items-center gap-1', className)}>
      <div className="flex" role="img" aria-label={`Rated ${rating.toFixed(1)} out of 5`}>
        {Array.from({ length: 5 }, (_, i) => (
          <Star
            key={i}
            width={size}
            height={size}
            className={i < rounded ? 'fill-amber-400 text-amber-400' : 'fill-muted text-muted-foreground/40'}
            aria-hidden="true"
          />
        ))}
      </div>
      {reviewCount !== undefined && (
        <span className="text-xs text-muted-foreground">({reviewCount})</span>
      )}
    </div>
  );
}
