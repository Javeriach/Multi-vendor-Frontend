'use client';

import { useEffect, useRef, useState } from 'react';
import { Loader2, MessageCircle } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Message } from '@/types/chat';
import { MessageBubble } from './message-bubble';

function dayLabel(iso: string): string {
  const date = new Date(iso);
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);
  const sameDay = (a: Date, b: Date) =>
    a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
  if (sameDay(date, today)) return 'Today';
  if (sameDay(date, yesterday)) return 'Yesterday';
  return new Intl.DateTimeFormat('en-US', { month: 'long', day: 'numeric', year: 'numeric' }).format(date);
}

export function MessageThread({
  messages,
  isLoading,
  hasMore,
  isLoadingMore,
  onLoadMore,
  currentUserId,
}: {
  messages: Message[];
  isLoading: boolean;
  hasMore: boolean;
  isLoadingMore: boolean;
  onLoadMore: () => void;
  currentUserId: string;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [stickToBottom, setStickToBottom] = useState(true);
  const prevScrollHeightRef = useRef(0);
  const prevMessageCountRef = useRef(0);
  const hasDoneInitialScrollRef = useRef(false);

  // Auto-scroll to bottom on new messages, but only if the user was
  // already near the bottom — someone scrolled up reading history
  // shouldn't get yanked down by an incoming message.
  //
  // Sets scrollTop directly rather than bottomRef.scrollIntoView() —
  // scrollIntoView with no explicit `block` option defaults to
  // block: 'start', which aligns the TARGET's top edge with the
  // viewport's top. For an empty sentinel div at the very end of the
  // list, that scrolls the container so far past the real content that
  // every message ends up pushed above the visible area — the header and
  // composer stay put (they're outside this scroll container), but the
  // thread appears to show nothing. Setting scrollTop directly has no
  // such ambiguity: it always means "the bottom of the scrollable content
  // is at the bottom of the viewport," full stop.
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    if (messages.length > prevMessageCountRef.current && stickToBottom) {
      el.scrollTo({ top: el.scrollHeight, behavior: hasDoneInitialScrollRef.current ? 'smooth' : 'auto' });
      hasDoneInitialScrollRef.current = true;
    }
    prevMessageCountRef.current = messages.length;
  }, [messages, stickToBottom]);

  // Preserve scroll position when older messages are prepended — without
  // this, "load more" yanks the view because new content was added above
  // where the user is currently looking.
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    if (prevScrollHeightRef.current > 0) {
      el.scrollTop = el.scrollHeight - prevScrollHeightRef.current;
      prevScrollHeightRef.current = 0;
    }
  }, [messages]);

  const handleScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    setStickToBottom(el.scrollHeight - el.scrollTop - el.clientHeight < 80);
    if (el.scrollTop < 60 && hasMore && !isLoadingMore) {
      prevScrollHeightRef.current = el.scrollHeight;
      onLoadMore();
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-0 flex-1 space-y-3 overflow-hidden p-4">
        <Skeleton className="ml-auto h-10 w-1/2 rounded-2xl" />
        <Skeleton className="h-10 w-2/5 rounded-2xl" />
        <Skeleton className="ml-auto h-16 w-3/5 rounded-2xl" />
      </div>
    );
  }

  if (messages.length === 0) {
    return (
      <div className="flex min-h-0 flex-1 flex-col items-center justify-center gap-2 p-8 text-center text-muted-foreground">
        <MessageCircle className="h-8 w-8" aria-hidden="true" />
        <p className="text-sm">No messages yet — say hello!</p>
      </div>
    );
  }

  let lastDay = '';

  return (
    <div ref={scrollRef} onScroll={handleScroll} className="min-h-0 flex-1 space-y-3 overflow-y-auto p-4">
      {isLoadingMore && (
        <div className="flex justify-center py-1">
          <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" aria-label="Loading older messages" />
        </div>
      )}
      {messages.map((message) => {
        const label = dayLabel(message.createdAt);
        const showDaySeparator = label !== lastDay;
        lastDay = label;
        return (
          <div key={message.id}>
            {showDaySeparator && (
              <div className="my-3 flex items-center justify-center">
                <span className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
                  {label}
                </span>
              </div>
            )}
            <MessageBubble message={message} isOwn={message.sender.id === currentUserId} />
          </div>
        );
      })}
    </div>
  );
}
