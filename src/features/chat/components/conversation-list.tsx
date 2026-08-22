'use client';

import { MessageCircle } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { ConversationSummary } from '@/types/chat';
import { ConversationListItem } from './conversation-list-item';

export function ConversationList({
  conversations,
  isLoading,
  activeId,
  onSelect,
  emptyMessage,
}: {
  conversations: ConversationSummary[] | undefined;
  isLoading: boolean;
  activeId: string | null;
  onSelect: (id: string) => void;
  emptyMessage: string;
}) {
  if (isLoading) {
    return (
      <div className="space-y-2 p-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center gap-3 px-3 py-2.5">
            <Skeleton className="h-11 w-11 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-3.5 w-2/3" />
              <Skeleton className="h-3 w-1/2" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!conversations || conversations.length === 0) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-2 p-8 text-center text-muted-foreground">
        <MessageCircle className="h-8 w-8" aria-hidden="true" />
        <p className="text-sm">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="space-y-0.5 p-2">
      {conversations.map((conversation) => (
        <ConversationListItem
          key={conversation.id}
          conversation={conversation}
          isActive={conversation.id === activeId}
          onClick={() => onSelect(conversation.id)}
        />
      ))}
    </div>
  );
}
