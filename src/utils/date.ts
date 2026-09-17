export function startOfDay(date: Date): Date {
  const copy = new Date(date);
  copy.setHours(0, 0, 0, 0);
  return copy;
}

export function addDays(date: Date, amount: number): Date {
  const copy = new Date(date);
  copy.setDate(copy.getDate() + amount);
  return copy;
}

export function addMonths(date: Date, amount: number): Date {
  const copy = new Date(date.getFullYear(), date.getMonth() + amount, 1);
  const lastDay = new Date(copy.getFullYear(), copy.getMonth() + 1, 0).getDate();
  copy.setDate(Math.min(date.getDate(), lastDay));
  return copy;
}

export function startOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

export function isSameDay(a: Date | null | undefined, b: Date | null | undefined): boolean {
  if (!a || !b) return false;
  return (
    a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()
  );
}

export function isSameMonth(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth();
}

function dayTime(date: Date): number {
  return startOfDay(date).getTime();
}

export function isBefore(a: Date, b: Date): boolean {
  return dayTime(a) < dayTime(b);
}

export function isAfter(a: Date, b: Date): boolean {
  return dayTime(a) > dayTime(b);
}

/** Six weeks of dates covering `month`, aligned to `weekStartsOn`. */
export function monthGrid(month: Date, weekStartsOn: 0 | 1 = 1): Date[] {
  const first = startOfMonth(month);
  const shift = (first.getDay() - weekStartsOn + 7) % 7;
  const start = addDays(first, -shift);
  return Array.from({ length: 42 }, (_, index) => addDays(start, index));
}

/** Localised weekday headings starting at `weekStartsOn`. */
export function weekdayNames(
  locale: string | undefined,
  weekStartsOn: 0 | 1 = 1,
): { short: string; long: string }[] {
  const short = new Intl.DateTimeFormat(locale, { weekday: 'short' });
  const long = new Intl.DateTimeFormat(locale, { weekday: 'long' });
  // 2024-01-07 is a Sunday, giving a stable reference week.
  const sunday = new Date(2024, 0, 7);
  return Array.from({ length: 7 }, (_, index) => {
    const day = addDays(sunday, index + weekStartsOn);
    return { short: short.format(day), long: long.format(day) };
  });
}

export function clampDate(date: Date, min?: Date, max?: Date): Date {
  const time = dayTime(date);
  if (min && time < dayTime(min)) return startOfDay(min);
  if (max && time > dayTime(max)) return startOfDay(max);
  return date;
}

/** Local calendar day key, e.g. `2026-09-17`. */
export function dateKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}
