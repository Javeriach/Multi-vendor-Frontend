import { Product, ProductVariant } from './catalog';

export interface CartItemVariant extends ProductVariant {
  product: Pick<Product, 'id' | 'name' | 'slug' | 'status' | 'images' | 'store'>;
}

export interface CartItem {
  id: string;
  quantity: number;
  selectedForPurchase: boolean;
  variant: CartItemVariant;
  createdAt: string;
  updatedAt: string;
}

export interface Cart {
  id: string;
  items: CartItem[];
  createdAt: string;
  updatedAt: string;
}
