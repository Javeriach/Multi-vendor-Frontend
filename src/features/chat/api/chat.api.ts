import { apiFetch } from '@/lib/api/client';
import { Paginated } from '@/types/common';
import { Conversation, ConversationSummary, CreateConversationInput, Message } from '@/types/chat';

export const chatApi = {
  createConversation: (input: CreateConversationInput) =>
    apiFetch<Conversation>('/chat/conversations', { method: 'POST', body: input }),

  listConversations: () => apiFetch<ConversationSummary[]>('/chat/conversations'),

  listVendorConversations: () => apiFetch<ConversationSummary[]>('/chat/vendor/conversations'),

  getMessages: (conversationId: string, page = 1, limit = 30) =>
    apiFetch<Paginated<Message>>(`/chat/conversations/${conversationId}/messages?page=${page}&limit=${limit}`),

  markRead: (conversationId: string) =>
    apiFetch<{ ok: true }>(`/chat/conversations/${conversationId}/read`, { method: 'POST' }),

  unreadCount: () => apiFetch<{ count: number }>('/chat/unread-count'),

  uploadChatImage: (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return apiFetch<{ url: string }>('/uploads/chat-image', { method: 'POST', body: formData });
  },
};
