'use client';

import { useRouter, useSearchParams } from 'next/navigation';

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
    <Select value={current} onValueChange={onChange}>
      <SelectTrigger className="w-full sm:w-[200px]">
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
  );
}
