/**
 * Date utility functions
 */

export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toISOString();
}

export function isValidDate(date: unknown): date is Date {
  return date instanceof Date && !isNaN(date.getTime());
}

export function parseDate(dateString: string): Date | null {
  const date = new Date(dateString);
  return isValidDate(date) ? date : null;
}
