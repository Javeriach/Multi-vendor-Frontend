'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ShoppingCart } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PriceDisplay } from '@/components/shared/price-display';
import { QuantityControl } from '@/components/shared/quantity-control';
import { useCurrentUser } from '@/features/auth/hooks/use-current-user';
import { useAddToCart } from '@/features/cart/hooks/use-cart-mutations';
import { cn } from '@/lib/utils';
import { Product } from '@/types/catalog';
import { availableStock, isInStock } from '../lib/pricing';

/** Groups a flat variant list by attribute key (e.g. Color, Size) so buyers
 * pick one value per attribute instead of choosing from a raw SKU list.
 * Falls back to a single implicit variant when a product has none. */
export function ProductVariantSelector({ product, slug }: { product: Product; slug: string }) {
  const { isAuthenticated, isLoading: authLoading } = useCurrentUser();
  const router = useRouter();
  const addToCart = useAddToCart();

  const attributeKeys = useMemo(() => {
    const keys = new Set<string>();
    product.variants.forEach((variant) => {
      Object.keys(variant.attributes ?? {}).forEach((key) => keys.add(key));
    });
    return Array.from(keys);
  }, [product.variants]);

  const firstAvailable = product.variants.find((v) => isInStock(v)) ?? product.variants[0];
  const [selected, setSelected] = useState<Record<string, string>>(firstAvailable?.attributes ?? {});
  const [quantity, setQuantity] = useState(1);

  const selectedVariant = useMemo(
    () =>
      product.variants.find((variant) =>
        attributeKeys.every((key) => (variant.attributes ?? {})[key] === selected[key]),
      ),
    [product.variants, attributeKeys, selected],
  );

  const inStock = selectedVariant ? isInStock(selectedVariant) : false;
  const stock = selectedVariant ? availableStock(selectedVariant) : 0;

  const handleAddToCart = () => {
    if (!selectedVariant) return;
    if (!isAuthenticated) {
      router.push(`/login?redirect=/products/${slug}`);
      return;
    }
    addToCart.mutate({ variantId: selectedVariant.id, quantity });
  };

  return (
    <div className="space-y-5">
      {selectedVariant ? (
        <PriceDisplay
          price={selectedVariant.price}
          discountPrice={selectedVariant.discountPrice}
          currency={selectedVariant.currency}
          size="lg"
        />
      ) : (
        <p className="text-sm text-muted-foreground">Select options to see price</p>
      )}

      {attributeKeys.map((key) => {
        const values = Array.from(
          new Set(product.variants.map((v) => (v.attributes ?? {})[key]).filter((v): v is string => !!v)),
        );
        return (
          <div key={key} className="space-y-2">
            <p className="text-sm font-medium capitalize">{key}</p>
            <div className="flex flex-wrap gap-2">
              {values.map((value) => {
                const isSelected = selected[key] === value;
                return (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setSelected((prev) => ({ ...prev, [key]: value }))}
                    aria-pressed={isSelected}
                    className={cn(
                      'rounded-md border px-3 py-1.5 text-sm transition-colors',
                      isSelected
                        ? 'border-primary bg-primary text-primary-foreground'
                        : 'border-input bg-background hover:bg-accent',
                    )}
                  >
                    {value}
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}

      {selectedVariant &&
        (inStock ? (
          stock <= 5 && (
            <Badge variant="outline" className="border-amber-500 text-amber-600">
              Only {stock} left
            </Badge>
          )
        ) : (
          <Badge variant="destructive">Out of stock</Badge>
        ))}

      <div className="flex items-center gap-3">
        <QuantityControl value={quantity} onChange={setQuantity} max={Math.max(1, stock)} disabled={!inStock} />
        <Button
          onClick={handleAddToCart}
          disabled={!selectedVariant || !inStock || authLoading}
          loading={addToCart.isPending}
          className="flex-1 gap-2"
          size="lg"
        >
          <ShoppingCart className="h-4 w-4" />
          {inStock ? 'Add to Cart' : 'Out of Stock'}
        </Button>
      </div>
    </div>
  );
}
