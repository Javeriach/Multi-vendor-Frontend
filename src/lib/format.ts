/** Backend numeric/decimal columns come back as strings (TypeORM's
 * deliberate choice to avoid float precision loss — see the backend audit).
 * Money formatting always goes through here so that convention is
 * respected in exactly one place. */
export function formatMoney(amount: string | number, currency = 'USD'): string {
  const value = typeof amount === 'string' ? Number(amount) : amount;
  return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(
    Number.isFinite(value) ? value : 0,
  );
}

export function formatDate(value: string | Date): string {
  const date = typeof value === 'string' ? new Date(value) : value;
  return new Intl.DateTimeFormat('en-US', { dateStyle: 'medium' }).format(date);
}

export function formatDateTime(value: string | Date): string {
  const date = typeof value === 'string' ? new Date(value) : value;
  return new Intl.DateTimeFormat('en-US', { dateStyle: 'medium', timeStyle: 'short' }).format(date);
}

export function formatTime(value: string | Date): string {
  const date = typeof value === 'string' ? new Date(value) : value;
  return new Intl.DateTimeFormat('en-US', { timeStyle: 'short' }).format(date);
}

/** Compact "how long ago" for conversation-list rows — minutes/hours today,
 * weekday within the last week, otherwise a short date. */
export function formatRelativeShort(value: string | Date): string {
  const date = typeof value === 'string' ? new Date(value) : value;
  const diffMs = Date.now() - date.getTime();
  const diffMin = Math.floor(diffMs / 60_000);
  if (diffMin < 1) return 'now';
  if (diffMin < 60) return `${diffMin}m`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr}h`;
  const diffDay = Math.floor(diffHr / 24);
  if (diffDay < 7) return new Intl.DateTimeFormat('en-US', { weekday: 'short' }).format(date);
  return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(date);
}
