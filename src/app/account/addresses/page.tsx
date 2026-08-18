'use client';

import { MapPin, Plus } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { EmptyState } from '@/components/shared/empty-state';
import { ErrorState } from '@/components/shared/error-state';
import { AddressCard } from '@/features/addresses/components/address-card';
import { AddressFormDialog } from '@/features/addresses/components/address-form-dialog';
import { useAddresses } from '@/features/addresses/hooks/use-addresses';
import { useCurrentUser } from '@/features/auth/hooks/use-current-user';

export default function AddressesPage() {
  const { isAuthenticated, isLoading: authLoading } = useCurrentUser();
  const { data: addresses, isLoading, isError, refetch } = useAddresses();

  return (
    <div className="container max-w-2xl space-y-6 py-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Addresses</h1>
        {isAuthenticated && (
          <AddressFormDialog
            trigger={
              <Button size="sm" className="gap-1.5">
                <Plus className="h-4 w-4" /> Add Address
              </Button>
            }
          />
        )}
      </div>

      {!authLoading && !isAuthenticated ? (
        <EmptyState
          icon={MapPin}
          title="Sign in to manage addresses"
          description="Log in to view and add delivery addresses."
          actionLabel="Log In"
          actionHref="/login?redirect=/account/addresses"
        />
      ) : isLoading || authLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 2 }, (_, i) => (
            <Skeleton key={i} className="h-24 w-full" />
          ))}
        </div>
      ) : isError ? (
        <ErrorState message="We couldn't load your addresses." onRetry={() => refetch()} />
      ) : !addresses || addresses.length === 0 ? (
        <EmptyState icon={MapPin} title="No addresses yet" description="Add an address to speed up checkout." />
      ) : (
        <div className="space-y-3">
          {addresses.map((address) => (
            <AddressCard key={address.id} address={address} />
          ))}
        </div>
      )}
    </div>
  );
}
