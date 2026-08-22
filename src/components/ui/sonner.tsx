'use client';

import { Toaster as HotToaster, ToasterProps as HotToasterProps } from 'react-hot-toast';

/**
 * Filename kept as sonner.tsx (not renamed) — every consumer imports the
 * `Toaster` symbol from '@/components/ui/sonner', and renaming the file
 * would be a no-op churn across the app for zero behavioral benefit.
 */
const Toaster = (props: HotToasterProps) => {
  return (
    <HotToaster
      position="top-center"
      toastOptions={{
        duration: 4000,
        className: 'border shadow-lg',
        style: {
          background: 'hsl(var(--background))',
          color: 'hsl(var(--foreground))',
          border: '1px solid hsl(var(--border))',
        },
        success: {
          iconTheme: { primary: 'hsl(var(--success))', secondary: 'hsl(var(--success-foreground))' },
        },
        error: {
          iconTheme: { primary: 'hsl(var(--destructive))', secondary: 'hsl(var(--destructive-foreground))' },
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
