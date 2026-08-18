'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { ErrorState } from '@/components/shared/error-state';
import { useMyVendor } from '@/features/vendors/hooks/use-vendor';
import { StoreSettingsForm } from '@/features/vendors/components/store-settings-form';

export default function VendorStorePage() {
  const { data: vendor, isLoading, isError, refetch } = useMyVendor();

  if (isLoading) {
    return (
      <div className="max-w-xl">
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (isError || !vendor?.stores[0]) {
    return <ErrorState message="We couldn't load your store." onRetry={() => refetch()} />;
  }

  return (
    <div className="max-w-xl">
      <Card>
        <CardHeader>
          <CardTitle>Store Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <StoreSettingsForm store={vendor.stores[0]} />
        </CardContent>
      </Card>
    </div>
  );
}
