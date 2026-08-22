'use client';

import { ReactNode, useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useCurrentUser } from '@/features/auth/hooks/use-current-user';
import { getChatSocket } from '@/lib/socket';
import { chatKeys } from '../lib/query-keys';
import { useChatSocket } from '../hooks/use-chat-socket';

/**
 * Mounted once in the root layout — keeps one live socket connection for
 * the whole app while any page is open, so the navbar's unread badge and
 * conversation list stay current even when the user isn't looking at
 * /messages. A conversation:updated event only tells us "something changed
 * in conversation X"; it deliberately doesn't carry the new message itself,
 * so the reaction here is just "go refetch the summaries," not an attempt
 * to patch the cache by hand.
 */
export function ChatSocketProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useCurrentUser();
  const queryClient = useQueryClient();
  useChatSocket();

  useEffect(() => {
    if (!isAuthenticated) return;
    const socket = getChatSocket();

    const handleUpdated = () => {
      queryClient.invalidateQueries({ queryKey: chatKeys.conversations() });
      queryClient.invalidateQueries({ queryKey: chatKeys.vendorConversations() });
      queryClient.invalidateQueries({ queryKey: chatKeys.unreadCount() });
    };

    socket.on('conversation:updated', handleUpdated);
    return () => {
      socket.off('conversation:updated', handleUpdated);
    };
  }, [isAuthenticated, queryClient]);

  return children;
}
