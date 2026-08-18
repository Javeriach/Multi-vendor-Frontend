/** Mirrors the backend's PaginatedResult<T> shape exactly (see
 * marketplace-backend/src/common/dto/paginated-result.ts) — kept in one
 * place so every feature's list endpoints share the same generic. */
export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface Paginated<T> {
  data: T[];
  meta: PaginationMeta;
}

export interface ApiErrorBody {
  statusCode: number;
  message: string | string[];
  error: string;
  path: string;
  timestamp: string;
}
