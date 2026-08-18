'use client';

import { Pencil, Plus, Trash2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { formatMoney } from '@/lib/format';
import { Product } from '@/types/catalog';
import { useRemoveVariant } from '../hooks/use-vendor-products';
import { formatAttributes } from '../lib/vendor-schemas';
import { VariantFormDialog } from './variant-form-dialog';

export function VariantManager({ product }: { product: Product }) {
  const removeVariant = useRemoveVariant(product.id);

  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between space-y-0">
        <CardTitle>Variants</CardTitle>
        <VariantFormDialog
          productId={product.id}
          trigger={
            <Button type="button" variant="outline" size="sm" className="gap-1.5">
              <Plus className="h-4 w-4" /> Add Variant
            </Button>
          }
        />
      </CardHeader>
      <CardContent className="space-y-4">
        {product.variants.length === 0 && (
          <p className="text-sm text-muted-foreground">No variants yet — add one to let customers purchase this product.</p>
        )}
        {product.variants.map((variant, index) => (
          <div key={variant.id}>
            {index > 0 && <Separator className="mb-4" />}
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="font-medium">{variant.sku}</p>
                {variant.attributes && (
                  <p className="text-sm text-muted-foreground">{formatAttributes(variant.attributes)}</p>
                )}
                <p className="text-sm">
                  {variant.discountPrice ? (
                    <>
                      <span className="font-medium">{formatMoney(variant.discountPrice, variant.currency)}</span>{' '}
                      <span className="text-muted-foreground line-through">{formatMoney(variant.price, variant.currency)}</span>
                    </>
                  ) : (
                    <span className="font-medium">{formatMoney(variant.price, variant.currency)}</span>
                  )}
                  <span className="ml-3 text-muted-foreground">
                    Stock: {variant.inventory?.stockQuantity ?? 0}
                    {variant.inventory && variant.inventory.reservedQuantity > 0 && ` (${variant.inventory.reservedQuantity} reserved)`}
                  </span>
                </p>
              </div>
              <div className="flex gap-1">
                <VariantFormDialog
                  productId={product.id}
                  variant={variant}
                  trigger={
                    <Button type="button" variant="ghost" size="icon" aria-label="Edit variant">
                      <Pencil className="h-4 w-4" />
                    </Button>
                  }
                />
                {product.variants.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    aria-label="Delete variant"
                    loading={removeVariant.isPending}
                    onClick={() => removeVariant.mutate(variant.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
