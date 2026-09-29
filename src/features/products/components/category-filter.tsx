'use client';

import { useRouter, useSearchParams } from 'next/navigation';

import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Category } from '@/types/catalog';

export function CategoryFilter({ categories }: { categories: Category[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const current = searchParams.get('categoryId') ?? 'all';

  const onChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value === 'all') params.delete('categoryId');
    else params.set('categoryId', value);
    params.delete('page');
    router.push(`?${params.toString()}`);
  };

  return (
    <div className="w-full space-y-2 sm:w-[200px]">
      <Label className="text-xs uppercase tracking-wide text-muted-foreground">Category</Label>
      <Select value={current} onValueChange={onChange}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Category" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Categories</SelectItem>
          {categories.map((category) => (
            <SelectItem key={category.id} value={category.id}>
              {category.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
