'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { StatusBadge } from '@/components/shared/status-badge';
import { formatDate } from '@/lib/format';
import { VendorProfile } from '@/types/vendor';
import { useUpdateVendorStatus } from '../hooks/use-admin-vendors';

export function AdminVendorRow({ vendor }: { vendor: VendorProfile }) {
  const updateStatus = useUpdateVendorStatus();
  const store = vendor.stores[0];
  const isPending = updateStatus.isPending;
  const pendingStatus = updateStatus.isPending ? updateStatus.variables?.status : undefined;

  return (
    <Card>
      <CardContent className="flex flex-wrap items-center justify-between gap-3 p-4">
        <div>
          <div className="flex items-center gap-2">
            <p className="font-medium">{store?.name ?? vendor.businessName}</p>
            <StatusBadge status={vendor.status} />
          </div>
          <p className="text-sm text-muted-foreground">{vendor.businessName}</p>
          <p className="text-xs text-muted-foreground">Applied {formatDate(vendor.createdAt)}</p>
        </div>
        <div className="flex gap-2">
          {vendor.status !== 'approved' && (
            <Button
              size="sm"
              disabled={isPending}
              loading={pendingStatus === 'approved'}
              onClick={() => updateStatus.mutate({ id: vendor.id, status: 'approved' })}
            >
              Approve
            </Button>
          )}
          {vendor.status !== 'rejected' && (
            <Button
              size="sm"
              variant="outline"
              disabled={isPending}
              loading={pendingStatus === 'rejected'}
              onClick={() => updateStatus.mutate({ id: vendor.id, status: 'rejected' })}
            >
              Reject
            </Button>
          )}
          {vendor.status === 'approved' && (
            <Button
              size="sm"
              variant="outline"
              disabled={isPending}
              loading={pendingStatus === 'suspended'}
              onClick={() => updateStatus.mutate({ id: vendor.id, status: 'suspended' })}
            >
              Suspend
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
