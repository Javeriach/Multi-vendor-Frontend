import { Product, ProductVariant } from '@/types/catalog';

/** A product always has ≥1 variant (enforced by the backend); "the
 * product's price" for card/summary display is the cheapest variant's
 * effective (discount-aware) price. Product detail pages show the full
 * per-variant breakdown instead of collapsing to one number. */
export function getDisplayVariant(product: Pick<Product, 'variants'>): ProductVariant | undefined {
  return product.variants.reduce<ProductVariant | undefined>((cheapest, variant) => {
    const price = Number(variant.discountPrice ?? variant.price);
    const cheapestPrice = cheapest ? Number(cheapest.discountPrice ?? cheapest.price) : Infinity;
    return price < cheapestPrice ? variant : cheapest;
  }, undefined);
}

export function isInStock(variant: Pick<ProductVariant, 'inventory'>): boolean {
  if (!variant.inventory) return true; // unknown — don't block optimistically
  return variant.inventory.stockQuantity - variant.inventory.reservedQuantity > 0;
}

export function availableStock(variant: Pick<ProductVariant, 'inventory'>): number {
  if (!variant.inventory) return 0;
  return Math.max(0, variant.inventory.stockQuantity - variant.inventory.reservedQuantity);
}
