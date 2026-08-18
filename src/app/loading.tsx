import { Loader2 } from 'lucide-react';

/** Next's App Router shows this automatically while a route segment's code
 * is being loaded/rendered — covers both the dev-mode "compiling a route
 * for the first time" gap and any real data-loading gap, so navigation
 * never looks frozen with zero feedback. */
export default function Loading() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" aria-label="Loading" />
    </div>
  );
}
