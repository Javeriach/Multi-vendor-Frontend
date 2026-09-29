'use client';

import { useRouter, useSearchParams } from 'next/navigation';

import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ProductSort } from '@/types/catalog';

const OPTIONS: { value: ProductSort; label: string }[] = [
  { value: 'newest', label: 'Newest' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Top Rated' },
];

export function ProductSortSelect() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const current = (searchParams.get('sort') as ProductSort) ?? 'newest';

  const onChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('sort', value);
    params.delete('page');
    router.push(`?${params.toString()}`);
  };

  return (
    <div className="w-full space-y-2 sm:w-[180px]">
      <Label className="text-xs uppercase tracking-wide text-muted-foreground">Sort by</Label>
      <Select value={current} onValueChange={onChange}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Sort by" />
        </SelectTrigger>
        <SelectContent>
          {OPTIONS.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
