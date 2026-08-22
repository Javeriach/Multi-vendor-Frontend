'use client';

import Link from 'next/link';
import { ArrowLeft, Package } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { ConversationSummary } from '@/types/chat';
import { ChatConnectionState } from '../hooks/use-chat-socket';
import { ConnectionStatusBadge } from './connection-status-badge';

function initials(name: string): string {
  return name.split(' ').map((p) => p[0]).filter(Boolean).slice(0, 2).join('').toUpperCase();
}

export function ThreadHeader({
  conversation,
  connectionState,
  onBack,
}: {
  conversation: ConversationSummary;
  connectionState: ChatConnectionState;
  onBack?: () => void;
}) {
  const isBuyerView = conversation.isViewerBuyer;
  const name = isBuyerView
    ? conversation.store.name
    : `${conversation.buyer.firstName} ${conversation.buyer.lastName}`;
  const avatarUrl = isBuyerView ? conversation.store.logoUrl : conversation.buyer.photoUrl;

  return (
    <div className="flex items-center gap-3 border-b bg-background px-4 py-3">
      {onBack && (
        <Button type="button" variant="ghost" size="icon" className="-ml-2 shrink-0 md:hidden" onClick={onBack} aria-label="Back to conversations">
          <ArrowLeft className="h-5 w-5" />
        </Button>
      )}
      <Avatar className="h-9 w-9">
        <AvatarImage src={avatarUrl ?? undefined} alt="" />
        <AvatarFallback>{initials(name)}</AvatarFallback>
      </Avatar>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold">{name}</p>
        {conversation.startedFromProduct && (
          <Link
            href={`/products/${conversation.startedFromProduct.slug}`}
            className="flex items-center gap-1 truncate text-xs text-muted-foreground hover:text-foreground hover:underline"
          >
            <Package className="h-3 w-3 shrink-0" />
            {conversation.startedFromProduct.name}
          </Link>
        )}
      </div>
      <ConnectionStatusBadge state={connectionState} />
    </div>
  );
}
