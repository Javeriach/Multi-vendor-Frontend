'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Search } from 'lucide-react';
import { FormEvent, useState } from 'react';

import { Input } from '@/components/ui/input';

export function SearchBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [value, setValue] = useState(searchParams.get('search') ?? '');

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    const params = new URLSearchParams();
    if (value.trim()) params.set('search', value.trim());
    router.push(`/products${params.toString() ? `?${params.toString()}` : ''}`);
  };

  return (
    <form onSubmit={onSubmit} role="search" className="relative w-full">
      <Search className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
      <label htmlFor="site-search" className="sr-only">Search products</label>
      <Input
        id="site-search"
        type="search"
        placeholder="Search products…"
        className="pl-8"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
    </form>
  );
}
