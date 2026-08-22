'use client';

import { API_URL } from '@/lib/constants';
import { ApiError } from './error';

export interface RequestOptions extends Omit<RequestInit, 'body'> {
  body?: unknown;
}

/**
 * Client-side fetch wrapper — every feature's `api/` module goes through
 * this instead of calling `fetch` directly. `credentials: 'include'` is
 * what carries the backend's httpOnly JWT cookie on every request; nothing
 * here ever reads or stores the token itself (it's httpOnly by design —
 * JS can't touch it, which is the point).
 */
export async function apiFetch<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { body, headers, ...rest } = options;
  const isFormData = body instanceof FormData;

  const response = await fetch(`${API_URL}${path}`, {
    ...rest,
    credentials: 'include',
    headers: {
      // FormData bodies skip the JSON content-type — the browser sets its
      // own multipart boundary, which we'd break by overriding it here.
      ...(body !== undefined && !isFormData ? { 'Content-Type': 'application/json' } : {}),
      ...headers,
    },
    body: body === undefined ? undefined : body instanceof FormData ? body : JSON.stringify(body),
  });

  if (response.status === 204) {
    return undefined as T;
  }

  const isJson = response.headers.get('content-type')?.includes('application/json');

  if (!response.ok) {
    const data = isJson ? await response.json().catch(() => null) : null;
    throw new ApiError(response.status, data, response.statusText);
  }

  if (!isJson) {
    throw new ApiError(response.status, null, 'Expected JSON response but received a different content type');
  }

  return (await response.json()) as T;
}
