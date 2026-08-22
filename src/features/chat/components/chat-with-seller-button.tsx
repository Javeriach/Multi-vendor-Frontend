'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCurrentUser } from '@/features/auth/hooks/use-current-user';
import { useCreateConversation } from '../hooks/use-create-conversation';

export function ChatWithSellerButton({
  storeId,
  productId,
  className,
}: {
  storeId: string;
  productId?: string;
  className?: string;
}) {
  const router = useRouter();
  // Can be null during static generation — falls back to the product page
  // itself never being blank/"null" in the post-login redirect target.
  const pathname = usePathname() ?? '/products';
  const { isAuthenticated } = useCurrentUser();
  const createConversation = useCreateConversation();

  if (!isAuthenticated) {
    return (
      <Button type="button" variant="outline" size="lg" className={className} asChild>
        <Link href={`/login?redirect=${encodeURIComponent(pathname)}`}>
          <MessageCircle className="h-4 w-4" />
          Chat with Seller
        </Link>
      </Button>
    );
  }

  return (
    <Button
      type="button"
      variant="outline"
      size="lg"
      className={className}
      loading={createConversation.isPending}
      onClick={() =>
        createConversation.mutate(
          { storeId, productId },
          { onSuccess: (conversation) => router.push(`/messages?c=${conversation.id}`) },
        )
      }
    >
      <MessageCircle className="h-4 w-4" />
      Chat with Seller
    </Button>
  );
}
