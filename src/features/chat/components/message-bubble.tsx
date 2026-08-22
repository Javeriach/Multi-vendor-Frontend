'use client';

import Image from 'next/image';
import { Check, CheckCheck } from 'lucide-react';
import { formatTime } from '@/lib/format';
import { cn } from '@/lib/utils';
import { Message } from '@/types/chat';

export function MessageBubble({ message, isOwn }: { message: Message; isOwn: boolean }) {
  return (
    <div className={cn('flex w-full', isOwn ? 'justify-end' : 'justify-start')}>
      <div
        className={cn(
          'max-w-[75%] rounded-2xl px-3.5 py-2 shadow-sm sm:max-w-[65%]',
          message.type === 'image' && 'p-1.5',
          isOwn
            ? 'rounded-br-sm bg-primary text-primary-foreground'
            : 'rounded-bl-sm border bg-card text-card-foreground',
        )}
      >
        {message.type === 'image' && message.imageUrl ? (
          <a href={message.imageUrl} target="_blank" rel="noopener noreferrer" className="block">
            <div className="relative aspect-square w-56 max-w-full overflow-hidden rounded-xl sm:w-64">
              <Image src={message.imageUrl} alt="Shared image" fill sizes="256px" className="object-cover" />
            </div>
          </a>
        ) : (
          <p className="whitespace-pre-wrap break-words text-sm">{message.body}</p>
        )}

        <div
          className={cn(
            'mt-1 flex items-center justify-end gap-1 text-[10px]',
            message.type === 'image' && 'px-1.5 pb-0.5',
            isOwn ? 'text-primary-foreground/70' : 'text-muted-foreground',
          )}
        >
          <span>{formatTime(message.createdAt)}</span>
          {isOwn && (message.readAt ? <CheckCheck className="h-3 w-3" /> : <Check className="h-3 w-3" />)}
        </div>
      </div>
    </div>
  );
}
