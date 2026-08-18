'use client';

import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useUpdateVendorOrderStatus } from '../hooks/use-vendor-orders';
import { VendorOrder, VendorOrderStatus } from '@/types/order';

const STATUS_OPTIONS: VendorOrderStatus[] = ['processing', 'shipped', 'delivered', 'cancelled'];

export function VendorOrderStatusForm({ vendorOrder }: { vendorOrder: VendorOrder }) {
  const updateStatus = useUpdateVendorOrderStatus(vendorOrder.id);
  const [status, setStatus] = useState<VendorOrderStatus>(vendorOrder.status);
  const [trackingNumber, setTrackingNumber] = useState(vendorOrder.trackingNumber ?? '');
  const [trackingCarrier, setTrackingCarrier] = useState(vendorOrder.trackingCarrier ?? '');

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Fulfillment</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-1.5">
          <Label>Status</Label>
          <Select value={status} onValueChange={(v) => setStatus(v as VendorOrderStatus)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {STATUS_OPTIONS.map((option) => (
                <SelectItem key={option} value={option}>
                  {option.charAt(0).toUpperCase() + option.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label htmlFor="trackingNumber">Tracking number</Label>
            <Input id="trackingNumber" value={trackingNumber} onChange={(e) => setTrackingNumber(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="trackingCarrier">Carrier</Label>
            <Input id="trackingCarrier" value={trackingCarrier} onChange={(e) => setTrackingCarrier(e.target.value)} />
          </div>
        </div>
        <Button
          loading={updateStatus.isPending}
          onClick={() =>
            updateStatus.mutate({
              status,
              trackingNumber: trackingNumber || undefined,
              trackingCarrier: trackingCarrier || undefined,
            })
          }
        >
          {updateStatus.isPending ? 'Updating…' : 'Update Order'}
        </Button>
      </CardContent>
    </Card>
  );
}
