'use client';

import { ImageIcon } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { formatRelativeShort } from '@/lib/format';
import { cn } from '@/lib/utils';
import { ConversationSummary } from '@/types/chat';

function initials(name: string): string {
  return name
    .split(' ')
    .map((part) => part[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

/** Same summary shape serves both the buyer's list (counterpart = store)
 * and the vendor's list (counterpart = buyer) — `isViewerBuyer` picks
 * which side of the conversation is "the other person" for this viewer. */
export function ConversationListItem({
  conversation,
  isActive,
  onClick,
}: {
  conversation: ConversationSummary;
  isActive: boolean;
  onClick: () => void;
}) {
  const isBuyerView = conversation.isViewerBuyer;
  const name = isBuyerView
    ? conversation.store.name
    : `${conversation.buyer.firstName} ${conversation.buyer.lastName}`;
  const avatarUrl = isBuyerView ? conversation.store.logoUrl : conversation.buyer.photoUrl;

  const preview = conversation.lastMessage
    ? conversation.lastMessage.type === 'image'
      ? 'Photo'
      : conversation.lastMessage.body
    : conversation.startedFromProduct
      ? `Asked about ${conversation.startedFromProduct.name}`
      : 'Start the conversation';

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors',
        isActive ? 'bg-accent' : 'hover:bg-accent/50',
      )}
    >
      <Avatar className="h-11 w-11">
        <AvatarImage src={avatarUrl ?? undefined} alt="" />
        <AvatarFallback>{initials(name)}</AvatarFallback>
      </Avatar>

      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <span className={cn('truncate text-sm', conversation.unreadCount > 0 ? 'font-semibold' : 'font-medium')}>
            {name}
          </span>
          {conversation.lastMessageAt && (
            <span className="shrink-0 text-xs text-muted-foreground">
              {formatRelativeShort(conversation.lastMessageAt)}
            </span>
          )}
        </div>
        <div className="flex items-center justify-between gap-2">
          <span
            className={cn(
              'flex min-w-0 items-center gap-1 truncate text-xs',
              conversation.unreadCount > 0 ? 'font-medium text-foreground' : 'text-muted-foreground',
            )}
          >
            {conversation.lastMessage?.type === 'image' && <ImageIcon className="h-3 w-3 shrink-0" />}
            <span className="truncate">{preview}</span>
          </span>
          {conversation.unreadCount > 0 && (
            <Badge className="h-5 min-w-5 shrink-0 justify-center rounded-full p-0 text-[10px]">
              {conversation.unreadCount > 9 ? '9+' : conversation.unreadCount}
            </Badge>
          )}
        </div>
      </div>
    </button>
  );
}
