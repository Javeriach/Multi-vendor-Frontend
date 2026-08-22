'use client';

import { useEffect, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useCurrentUser } from '@/features/auth/hooks/use-current-user';
import { acquireChatSocket, releaseChatSocket } from '@/lib/socket';
import { chatKeys } from '../lib/query-keys';

export type ChatConnectionState = 'connecting' | 'connected' | 'disconnected' | 'reconnecting';

/**
 * Owns the shared socket's lifecycle for as long as this hook is mounted
 * anywhere, and exposes connection state for a small status indicator.
 * Mounted once, high in the tree (see ChatSocketProvider) — every chat
 * component that needs live events reads the same underlying socket via
 * getChatSocket() rather than opening its own connection.
 *
 * Free-tier hosts (Render/Vercel) can restart or cold-start under this
 * connection at any time, so "reconnect and move on" has to actually work:
 * on every successful (re)connect this refetches conversations/unread
 * count — cheap insurance against any event missed while offline, since
 * the socket has no way to redeliver something it wasn't there to see.
 */
export function useChatSocket(): ChatConnectionState {
  const { isAuthenticated } = useCurrentUser();
  const queryClient = useQueryClient();
  const [state, setState] = useState<ChatConnectionState>('connecting');

  useEffect(() => {
    if (!isAuthenticated) {
      setState('disconnected');
      return;
    }

    const socket = acquireChatSocket();

    const handleConnect = () => {
      setState('connected');
      queryClient.invalidateQueries({ queryKey: chatKeys.all });
    };
    const handleDisconnect = () => setState('disconnected');
    const handleReconnectAttempt = () => setState('reconnecting');

    socket.on('connect', handleConnect);
    socket.on('disconnect', handleDisconnect);
    socket.io.on('reconnect_attempt', handleReconnectAttempt);
    socket.io.on('reconnect', handleConnect);

    setState(socket.connected ? 'connected' : 'connecting');

    return () => {
      socket.off('connect', handleConnect);
      socket.off('disconnect', handleDisconnect);
      socket.io.off('reconnect_attempt', handleReconnectAttempt);
      socket.io.off('reconnect', handleConnect);
      releaseChatSocket();
    };
  }, [isAuthenticated, queryClient]);

  return state;
}
