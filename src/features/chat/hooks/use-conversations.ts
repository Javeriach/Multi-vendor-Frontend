'use client';

import { useQuery } from '@tanstack/react-query';
import { useCurrentUser } from '@/features/auth/hooks/use-current-user';
import { chatApi } from '../api/chat.api';
import { chatKeys } from '../lib/query-keys';

/**
 * `refetchOnMount: 'always'` on both conversation lists — the unread-count
 * badge (in navbar.tsx, permanently mounted) reliably reflects live
 * updates because ChatSocketProvider's invalidation reaches it the instant
 * a socket event fires. These two queries aren't always mounted (only
 * while /messages or /vendor/messages is actually open), so an
 * invalidation that lands while the page is closed just marks them stale
 * without forcing a background refetch nobody's there to see. Forcing a
 * network fetch every time the inbox is opened is worth the (cheap, small
 * payload) extra request — a stale-looking inbox is a worse experience
 * than one extra fetch.
 */
export function useConversations() {
  const { isAuthenticated } = useCurrentUser();
  return useQuery({
    queryKey: chatKeys.conversations(),
    queryFn: () => chatApi.listConversations(),
    enabled: isAuthenticated,
    refetchOnMount: 'always',
  });
}

export function useVendorConversations() {
  const { user, isAuthenticated } = useCurrentUser();
  return useQuery({
    queryKey: chatKeys.vendorConversations(),
    queryFn: () => chatApi.listVendorConversations(),
    enabled: isAuthenticated && user?.role === 'vendor',
    refetchOnMount: 'always',
  });
}

export function useUnreadCount() {
  const { isAuthenticated } = useCurrentUser();
  return useQuery({
    queryKey: chatKeys.unreadCount(),
    queryFn: () => chatApi.unreadCount(),
    enabled: isAuthenticated,
    select: (data) => data.count,
  });
}
