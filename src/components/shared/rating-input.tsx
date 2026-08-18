'use client';

import { useState } from 'react';
import { Star } from 'lucide-react';

import { cn } from '@/lib/utils';

interface RatingInputProps {
  value: number;
  onChange: (value: number) => void;
  size?: number;
}

export function RatingInput({ value, onChange, size = 28 }: RatingInputProps) {
  const [hovered, setHovered] = useState(0);
  const display = hovered || value;

  return (
    <div className="flex gap-1" role="radiogroup" aria-label="Rating">
      {Array.from({ length: 5 }, (_, i) => {
        const starValue = i + 1;
        return (
          <button
            key={i}
            type="button"
            role="radio"
            aria-checked={value === starValue}
            aria-label={`${starValue} star${starValue > 1 ? 's' : ''}`}
            className="rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            onMouseEnter={() => setHovered(starValue)}
            onMouseLeave={() => setHovered(0)}
            onClick={() => onChange(starValue)}
          >
            <Star
              width={size}
              height={size}
              className={cn(
                'transition-colors',
                starValue <= display ? 'fill-amber-400 text-amber-400' : 'fill-muted text-muted-foreground/40',
              )}
            />
          </button>
        );
      })}
    </div>
  );
}
