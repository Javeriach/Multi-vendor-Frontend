'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Suspense, useState } from 'react';
import { Heart, LogOut, Menu, MessageCircle, Package, Search, Settings, ShoppingCart, Store, User as UserIcon, Users } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useCurrentUser } from '@/features/auth/hooks/use-current-user';
import { useLogout } from '@/features/auth/hooks/use-auth-mutations';
import { useCart } from '@/features/cart/hooks/use-cart';
import { useUnreadCount } from '@/features/chat/hooks/use-conversations';
import { useWishlist } from '@/features/wishlist/hooks/use-wishlist';
import { useCategories } from '@/features/categories/hooks/use-categories';
import { SearchBar } from '@/components/shared/search-bar';
import { SITE_NAME } from '@/lib/constants';
import { cn } from '@/lib/utils';

function IconLinkBadge({ count }: { count: number }) {
  if (!count) return null;
  return (
    <Badge className="absolute -right-2 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full p-0 text-[10px]">
      {count > 99 ? '99+' : count}
    </Badge>
  );
}

export function Navbar() {
  const { user, isAuthenticated } = useCurrentUser();
  const { data: cart } = useCart();
  const { data: wishlist } = useWishlist();
  const { data: unreadCount } = useUnreadCount();
  const { data: categories } = useCategories();
  const logout = useLogout();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  const cartCount = cart?.items.length ?? 0;
  const wishlistCount = wishlist?.items.length ?? 0;

  const handleLogout = async () => {
    await logout.mutateAsync();
    router.push('/');
  };

  return (
    <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="container flex h-16 items-center gap-4">
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon" aria-label="Open menu">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-72">
            <nav className="mt-8 flex flex-col gap-1" aria-label="Mobile navigation">
              <Link href="/products" className="rounded-md px-2 py-2 text-sm font-medium hover:bg-accent" onClick={() => setMobileOpen(false)}>
                All Products
              </Link>
              {categories?.map((category) => (
                <Link
                  key={category.id}
                  href={`/categories/${category.slug}`}
                  className="rounded-md px-2 py-2 text-sm hover:bg-accent"
                  onClick={() => setMobileOpen(false)}
                >
                  {category.name}
                </Link>
              ))}
            </nav>
          </SheetContent>
        </Sheet>

        <Link href="/" className="mr-2 flex shrink-0 items-center gap-2 text-lg font-bold tracking-tight">
          <Store className="h-5 w-5 text-primary" aria-hidden="true" />
          {SITE_NAME}
        </Link>

        {/* min-w-0 lets this flex item actually shrink below its content
            width (the flex default is min-width:auto, which would instead
            force links to wrap onto a second line and spill out of the
            fixed-height sticky header). overflow-x-auto turns any leftover
            squeeze into a horizontal scroll instead. */}
        <nav
          className="hidden min-w-0 items-center gap-1 overflow-x-auto md:flex [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          aria-label="Primary navigation"
        >
          <Link
            href="/products"
            className="shrink-0 whitespace-nowrap rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-foreground"
          >
            All Products
          </Link>
          {categories?.slice(0, 5).map((category) => (
            <Link
              key={category.id}
              href={`/categories/${category.slug}`}
              className="shrink-0 whitespace-nowrap rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-foreground"
            >
              {category.name}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex flex-1 items-center justify-end gap-1 md:flex-none">
          <div className="hidden flex-1 max-w-sm md:block">
            <Suspense fallback={<Skeleton className="h-9 w-full" />}>
              <SearchBar />
            </Suspense>
          </div>

          <Button variant="ghost" size="icon" asChild className="md:hidden" aria-label="Search">
            <Link href="/products">
              <Search className="h-5 w-5" />
            </Link>
          </Button>

          {isAuthenticated && (
            <Button variant="ghost" size="icon" asChild className="relative" aria-label={`Messages (${unreadCount ?? 0} unread)`}>
              {/* Vendors' unread messages can live in their VENDOR inbox
                  (customers messaging their store) — sending them to the
                  buyer inbox at /messages would show "no conversations"
                  even with unread messages waiting, since a vendor is
                  rarely also the buyer in any thread. */}
              <Link href={user?.role === 'vendor' ? '/vendor/messages' : '/messages'}>
                <MessageCircle className="h-5 w-5" />
                <IconLinkBadge count={unreadCount ?? 0} />
              </Link>
            </Button>
          )}

          <Button variant="ghost" size="icon" asChild className="relative" aria-label={`Wishlist (${wishlistCount} items)`}>
            <Link href="/wishlist">
              <Heart className="h-5 w-5" />
              <IconLinkBadge count={wishlistCount} />
            </Link>
          </Button>

          <Button variant="ghost" size="icon" asChild className="relative" aria-label={`Cart (${cartCount} items)`}>
            <Link href="/cart">
              <ShoppingCart className="h-5 w-5" />
              <IconLinkBadge count={cartCount} />
            </Link>
          </Button>

          {isAuthenticated && user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="Account menu">
                  <UserIcon className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel className="font-normal">
                  <p className="text-sm font-medium">{user.firstName} {user.lastName}</p>
                  <p className="text-xs text-muted-foreground">{user.email}</p>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/orders">
                    <Package className="mr-2 h-4 w-4" /> My Orders
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/account/addresses">
                    <Settings className="mr-2 h-4 w-4" /> Addresses
                  </Link>
                </DropdownMenuItem>
                {user.role === 'customer' && (
                  <DropdownMenuItem asChild>
                    <Link href="/sell">
                      <Store className="mr-2 h-4 w-4" /> Become a Seller
                    </Link>
                  </DropdownMenuItem>
                )}
                {user.role === 'vendor' && (
                  <DropdownMenuItem asChild>
                    <Link href="/vendor">
                      <Store className="mr-2 h-4 w-4" /> Vendor Dashboard
                    </Link>
                  </DropdownMenuItem>
                )}
                {user.role === 'admin' && (
                  <DropdownMenuItem asChild>
                    <Link href="/admin/vendors">
                      <Users className="mr-2 h-4 w-4" /> Vendor Approvals
                    </Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className={cn(logout.isPending && 'opacity-50')}>
                  <LogOut className="mr-2 h-4 w-4" /> Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button asChild size="sm">
              <Link href="/login">Sign in</Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
