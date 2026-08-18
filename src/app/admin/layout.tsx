'use client';

import { ReactNode, useEffect } from 'react';
import { useRouter } from 'next/navigation';

import { Skeleton } from '@/components/ui/skeleton';
import { useCurrentUser } from '@/features/auth/hooks/use-current-user';

export default function AdminLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { user, isAuthenticated, isLoading } = useCurrentUser();

  useEffect(() => {
    if (isLoading) return;
    if (!isAuthenticated) {
      router.replace('/login?redirect=/admin/vendors');
    } else if (user?.role !== 'admin') {
      router.replace('/');
    }
  }, [isLoading, isAuthenticated, user, router]);

  if (isLoading || user?.role !== 'admin') {
    return (
      <div className="container space-y-4 py-8">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  return <div className="container space-y-6 py-8">{children}</div>;
}
