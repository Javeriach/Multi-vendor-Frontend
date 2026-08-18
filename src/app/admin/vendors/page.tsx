'use client';

import { Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Users } from 'lucide-react';

import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { EmptyState } from '@/components/shared/empty-state';
import { ErrorState } from '@/components/shared/error-state';
import { QueryPagination } from '@/components/shared/query-pagination';
import { AdminVendorRow } from '@/features/vendors/components/admin-vendor-row';
import { useAdminVendors } from '@/features/vendors/hooks/use-admin-vendors';
import { VendorStatus } from '@/types/vendor';

const STATUS_TABS: { value: string; label: string }[] = [
  { value: 'pending', label: 'Pending' },
  { value: 'approved', label: 'Approved' },
  { value: 'rejected', label: 'Rejected' },
  { value: 'suspended', label: 'Suspended' },
  { value: 'all', label: 'All' },
];

function AdminVendorsView() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const status = searchParams.get('status') ?? 'pending';
  const page = Number(searchParams.get('page')) > 0 ? Number(searchParams.get('page')) : 1;

  const { data: vendors, isLoading, isError, refetch } = useAdminVendors({
    page,
    status: status === 'all' ? undefined : (status as VendorStatus),
  });

  const setStatus = (next: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('status', next);
    params.delete('page');
    router.push(`?${params.toString()}`);
  };

  return (
    <div className="max-w-3xl space-y-6">
      <h1 className="text-2xl font-bold tracking-tight">Vendor Approvals</h1>

      <Tabs value={status} onValueChange={setStatus}>
        <TabsList>
          {STATUS_TABS.map((tab) => (
            <TabsTrigger key={tab.value} value={tab.value}>
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }, (_, i) => (
            <Skeleton key={i} className="h-20 w-full" />
          ))}
        </div>
      ) : isError ? (
        <ErrorState message="We couldn't load vendors." onRetry={() => refetch()} />
      ) : !vendors || vendors.data.length === 0 ? (
        <EmptyState icon={Users} title="No vendors here" description="No vendor applications match this filter." />
      ) : (
        <div className="space-y-4">
          <div className="space-y-3">
            {vendors.data.map((vendor) => (
              <AdminVendorRow key={vendor.id} vendor={vendor} />
            ))}
          </div>
          <QueryPagination meta={vendors.meta} />
        </div>
      )}
    </div>
  );
}

export default function AdminVendorsPage() {
  return (
    <Suspense fallback={<Skeleton className="h-64 w-full" />}>
      <AdminVendorsView />
    </Suspense>
  );
}
