import { ApiErrorBody } from '@/types/common';

export class ApiError extends Error {
  readonly statusCode: number;
  readonly body: ApiErrorBody | null;

  constructor(statusCode: number, body: ApiErrorBody | null, fallbackMessage: string) {
    const message = Array.isArray(body?.message)
      ? body.message.join(', ')
      : (body?.message ?? fallbackMessage);
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.body = body;
  }
}
