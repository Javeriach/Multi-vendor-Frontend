import { Clock, ShieldOff, XCircle } from 'lucide-react';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { VendorStatus } from '@/types/vendor';

const COPY: Record<Exclude<VendorStatus, 'approved'>, { icon: typeof Clock; title: string; description: string }> = {
  pending: {
    icon: Clock,
    title: 'Your store is awaiting approval',
    description: 'An admin needs to review your application before you can list products. You can still edit your store profile in the meantime.',
  },
  rejected: {
    icon: XCircle,
    title: 'Your application was rejected',
    description: 'Contact support if you believe this was a mistake.',
  },
  suspended: {
    icon: ShieldOff,
    title: 'Your store is suspended',
    description: 'Selling has been paused on this account. Contact support for details.',
  },
};

/** Shown on every `/vendor/*` page while `status !== 'approved'` — mirrors
 * the backend's `VendorApprovedGuard`, which blocks every mutating vendor
 * endpoint until an admin approves, so the UI should make that state
 * impossible to miss rather than let a vendor hit silent 403s. */
export function VendorStatusBanner({ status }: { status: VendorStatus }) {
  if (status === 'approved') return null;
  const { icon: Icon, title, description } = COPY[status];

  return (
    <Alert variant={status === 'pending' ? 'default' : 'destructive'}>
      <Icon className="h-4 w-4" />
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription>{description}</AlertDescription>
    </Alert>
  );
}
