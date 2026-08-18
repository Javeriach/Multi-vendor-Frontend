import Image from 'next/image';
import { ImageOff } from 'lucide-react';

import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { StatusBadge } from '@/components/shared/status-badge';
import { formatMoney } from '@/lib/format';
import { VendorOrder } from '@/types/order';

/** One card per store within an order — mirrors the backend's
 * Order → VendorOrder split so a multi-vendor order reads as N shipments,
 * each trackable independently. */
export function VendorOrderCard({ vendorOrder }: { vendorOrder: VendorOrder }) {
  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between space-y-0">
        <p className="font-semibold">{vendorOrder.store.name}</p>
        <StatusBadge status={vendorOrder.status} />
      </CardHeader>
      <CardContent className="space-y-3">
        {vendorOrder.items.map((item) => (
          <div key={item.id} className="flex items-center gap-3">
            <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded bg-muted">
              {item.imageUrlSnapshot ? (
                <Image src={item.imageUrlSnapshot} alt={item.productNameSnapshot} fill sizes="56px" className="object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                  <ImageOff className="h-5 w-5" aria-hidden="true" />
                </div>
              )}
            </div>
            <div className="flex-1 text-sm">
              <p className="line-clamp-1 font-medium">{item.productNameSnapshot}</p>
              {item.variantAttributesSnapshot && (
                <p className="text-xs text-muted-foreground">
                  {Object.entries(item.variantAttributesSnapshot).map(([k, v]) => `${k}: ${v}`).join(' · ')}
                </p>
              )}
              <p className="text-xs text-muted-foreground">Qty {item.quantity}</p>
            </div>
            <p className="text-sm font-medium">{formatMoney(item.total)}</p>
          </div>
        ))}
      </CardContent>
      <CardFooter className="flex-col items-stretch gap-2">
        <Separator />
        {vendorOrder.trackingNumber && (
          <p className="text-sm text-muted-foreground">
            Tracking: <span className="font-medium text-foreground">{vendorOrder.trackingNumber}</span>
            {vendorOrder.trackingCarrier ? ` (${vendorOrder.trackingCarrier})` : ''}
          </p>
        )}
        <div className="flex justify-between text-sm font-semibold">
          <span>Shipment total</span>
          <span>{formatMoney(vendorOrder.total)}</span>
        </div>
      </CardFooter>
    </Card>
  );
}
