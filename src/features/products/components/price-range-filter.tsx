'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { FormEvent, useState } from 'react';
import { ArrowRight } from 'lucide-react';

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
    <form onSubmit={apply} className="w-full space-y-2 sm:w-[240px]">
      <Label className="text-xs uppercase tracking-wide text-muted-foreground">Price</Label>
      <div className="flex items-center gap-2">
        <Input
          type="number"
          min={0}
          placeholder="Min"
          value={min}
          onChange={(e) => setMin(e.target.value)}
          aria-label="Minimum price"
        />
        <span className="shrink-0 text-muted-foreground">–</span>
        <Input
          type="number"
          min={0}
          placeholder="Max"
          value={max}
          onChange={(e) => setMax(e.target.value)}
          aria-label="Maximum price"
        />
        <Button type="submit" size="icon" variant="outline" className="shrink-0" aria-label="Apply price filter">
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </form>
  );
}
