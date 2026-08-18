'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ImageOff, Pencil, Trash2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { StatusBadge } from '@/components/shared/status-badge';
import { formatMoney } from '@/lib/format';
import { Product } from '@/types/catalog';
import { useDeleteVendorProduct } from '../hooks/use-vendor-products';

function priceRange(product: Product): string {
  const prices = product.variants.map((v) => Number(v.discountPrice ?? v.price));
  if (prices.length === 0) return '—';
  const min = Math.min(...prices);
  const max = Math.max(...prices);
  const currency = product.variants[0]?.currency ?? 'USD';
  return min === max ? formatMoney(min, currency) : `${formatMoney(min, currency)} – ${formatMoney(max, currency)}`;
}

function totalStock(product: Product): number {
  return product.variants.reduce((sum, v) => sum + (v.inventory?.stockQuantity ?? 0), 0);
}

export function VendorProductListItem({ product }: { product: Product }) {
  const deleteProduct = useDeleteVendorProduct();
  const image = product.images[0];

  return (
    <Card>
      <CardContent className="flex items-center gap-4 p-4">
        <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded bg-muted">
          {image ? (
            <Image src={image.url} alt={product.name} fill sizes="64px" className="object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-muted-foreground">
              <ImageOff className="h-5 w-5" aria-hidden="true" />
            </div>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <p className="truncate font-medium">{product.name}</p>
            <StatusBadge status={product.status} />
          </div>
          <p className="text-sm text-muted-foreground">{product.category.name}</p>
          <p className="text-sm">
            {priceRange(product)} · {product.variants.length} variant{product.variants.length === 1 ? '' : 's'} ·{' '}
            {totalStock(product)} in stock
          </p>
        </div>
        <div className="flex shrink-0 gap-1">
          <Button variant="ghost" size="icon" asChild aria-label="Edit product">
            <Link href={`/vendor/products/${product.id}`}>
              <Pencil className="h-4 w-4" />
            </Link>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            aria-label="Delete product"
            loading={deleteProduct.isPending}
            onClick={() => deleteProduct.mutate(product.id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
