'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { MessageCircle } from 'lucide-react';
import { useCurrentUser } from '@/features/auth/hooks/use-current-user';
import { cn } from '@/lib/utils';
import { ConversationSummary } from '@/types/chat';
import { useChatSocket } from '../hooks/use-chat-socket';
import { useConversationThread } from '../hooks/use-conversation-thread';
import { ConversationList } from './conversation-list';
import { MessageComposer } from './message-composer';
import { MessageThread } from './message-thread';
import { ThreadHeader } from './thread-header';

/**
 * Shared by both /messages (buyer) and /vendor/messages (vendor) — which
 * side of each conversation "self" is on comes entirely from
 * ConversationSummary.isViewerBuyer, so this component doesn't need to know
 * or care which page it's rendered on.
 *
 * The selected conversation is mirrored into the `c` URL query param
 * (shallow, no scroll/history spam) so a "Chat with Seller" button
 * elsewhere in the app can deep-link straight into a specific thread via
 * /messages?c=<id>.
 */
export function ChatLayout({
  conversations,
  isLoading,
  emptyMessage,
  heightClassName = 'h-[calc(100vh-12rem)]',
}: {
  conversations: ConversationSummary[] | undefined;
  isLoading: boolean;
  emptyMessage: string;
  /** Vertical space above this component differs by page (the vendor
   * dashboard stacks a title + nav + status banner above it; the buyer
   * page only has a page title) — each caller passes the height that
   * actually fits its own chrome instead of everyone sharing one guess. */
  heightClassName?: string;
}) {
  const { user } = useCurrentUser();
  const router = useRouter();
  const searchParams = useSearchParams();
  const connectionState = useChatSocket();

  const [activeId, setActiveId] = useState<string | null>(searchParams.get('c'));
  const thread = useConversationThread(activeId);

  useEffect(() => {
    const fromUrl = searchParams.get('c');
    if (fromUrl && fromUrl !== activeId) setActiveId(fromUrl);
    // Only react to external URL changes (e.g. the "Chat with Seller"
    // button navigating here) — activeId itself is the source of truth
    // once the user starts clicking around inside this component.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const select = (id: string) => {
    setActiveId(id);
    router.replace(`?c=${id}`, { scroll: false });
  };

  const activeConversation = conversations?.find((c) => c.id === activeId) ?? null;

  return (
    <div className={cn('grid min-h-[480px] overflow-hidden rounded-xl border bg-card md:grid-cols-[320px_1fr]', heightClassName)}>
      {/* min-h-0 on every level below the fixed-height grid is load-bearing:
          flex/grid items default to min-height:auto, which means a tall
          child (e.g. a long message thread) grows the item to fit its
          content INSTEAD of clipping to the row height — the item never
          actually overflows, so its own overflow-y-auto has nothing to
          scroll, and scrollIntoView() walks up to the next real scrollable
          ancestor: the whole page. min-h-0 forces these to respect the
          fixed height so overflow (and scrolling) happens where it's
          supposed to, WhatsApp-style — the page itself never scrolls. */}
      <div className={cn('flex min-h-0 flex-col border-r', activeId ? 'hidden md:flex' : 'flex')}>
        <div className="border-b px-4 py-3.5">
          <h2 className="font-semibold">Messages</h2>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto">
          <ConversationList
            conversations={conversations}
            isLoading={isLoading}
            activeId={activeId}
            onSelect={select}
            emptyMessage={emptyMessage}
          />
        </div>
      </div>

      <div className={cn('flex min-h-0 flex-col', activeId ? 'flex' : 'hidden md:flex')}>
        {activeConversation && user ? (
          <>
            <ThreadHeader
              conversation={activeConversation}
              connectionState={connectionState}
              onBack={() => {
                setActiveId(null);
                router.replace('?', { scroll: false });
              }}
            />
            <MessageThread
              key={activeConversation.id}
              messages={thread.messages}
              isLoading={thread.isLoading}
              hasMore={thread.hasMore}
              isLoadingMore={thread.isLoadingMore}
              onLoadMore={thread.loadMore}
              currentUserId={user.id}
            />
            <MessageComposer
              isSending={thread.isSending}
              onSendText={(text) => thread.sendMessage({ type: 'text', body: text })}
              onSendImage={(file) => thread.sendImage(file)}
            />
          </>
        ) : (
          <div className="hidden flex-1 flex-col items-center justify-center gap-2 text-muted-foreground md:flex">
            <MessageCircle className="h-10 w-10" aria-hidden="true" />
            <p className="text-sm">Select a conversation to start chatting</p>
          </div>
        )}
      </div>
    </div>
  );
}
