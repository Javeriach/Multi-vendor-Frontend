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
