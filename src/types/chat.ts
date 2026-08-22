import { User } from './auth';
import { Store } from './catalog';

export type MessageType = 'text' | 'image';

export interface ConversationProductRef {
  id: string;
  name: string;
  slug: string;
}

export interface Conversation {
  id: string;
  buyer: User;
  store: Store;
  startedFromProduct: ConversationProductRef | null;
  lastMessageAt: string | null;
  createdAt: string;
  updatedAt: string;
}

/** Snake_case matches the raw SQL projection the backend returns for this
 * one field (see ChatService.attachPreviews) — deliberately not
 * camelCased there since it's a lightweight preview row, not an entity. */
export interface ConversationLastMessage {
  conversation_id: string;
  type: MessageType;
  body: string | null;
  image_url: string | null;
  sender_id: string;
  created_at: string;
}

export interface ConversationSummary extends Conversation {
  isViewerBuyer: boolean;
  lastMessage: ConversationLastMessage | null;
  unreadCount: number;
}

export interface Message {
  id: string;
  type: MessageType;
  body: string | null;
  imageUrl: string | null;
  readAt: string | null;
  createdAt: string;
  sender: User;
}

export interface CreateConversationInput {
  storeId: string;
  productId?: string;
}
