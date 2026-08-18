'use client';

import { Pencil, Trash2 } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useDeleteAddress } from '@/features/addresses/hooks/use-addresses';
import { Address } from '@/types/address';
import { AddressFormDialog } from './address-form-dialog';

export function AddressCard({ address }: { address: Address }) {
  const deleteAddress = useDeleteAddress();

  return (
    <Card>
      <CardContent className="flex items-start justify-between gap-4 p-4">
        <div className="space-y-1 text-sm">
          <div className="flex items-center gap-2">
            <p className="font-medium">{address.streetAddress}</p>
            {address.isDefault && <Badge variant="secondary">Default</Badge>}
          </div>
          <p className="text-muted-foreground">
            {address.city}, {address.area} {address.postalCode}
          </p>
          <p className="text-muted-foreground">{address.country}</p>
        </div>
        <div className="flex shrink-0 gap-1">
          <AddressFormDialog
            address={address}
            trigger={
              <Button type="button" variant="ghost" size="icon" aria-label="Edit address">
                <Pencil className="h-4 w-4" />
              </Button>
            }
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label="Delete address"
            loading={deleteAddress.isPending}
            onClick={() => deleteAddress.mutate(address.id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
