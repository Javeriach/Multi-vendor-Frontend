import Link from 'next/link';

import { SITE_NAME } from '@/lib/constants';

export function Footer() {
  return (
    <footer className="mt-16 border-t bg-muted/30">
      <div className="container grid gap-8 py-10 sm:grid-cols-2 md:grid-cols-4">
        <div>
          <p className="text-lg font-bold">{SITE_NAME}</p>
          <p className="mt-2 text-sm text-muted-foreground">
            A marketplace for independent vendors and the customers who love them.
          </p>
        </div>
        <div>
          <h3 className="text-sm font-semibold">Shop</h3>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li><Link href="/products" className="hover:text-foreground">All Products</Link></li>
            <li><Link href="/wishlist" className="hover:text-foreground">Wishlist</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="text-sm font-semibold">Account</h3>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li><Link href="/orders" className="hover:text-foreground">My Orders</Link></li>
            <li><Link href="/account/addresses" className="hover:text-foreground">Addresses</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="text-sm font-semibold">Sell</h3>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li><Link href="/vendor/onboarding" className="hover:text-foreground">Become a Vendor</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t py-4">
        <p className="container text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} {SITE_NAME}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
