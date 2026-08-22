'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { getChatSocket } from '@/lib/socket';
import { ApiError } from '@/lib/api/error';
import { Message, MessageType } from '@/types/chat';
import { chatApi } from '../api/chat.api';

interface ThreadState {
  messages: Message[];
  page: number;
  hasMore: boolean;
  isLoading: boolean;
  isLoadingMore: boolean;
}

const EMPTY_STATE: ThreadState = { messages: [], page: 0, hasMore: false, isLoading: false, isLoadingMore: false };

/**
 * Deliberately NOT built on React Query's useInfiniteQuery — the backend
 * returns page 1 as the NEWEST batch (already reversed to chronological
 * order within that batch, see ChatService.getMessages), which is the
 * right shape for "show the latest messages, load older ones on scroll
 * up" but doesn't map cleanly onto useInfiniteQuery's
 * page-N-comes-after-page-(N-1) assumption. Plain state + explicit
 * prepend/append is simpler than fighting that mismatch, and messages are
 * live/ephemeral data anyway — the caching React Query would add here
 * isn't buying much.
 *
 * message:new arrives for EVERY member of the conversation:{id} room,
 * including the sender's own socket — so sending doesn't need a separate
 * optimistic-append path, the room echo is what shows your own message.
 */
export function useConversationThread(conversationId: string | null) {
  const [state, setState] = useState<ThreadState>(EMPTY_STATE);
  const [isSending, setIsSending] = useState(false);
  const conversationIdRef = useRef(conversationId);
  conversationIdRef.current = conversationId;

  useEffect(() => {
    if (!conversationId) {
      setState(EMPTY_STATE);
      return;
    }

    let cancelled = false;
    let hasLoadedOnce = false;
    setState({ ...EMPTY_STATE, isLoading: true });

    const socket = getChatSocket();

    // Socket.IO rooms belong to a specific connection, not to the user —
    // when the underlying transport reconnects (network blip, a server
    // restart, a backgrounded tab losing its connection), the new
    // connection starts in NO rooms, even though this conversation is
    // still "open" from the UI's perspective and this effect never
    // re-ran (its dependency, conversationId, hasn't changed). Without
    // re-joining here, message:new stops arriving for an already-open
    // thread after any reconnect — the sender's own room broadcast still
    // reaches THEM fine (freshly joined on connect), but the recipient's
    // stale membership silently goes nowhere. This one function handles
    // both the very first load AND every later resync: re-fetching page 1
    // on each (re)connect also closes the gap for anything that arrived
    // during a disconnected window, which rejoining the room alone can't
    // recover (that only catches messages sent AFTER rejoining).
    const syncOnConnect = () => {
      socket.emit('conversation:join', { conversationId });
      socket.emit('conversation:markRead', { conversationId });

      chatApi
        .getMessages(conversationId, 1, 30)
        .then((res) => {
          if (cancelled || conversationIdRef.current !== conversationId) return;

          if (!hasLoadedOnce) {
            hasLoadedOnce = true;
            setState({
              messages: res.data,
              page: 1,
              hasMore: res.meta.page < res.meta.totalPages,
              isLoading: false,
              isLoadingMore: false,
            });
            return;
          }

          // Reconnect resync — merge only, so pagination state built up
          // from earlier "load older" clicks is left untouched.
          setState((s) => {
            const existingIds = new Set(s.messages.map((m) => m.id));
            const missed = res.data.filter((m) => !existingIds.has(m.id));
            if (missed.length === 0) return s;
            return {
              ...s,
              messages: [...s.messages, ...missed].sort((a, b) => a.createdAt.localeCompare(b.createdAt)),
            };
          });
        })
        .catch(() => {
          if (cancelled || hasLoadedOnce) return;
          toast.error('Could not load messages');
          setState({ ...EMPTY_STATE, isLoading: false });
        });
    };
    syncOnConnect();
    socket.on('connect', syncOnConnect);

    const handleNew = (message: Message & { conversation?: { id: string } }) => {
      if (conversationIdRef.current !== conversationId) return;
      setState((s) => {
        if (s.messages.some((m) => m.id === message.id)) return s;
        return { ...s, messages: [...s.messages, message] };
      });
    };
    const handleRead = (evt: { conversationId: string }) => {
      if (evt.conversationId !== conversationId) return;
      setState((s) => ({
        ...s,
        messages: s.messages.map((m) => (m.readAt ? m : { ...m, readAt: new Date().toISOString() })),
      }));
    };

    // The server's WS exception filter reports handler failures (e.g.
    // "not a participant") via a separate 'exception' event, not
    // necessarily through message:send's ack callback — surfacing both is
    // what actually catches every failure mode rather than just the ones
    // where the ack happens to fire.
    const handleException = () => {
      setIsSending(false);
      toast.error('Something went wrong — please try again');
    };

    socket.on('message:new', handleNew);
    socket.on('conversation:read', handleRead);
    socket.on('exception', handleException);

    return () => {
      cancelled = true;
      socket.off('connect', syncOnConnect);
      socket.off('message:new', handleNew);
      socket.off('conversation:read', handleRead);
      socket.off('exception', handleException);
      socket.emit('conversation:leave', { conversationId });
    };
  }, [conversationId]);

  const loadMore = useCallback(async () => {
    const id = conversationIdRef.current;
    if (!id) return;

    let shouldFetch = false;
    let nextPage = 0;
    setState((s) => {
      if (s.isLoadingMore || !s.hasMore) return s;
      shouldFetch = true;
      nextPage = s.page + 1;
      return { ...s, isLoadingMore: true };
    });
    if (!shouldFetch) return;

    try {
      const res = await chatApi.getMessages(id, nextPage, 30);
      if (conversationIdRef.current !== id) return;
      setState((s) => ({
        messages: [...res.data, ...s.messages],
        page: nextPage,
        hasMore: res.meta.page < res.meta.totalPages,
        isLoading: false,
        isLoadingMore: false,
      }));
    } catch {
      toast.error('Could not load older messages');
      setState((s) => ({ ...s, isLoadingMore: false }));
    }
  }, []);

  const sendMessage = useCallback((input: { type: MessageType; body?: string; imageUrl?: string }) => {
    const id = conversationIdRef.current;
    if (!id) return;
    setIsSending(true);
    const socket = getChatSocket();
    socket.emit('message:send', { conversationId: id, ...input }, (response: unknown) => {
      setIsSending(false);
      if (response && typeof response === 'object' && 'status' in response) {
        toast.error('Message failed to send');
      }
    });
    // Fallback in case the server never acks (e.g. dropped connection
    // mid-flight) — don't leave the composer stuck in a sending state forever.
    setTimeout(() => setIsSending(false), 4000);
  }, []);

  const sendImage = useCallback(
    async (file: File) => {
      try {
        const { url } = await chatApi.uploadChatImage(file);
        sendMessage({ type: 'image', imageUrl: url });
      } catch (error) {
        toast.error(error instanceof ApiError ? error.message : 'Image upload failed');
      }
    },
    [sendMessage],
  );

  return { ...state, isSending, loadMore, sendMessage, sendImage };
}
