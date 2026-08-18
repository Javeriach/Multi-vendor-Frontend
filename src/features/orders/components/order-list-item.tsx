import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

import { Card, CardContent } from '@/components/ui/card';
import { StatusBadge } from '@/components/shared/status-badge';
import { formatDate, formatMoney } from '@/lib/format';
import { Order } from '@/types/order';

export function OrderListItem({ order }: { order: Order }) {
  const storeNames = order.vendorOrders.map((vo) => vo.store.name).join(', ');

  return (
    <Link href={`/orders/${order.id}`}>
      <Card className="transition-colors hover:bg-accent/50">
        <CardContent className="flex items-center justify-between gap-4 p-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <p className="font-medium">{order.orderNumber}</p>
              <StatusBadge status={order.paymentStatus} />
            </div>
            <p className="text-sm text-muted-foreground">{formatDate(order.createdAt)}</p>
            <p className="line-clamp-1 text-sm text-muted-foreground">{storeNames}</p>
          </div>
          <div className="flex items-center gap-3">
            <p className="font-semibold">{formatMoney(order.total, order.currency)}</p>
            <ChevronRight className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
