'use client';

import { cn } from '@/lib/utils';
import { ChatConnectionState } from '../hooks/use-chat-socket';

const LABELS: Record<ChatConnectionState, string> = {
  connected: 'Connected',
  connecting: 'Connecting…',
  reconnecting: 'Reconnecting…',
  disconnected: 'Offline',
};

const DOT_COLOR: Record<ChatConnectionState, string> = {
  connected: 'bg-success',
  connecting: 'bg-muted-foreground animate-pulse',
  reconnecting: 'bg-amber-500 animate-pulse',
  disconnected: 'bg-destructive',
};

export function ConnectionStatusBadge({ state }: { state: ChatConnectionState }) {
  if (state === 'connected') return null;
  return (
    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
      <span className={cn('h-1.5 w-1.5 rounded-full', DOT_COLOR[state])} aria-hidden="true" />
      {LABELS[state]}
    </div>
  );
}
