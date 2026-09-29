import { ShoppingBag } from 'lucide-react';

import { SITE_NAME } from '@/lib/constants';
import { cn } from '@/lib/utils';

/** The one place the brand mark is drawn — an icon badge + wordmark, reused
 * wherever "the logo" means more than plain text (currently just the
 * navbar). Keeping it here instead of inline means a future real logo file
 * only has to replace this one component. */
export function Logo({ className }: { className?: string }) {
  return (
    <span className={cn('flex items-center gap-2', className)}>
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
        <ShoppingBag className="h-4 w-4" aria-hidden="true" />
      </span>
      <span className="text-lg font-bold tracking-tight">{SITE_NAME}</span>
    </span>
  );
}
