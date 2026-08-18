import { apiFetch } from '@/lib/api/client';

export const uploadsApi = {
  uploadImage: (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return apiFetch<{ url: string }>('/uploads/image', { method: 'POST', body: formData });
  },
};
