import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

import { Card, CardContent } from '@/components/ui/card';
import { StatusBadge } from '@/components/shared/status-badge';
import { formatDate, formatMoney } from '@/lib/format';
import { VendorOrder } from '@/types/order';

/** One row per `VendorOrder` — this IS "my buyers" from the vendor's point
 * of view: `order.shippingName`/`shippingPhone` identify who bought and
 * where to ship, since the backend doesn't expose the buyer's account here
 * (see `orders.service.ts#findVendorOrders`, which only joins `order`, not
 * `order.user`). */
export function VendorOrderListItem({ vendorOrder }: { vendorOrder: VendorOrder }) {
  const itemCount = vendorOrder.items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <Link href={`/vendor/orders/${vendorOrder.id}`}>
      <Card className="transition-colors hover:bg-accent/50">
        <CardContent className="flex items-center justify-between gap-4 p-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <p className="font-medium">{vendorOrder.order?.shippingName ?? 'Buyer'}</p>
              <StatusBadge status={vendorOrder.status} />
            </div>
            {vendorOrder.order && (
              <p className="text-sm text-muted-foreground">
                {vendorOrder.order.orderNumber} · {formatDate(vendorOrder.createdAt)}
              </p>
            )}
            <p className="text-sm text-muted-foreground">
              {itemCount} item{itemCount === 1 ? '' : 's'}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <p className="font-semibold">{formatMoney(vendorOrder.total)}</p>
            <ChevronRight className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
