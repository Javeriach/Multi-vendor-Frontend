'use client';

import { Suspense } from 'react';
import { MessageCircle } from 'lucide-react';

import { EmptyState } from '@/components/shared/empty-state';
import { Skeleton } from '@/components/ui/skeleton';
import { useCurrentUser } from '@/features/auth/hooks/use-current-user';
import { ChatLayout } from '@/features/chat/components/chat-layout';
import { useConversations } from '@/features/chat/hooks/use-conversations';

function MessagesContent() {
  const { isAuthenticated, isLoading: authLoading } = useCurrentUser();
  const { data: conversations, isLoading } = useConversations();

  if (!authLoading && !isAuthenticated) {
    return (
      <EmptyState
        icon={MessageCircle}
        title="Sign in to view your messages"
        description="Log in to chat with sellers about your orders and questions."
        actionLabel="Log In"
        actionHref="/login?redirect=/messages"
      />
    );
  }

  return <ChatLayout conversations={conversations} isLoading={isLoading || authLoading} emptyMessage="No conversations yet — start one from any product page." />;
}

export default function MessagesPage() {
  return (
    <div className="container max-w-5xl space-y-6 py-8">
      <h1 className="text-2xl font-bold tracking-tight">Messages</h1>
      <Suspense fallback={<Skeleton className="h-[600px] w-full" />}>
        <MessagesContent />
      </Suspense>
    </div>
  );
}
