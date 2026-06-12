const PERSIAN_DIGITS = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"] as const;

/** Deterministic — safe for SSR and client hydration. */
export function formatPersianNumber(value: number): string {
  return value
    .toString()
    .replace(/\d/g, (digit) => PERSIAN_DIGITS[Number(digit)] ?? digit);
}

/** Format ISO timestamp for display (server-only recommended). */
export function formatPersianDateTime(iso: string): string {
  try {
    return new Intl.DateTimeFormat("fa-IR", {
      dateStyle: "medium",
      timeStyle: "short",
      timeZone: "Asia/Tehran",
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}
