import { cn } from '@/lib/utils';
import { formatMoney } from '@/lib/format';

interface PriceDisplayProps {
  price: string;
  discountPrice?: string | null;
  currency?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeClasses = {
  sm: 'text-sm',
  md: 'text-base',
  lg: 'text-2xl',
};

/** Single source of truth for "how do we show a price" — every place a
 * price appears (product card, product detail, cart, order summary) goes
 * through this so a sale price never renders inconsistently. */
export function PriceDisplay({ price, discountPrice, currency = 'USD', size = 'md', className }: PriceDisplayProps) {
  const onSale = discountPrice != null && Number(discountPrice) < Number(price);

  return (
    <span className={cn('inline-flex items-baseline gap-2', className)}>
      <span className={cn('font-semibold text-foreground', sizeClasses[size])}>
        {formatMoney(onSale ? discountPrice! : price, currency)}
      </span>
      {onSale && (
        <span className="text-sm text-muted-foreground line-through">{formatMoney(price, currency)}</span>
      )}
    </span>
  );
}
