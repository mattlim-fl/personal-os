/**
 * Returns the Monday of the ISO week for a given date as YYYY-MM-DD.
 */
export function getWeekStart(date: Date = new Date()): string {
  const d = new Date(date);
  const day = d.getDay(); // 0=Sun, 1=Mon, ..., 6=Sat
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  const monday = new Date(d.setDate(diff));
  return monday.toISOString().split('T')[0];
}

/**
 * Returns an array of date strings (YYYY-MM-DD) for Mon-Sun of the given week.
 */
export function getWeekDays(weekStart: string): string[] {
  const days: string[] = [];
  const start = new Date(weekStart + 'T00:00:00');
  for (let i = 0; i < 7; i++) {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    days.push(d.toISOString().split('T')[0]);
  }
  return days;
}

/**
 * Returns today's date as YYYY-MM-DD.
 */
export function getToday(): string {
  return new Date().toISOString().split('T')[0];
}
