import { Address } from './address';
import { ProductVariant } from './catalog';
import { Store } from './catalog';

export type OrderStatus = 'pending' | 'confirmed' | 'cancelled';
export type OrderPaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded' | 'partially_refunded';
export type PaymentMethod = 'card' | 'cash_on_delivery';
export type VendorOrderStatus = 'processing' | 'shipped' | 'delivered' | 'cancelled';

export interface OrderItem {
  id: string;
  quantity: number;
  unitPrice: string;
  total: string;
  productNameSnapshot: string;
  skuSnapshot: string;
  variantAttributesSnapshot: Record<string, string> | null;
  imageUrlSnapshot: string | null;
  variant: ProductVariant | null;
  createdAt: string;
}

export interface VendorOrder {
  id: string;
  status: VendorOrderStatus;
  subtotal: string;
  shippingFee: string;
  total: string;
  trackingNumber: string | null;
  trackingCarrier: string | null;
  shippedAt: string | null;
  deliveredAt: string | null;
  store: Store;
  items: OrderItem[];
  order?: Order;
  createdAt: string;
  updatedAt: string;
}

export interface Payment {
  id: string;
  type: 'charge' | 'refund';
  provider: string;
  amount: string;
  currency: string;
  status: 'pending' | 'succeeded' | 'failed';
  succeededAt: string | null;
  createdAt: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  shippingName: string;
  shippingPhone: string;
  shippingStreetAddress: string;
  shippingCity: string;
  shippingArea: string;
  shippingCountry: string;
  shippingPostalCode: string;
  status: OrderStatus;
  paymentStatus: OrderPaymentStatus;
  paymentMethod: PaymentMethod;
  subtotal: string;
  shippingTotal: string;
  taxTotal: string;
  discountTotal: string;
  total: string;
  currency: string;
  stripeSessionId: string | null;
  shippingAddress: Address | null;
  vendorOrders: VendorOrder[];
  payments: Payment[];
  createdAt: string;
  updatedAt: string;
}

export interface CheckoutInput {
  addressId: string;
  contactPhone: string;
  paymentMethod: PaymentMethod;
}

export interface CheckoutResult {
  order: Order;
  checkoutUrl: string;
}
