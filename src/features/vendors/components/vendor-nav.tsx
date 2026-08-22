'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { Badge } from '@/components/ui/badge';
import { useVendorConversations } from '@/features/chat/hooks/use-conversations';
import { cn } from '@/lib/utils';

const LINKS = [
  { href: '/vendor', label: 'Overview' },
  { href: '/vendor/products', label: 'Products' },
  { href: '/vendor/orders', label: 'Orders' },
  { href: '/vendor/messages', label: 'Messages' },
  { href: '/vendor/store', label: 'Store Settings' },
];

export function VendorNav() {
  // Can be null during static generation (no real request to derive a path
  // from) — see footer.tsx for the fuller explanation of when this bites.
  const pathname = usePathname() ?? '';
  const { data: conversations } = useVendorConversations();
  const unreadCount = conversations?.reduce((sum, c) => sum + c.unreadCount, 0) ?? 0;

  return (
    <nav className="flex flex-wrap gap-1 border-b pb-2" aria-label="Vendor dashboard navigation">
      {LINKS.map((link) => {
        const isActive = link.href === '/vendor' ? pathname === '/vendor' : pathname.startsWith(link.href);
        return (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              'flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors',
              isActive ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-accent hover:text-foreground',
            )}
          >
            {link.label}
            {link.href === '/vendor/messages' && unreadCount > 0 && (
              <Badge className="h-5 min-w-5 justify-center rounded-full p-0 text-[10px]">
                {unreadCount > 9 ? '9+' : unreadCount}
              </Badge>
            )}
          </Link>
        );
      })}
    </nav>
  );
}
