'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ImageOff, Trash2 } from 'lucide-react';

import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { PriceDisplay } from '@/components/shared/price-display';
import { QuantityControl } from '@/components/shared/quantity-control';
import { availableStock } from '@/features/products/lib/pricing';
import { CartItem } from '@/types/cart';
import { useRemoveCartItem, useUpdateCartItem } from '../hooks/use-cart-mutations';

export function CartItemRow({ item }: { item: CartItem }) {
  const updateItem = useUpdateCartItem();
  const removeItem = useRemoveCartItem();
  const image = item.variant.product.images[0];
  const stock = availableStock(item.variant);
  const attributes = Object.entries(item.variant.attributes ?? {});
  const isInactive = item.variant.product.status !== 'active';

  return (
    <div className="flex gap-4 py-4">
      <Checkbox
        checked={item.selectedForPurchase}
        disabled={isInactive || updateItem.isPending}
        onCheckedChange={(checked) =>
          updateItem.mutate([item.id, { selectedForPurchase: checked === true }])
        }
        aria-label={`Select ${item.variant.product.name} for checkout`}
        className="mt-1 self-start"
      />

      <Link href={`/products/${item.variant.product.slug}`} className="relative h-20 w-20 shrink-0 overflow-hidden rounded-md bg-muted">
        {image ? (
          <Image src={image.url} alt={item.variant.product.name} fill sizes="80px" className="object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-muted-foreground">
            <ImageOff className="h-6 w-6" aria-hidden="true" />
          </div>
        )}
      </Link>

      <div className="flex flex-1 flex-col gap-1">
        <div className="flex items-start justify-between gap-2">
          <div>
            <Link href={`/products/${item.variant.product.slug}`} className="text-sm font-medium hover:underline">
              {item.variant.product.name}
            </Link>
            {attributes.length > 0 && (
              <p className="text-xs text-muted-foreground">
                {attributes.map(([key, value]) => `${key}: ${value}`).join(' · ')}
              </p>
            )}
            <p className="text-xs text-muted-foreground">{item.variant.product.store.name}</p>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-8 w-8 shrink-0 text-muted-foreground hover:text-destructive"
            aria-label="Remove item"
            loading={removeItem.isPending}
            onClick={() => removeItem.mutate(item.id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>

        {isInactive && <p className="text-xs font-medium text-destructive">No longer available</p>}

        <div className="mt-1 flex items-center justify-between">
          <QuantityControl
            value={item.quantity}
            max={Math.max(item.quantity, stock)}
            disabled={isInactive || updateItem.isPending}
            onChange={(quantity) => updateItem.mutate([item.id, { quantity }])}
          />
          <PriceDisplay price={item.variant.price} discountPrice={item.variant.discountPrice} currency={item.variant.currency} />
        </div>
      </div>
    </div>
  );
}
