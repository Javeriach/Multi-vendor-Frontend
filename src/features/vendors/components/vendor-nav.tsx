'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { cn } from '@/lib/utils';

const LINKS = [
  { href: '/vendor', label: 'Overview' },
  { href: '/vendor/products', label: 'Products' },
  { href: '/vendor/orders', label: 'Orders' },
  { href: '/vendor/store', label: 'Store Settings' },
];

export function VendorNav() {
  const pathname = usePathname();

  return (
    <nav className="flex flex-wrap gap-1 border-b pb-2" aria-label="Vendor dashboard navigation">
      {LINKS.map((link) => {
        const isActive = link.href === '/vendor' ? pathname === '/vendor' : pathname.startsWith(link.href);
        return (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              'rounded-md px-3 py-1.5 text-sm font-medium transition-colors',
              isActive ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-accent hover:text-foreground',
            )}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
