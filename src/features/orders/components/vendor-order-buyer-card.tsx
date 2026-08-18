import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Order } from '@/types/order';

/** The buyer's shipping snapshot from the parent Order — the only buyer
 * identity a vendor endpoint exposes (see vendor-order-list-item.tsx for
 * why: no `order.user` join on the vendor-scoped queries). */
export function VendorOrderBuyerCard({ order }: { order: Order }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Buyer &amp; Shipping</CardTitle>
      </CardHeader>
      <CardContent className="space-y-1 text-sm">
        <p className="font-medium">{order.shippingName}</p>
        <p className="text-muted-foreground">{order.shippingPhone}</p>
        <p className="text-muted-foreground">
          {order.shippingStreetAddress}, {order.shippingCity}, {order.shippingArea} {order.shippingPostalCode}
        </p>
        <p className="text-muted-foreground">{order.shippingCountry}</p>
      </CardContent>
    </Card>
  );
}
