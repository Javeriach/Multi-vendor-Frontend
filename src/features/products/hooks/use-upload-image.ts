'use client';

import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

import { ApiError } from '@/lib/api/error';
import { uploadsApi } from '../api/uploads.api';

export function useUploadImage() {
  return useMutation({
    mutationFn: (file: File) => uploadsApi.uploadImage(file),
    onError: (error) => {
      toast.error(error instanceof ApiError ? error.message : 'Something went wrong');
    },
  });
}
