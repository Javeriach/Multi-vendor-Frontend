'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { ApiError } from '@/lib/api/error';
import { CreateConversationInput } from '@/types/chat';
import { chatApi } from '../api/chat.api';
import { chatKeys } from '../lib/query-keys';

export function useCreateConversation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateConversationInput) => chatApi.createConversation(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: chatKeys.conversations() });
    },
    onError: (error) => {
      toast.error(error instanceof ApiError ? error.message : 'Could not start conversation');
    },
  });
}
