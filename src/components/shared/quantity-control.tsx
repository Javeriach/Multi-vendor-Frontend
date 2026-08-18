'use client';

import { Minus, Plus } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface QuantityControlProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  disabled?: boolean;
  className?: string;
}

/** Shared by the cart page and the product-detail "add to cart" control —
 * one implementation, two call sites, per the reusability requirement. */
export function QuantityControl({ value, onChange, min = 1, max = 99, disabled, className }: QuantityControlProps) {
  return (
    <div className={cn('inline-flex items-center rounded-md border', className)}>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="h-8 w-8 rounded-r-none"
        disabled={disabled || value <= min}
        onClick={() => onChange(Math.max(min, value - 1))}
        aria-label="Decrease quantity"
      >
        <Minus className="h-3.5 w-3.5" />
      </Button>
      <span className="w-9 text-center text-sm tabular-nums" aria-live="polite">
        {value}
      </span>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="h-8 w-8 rounded-l-none"
        disabled={disabled || value >= max}
        onClick={() => onChange(Math.min(max, value + 1))}
        aria-label="Increase quantity"
      >
        <Plus className="h-3.5 w-3.5" />
      </Button>
    </div>
  );
}
