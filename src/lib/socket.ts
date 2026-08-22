'use client';

import { io, Socket } from 'socket.io-client';
import { SOCKET_URL } from './constants';

/**
 * One shared connection for the whole app, created lazily on first use and
 * torn down once the last consumer (see useChatSocket) unmounts — not one
 * socket per component. `withCredentials: true` carries the httpOnly
 * access_token cookie on the handshake, same as apiFetch does for REST; the
 * `auth.token` field stays empty here since the cookie already gets there
 * and the gateway checks the cookie first, but we keep the field wired for
 * environments where the cookie can't ride along.
 */
let socket: Socket | null = null;
let refCount = 0;

export function getChatSocket(): Socket {
  if (!socket) {
    socket = io(`${SOCKET_URL}/chat`, {
      withCredentials: true,
      autoConnect: false,
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 10_000,
    });
  }
  return socket;
}

export function acquireChatSocket(): Socket {
  const s = getChatSocket();
  refCount += 1;
  if (!s.connected) {
    s.connect();
  }
  return s;
}

export function releaseChatSocket(): void {
  refCount = Math.max(0, refCount - 1);
  if (refCount === 0 && socket) {
    socket.disconnect();
  }
}
