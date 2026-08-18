'use client';

import { ReactNode, useEffect } from 'react';
import { useRouter } from 'next/navigation';

import { Skeleton } from '@/components/ui/skeleton';
import { useCurrentUser } from '@/features/auth/hooks/use-current-user';
import { VendorNav } from '@/features/vendors/components/vendor-nav';
import { VendorStatusBanner } from '@/features/vendors/components/vendor-status-banner';
import { useMyVendor } from '@/features/vendors/hooks/use-vendor';

export default function VendorLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { user, isAuthenticated, isLoading: authLoading } = useCurrentUser();
  const { data: vendor, isLoading: vendorLoading } = useMyVendor();

  useEffect(() => {
    if (authLoading) return;
    if (!isAuthenticated) {
      router.replace('/login?redirect=/vendor');
    } else if (user?.role !== 'vendor') {
      router.replace('/sell');
    }
  }, [authLoading, isAuthenticated, user, router]);

  if (authLoading || user?.role !== 'vendor' || vendorLoading || !vendor) {
    return (
      <div className="container space-y-4 py-8">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  return (
    <div className="container space-y-6 py-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">{vendor.stores[0]?.name ?? 'Vendor Dashboard'}</h1>
      </div>
      <VendorNav />
      <VendorStatusBanner status={vendor.status} />
      {children}
    </div>
  );
}
