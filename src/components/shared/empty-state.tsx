import { LucideIcon } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description?: string;
  actionLabel?: string;
  actionHref?: string;
}

/** One shared shape for every "nothing here yet" screen — empty cart, empty
 * wishlist, no orders, no search results — instead of each page inventing
 * its own blank-page treatment. */
export function EmptyState({ icon: Icon, title, description, actionLabel, actionHref }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed py-16 text-center">
      <Icon className="h-10 w-10 text-muted-foreground" aria-hidden="true" />
      <h3 className="text-lg font-semibold">{title}</h3>
      {description && <p className="max-w-sm text-sm text-muted-foreground">{description}</p>}
      {actionLabel && actionHref && (
        <Button asChild className="mt-2">
          <Link href={actionHref}>{actionLabel}</Link>
        </Button>
      )}
    </div>
  );
}
