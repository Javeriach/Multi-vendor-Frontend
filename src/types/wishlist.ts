import { Product } from './catalog';

export interface WishlistItem {
  id: string;
  product: Pick<Product, 'id' | 'name' | 'slug' | 'status' | 'images' | 'store'>;
  createdAt: string;
}

export interface Wishlist {
  id: string;
  items: WishlistItem[];
  createdAt: string;
}
