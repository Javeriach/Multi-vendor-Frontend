'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Store } from 'lucide-react';

import { Skeleton } from '@/components/ui/skeleton';
import { EmptyState } from '@/components/shared/empty-state';
import { useCurrentUser } from '@/features/auth/hooks/use-current-user';
import { VendorApplicationForm } from '@/features/vendors/components/vendor-application-form';

export default function SellPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading } = useCurrentUser();

  useEffect(() => {
    if (user?.role === 'vendor') router.replace('/vendor');
  }, [user, router]);

  if (isLoading) {
    return (
      <div className="container max-w-xl py-8">
        <Skeleton className="h-72 w-full" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="container max-w-xl py-8">
        <EmptyState
          icon={Store}
          title="Sign in to become a seller"
          description="Create an account or log in to apply for a seller store."
          actionLabel="Log In"
          actionHref="/login?redirect=/sell"
        />
      </div>
    );
  }

  if (user?.role === 'admin') {
    return (
      <div className="container max-w-xl py-8">
        <EmptyState icon={Store} title="Admin accounts can't sell" description="Use a customer account to apply as a seller." />
      </div>
    );
  }

  if (user?.role === 'vendor') return null; // redirecting

  return (
    <div className="container max-w-xl space-y-6 py-8">
      <VendorApplicationForm />
    </div>
  );
}
