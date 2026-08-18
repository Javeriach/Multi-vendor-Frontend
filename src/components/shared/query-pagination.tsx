'use client';

import { useRouter, useSearchParams } from 'next/navigation';

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { PaginationMeta } from '@/types/common';

/** Drives pagination purely through the URL's `page` param — reused by
 * every paginated list (products, orders, reviews) instead of each screen
 * managing its own page state. */
export function QueryPagination({ meta }: { meta: PaginationMeta }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  if (meta.totalPages <= 1) return null;

  const go = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', String(page));
    router.push(`?${params.toString()}`, { scroll: true });
  };

  const pages = Array.from({ length: meta.totalPages }, (_, i) => i + 1).filter(
    (p) => p === 1 || p === meta.totalPages || Math.abs(p - meta.page) <= 1,
  );

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href="#"
            aria-disabled={meta.page <= 1}
            className={meta.page <= 1 ? 'pointer-events-none opacity-50' : ''}
            onClick={(e) => {
              e.preventDefault();
              if (meta.page > 1) go(meta.page - 1);
            }}
          />
        </PaginationItem>
        {pages.map((page, i) => (
          <PaginationItem key={page}>
            {i > 0 && pages[i - 1] !== page - 1 && <span className="px-1 text-muted-foreground">…</span>}
            <PaginationLink
              href="#"
              isActive={page === meta.page}
              onClick={(e) => {
                e.preventDefault();
                go(page);
              }}
            >
              {page}
            </PaginationLink>
          </PaginationItem>
        ))}
        <PaginationItem>
          <PaginationNext
            href="#"
            aria-disabled={meta.page >= meta.totalPages}
            className={meta.page >= meta.totalPages ? 'pointer-events-none opacity-50' : ''}
            onClick={(e) => {
              e.preventDefault();
              if (meta.page < meta.totalPages) go(meta.page + 1);
            }}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
