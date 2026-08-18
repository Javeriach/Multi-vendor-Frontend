export type ProductStatus = 'draft' | 'active' | 'inactive' | 'archived';
export type StoreStatus = 'pending' | 'active' | 'suspended' | 'rejected';

export interface Category {
  id: string;
  name: string;
  slug: string;
  imageUrl: string | null;
  backgroundColor: string | null;
  parent?: Category | null;
  children?: Category[];
}

export interface Store {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  logoUrl: string | null;
  bannerUrl: string | null;
  contactEmail: string | null;
  contactPhone: string | null;
  status: StoreStatus;
}

export interface Inventory {
  id: string;
  stockQuantity: number;
  reservedQuantity: number;
}

/** `price`/`discountPrice` are strings — the backend returns Postgres
 * `numeric` columns as strings on purpose (avoids float rounding). Always
 * format through `formatMoney()`, never do arithmetic on these directly. */
export interface ProductVariant {
  id: string;
  sku: string;
  attributes: Record<string, string> | null;
  price: string;
  discountPrice: string | null;
  currency: string;
  inventory?: Inventory;
}

export interface ProductImage {
  id: string;
  url: string;
  position: number;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  status: ProductStatus;
  ratingAverage: string;
  reviewCount: number;
  images: ProductImage[];
  variants: ProductVariant[];
  category: Category;
  store: Store;
  createdAt: string;
  updatedAt: string;
}

export type ProductSort = 'newest' | 'price_asc' | 'price_desc' | 'rating';

export interface ProductsQuery {
  page?: number;
  limit?: number;
  search?: string;
  categoryId?: string;
  storeId?: string;
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  sort?: ProductSort;
  /** Only honored on the vendor/admin-scoped endpoints — the public catalog
   * always forces status=active regardless of this field. */
  status?: ProductStatus;
}
