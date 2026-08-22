'use client';

import { Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { ChatLayout } from '@/features/chat/components/chat-layout';
import { useVendorConversations } from '@/features/chat/hooks/use-conversations';

function VendorMessagesContent() {
  const { data: conversations, isLoading } = useVendorConversations();
  return (
    <ChatLayout
      conversations={conversations}
      isLoading={isLoading}
      emptyMessage="No customer messages yet."
      heightClassName="h-[calc(100vh-17rem)]"
    />
  );
}

export default function VendorMessagesPage() {
  return (
    <Suspense fallback={<Skeleton className="h-[600px] w-full" />}>
      <VendorMessagesContent />
    </Suspense>
  );
}
