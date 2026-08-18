'use client';

import Image from 'next/image';
import { useState } from 'react';
import { ImageOff } from 'lucide-react';

import { cn } from '@/lib/utils';
import { ProductImage } from '@/types/catalog';

export function ProductGallery({ images, productName }: { images: ProductImage[]; productName: string }) {
  const sorted = [...images].sort((a, b) => a.position - b.position);
  const [active, setActive] = useState(0);
  const current = sorted[active];

  return (
    <div className="space-y-3">
      <div className="relative aspect-square w-full overflow-hidden rounded-lg border bg-muted">
        {current ? (
          <Image
            src={current.url}
            alt={productName}
            fill
            priority
            sizes="(min-width: 1024px) 40vw, 90vw"
            className="object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-muted-foreground">
            <ImageOff className="h-12 w-12" aria-hidden="true" />
          </div>
        )}
      </div>

      {sorted.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1" role="tablist" aria-label="Product images">
          {sorted.map((image, index) => (
            <button
              key={image.id}
              type="button"
              role="tab"
              aria-selected={index === active}
              aria-label={`View image ${index + 1}`}
              onClick={() => setActive(index)}
              className={cn(
                'relative h-16 w-16 shrink-0 overflow-hidden rounded-md border-2 bg-muted',
                index === active ? 'border-primary' : 'border-transparent',
              )}
            >
              <Image src={image.url} alt="" fill sizes="64px" className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
