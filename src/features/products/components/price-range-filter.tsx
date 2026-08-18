'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { FormEvent, useState } from 'react';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

export function PriceRangeFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [min, setMin] = useState(searchParams.get('minPrice') ?? '');
  const [max, setMax] = useState(searchParams.get('maxPrice') ?? '');

  const apply = (e: FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams.toString());
    if (min) params.set('minPrice', min);
    else params.delete('minPrice');
    if (max) params.set('maxPrice', max);
    else params.delete('maxPrice');
    params.delete('page');
    router.push(`?${params.toString()}`);
  };

  return (
    <form onSubmit={apply} className="space-y-2">
      <Label className="text-xs uppercase tracking-wide text-muted-foreground">Price</Label>
      <div className="flex items-center gap-2">
        <Input
          type="number"
          min={0}
          placeholder="Min"
          value={min}
          onChange={(e) => setMin(e.target.value)}
          className="h-8"
          aria-label="Minimum price"
        />
        <span className="text-muted-foreground">–</span>
        <Input
          type="number"
          min={0}
          placeholder="Max"
          value={max}
          onChange={(e) => setMax(e.target.value)}
          className="h-8"
          aria-label="Maximum price"
        />
      </div>
      <Button type="submit" size="sm" variant="outline" className="w-full">
        Apply
      </Button>
    </form>
  );
}
