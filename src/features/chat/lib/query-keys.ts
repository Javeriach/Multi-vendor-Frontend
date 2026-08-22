export const chatKeys = {
  all: ['chat'] as const,
  conversations: () => [...chatKeys.all, 'conversations'] as const,
  vendorConversations: () => [...chatKeys.all, 'vendor-conversations'] as const,
  unreadCount: () => [...chatKeys.all, 'unread-count'] as const,
};
