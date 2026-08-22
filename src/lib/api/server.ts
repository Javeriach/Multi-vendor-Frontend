import { cookies } from 'next/headers';

import { API_URL } from '@/lib/constants';
import { ApiError } from './error';
import { RequestOptions } from './client';

/**
 * Server Component / Server Action fetch wrapper. A server-side `fetch`
 * does NOT automatically carry the browser's cookies (there is no browser
 * involved) — the incoming request's cookie jar has to be forwarded
 * explicitly, which is the one real difference from the client wrapper.
 * Used for SSR'd pages that need authenticated data (account, orders) and
 * for public SSR data (products, categories) where forwarding costs
 * nothing but keeps both wrappers consistent.
 */
export async function serverApiFetch<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.toString();
  return rawServerFetch<T>(path, options, cookieHeader ? { Cookie: cookieHeader } : {});
}

/**
 * For genuinely public reads (catalog browsing, product detail, public
 * reviews) where the response never varies by who's asking. Deliberately
 * does NOT call `cookies()` — doing so would force the whole route to
 * render dynamically per-request (Next.js's rule, not a choice made here),
 * which would silently defeat any `revalidate`/static-generation on pages
 * that don't actually need per-user data.
 */
export async function publicServerFetch<T>(path: string, options: RequestOptions = {}): Promise<T> {
  return rawServerFetch<T>(path, options, {});
}

async function rawServerFetch<T>(
  path: string,
  options: RequestOptions,
  extraHeaders: Record<string, string>,
): Promise<T> {
  const { body, headers, ...rest } = options;

  const response = await fetch(`${API_URL}${path}`, {
    ...rest,
    headers: {
      ...(body !== undefined ? { 'Content-Type': 'application/json' } : {}),
      ...extraHeaders,
      ...headers,
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
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
    // A 200 with a non-JSON body (an HTML challenge/redirect page from an
    // auth wall or proxy in front of the API, for example) is not a usable
    // success — treating it as one silently resolves callers to `null`,
    // bypassing their `.catch()` fallbacks entirely.
    throw new ApiError(response.status, null, 'Expected JSON response but received a different content type');
  }

  return (await response.json()) as T;
}
