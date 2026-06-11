const WEEKDAY_LABELS: Record<string, string> = {
  SAT: "شنبه",
  SUN: "یکشنبه",
  MON: "دوشنبه",
  TUE: "سه‌شنبه",
  WED: "چهارشنبه",
  THU: "پنجشنبه",
  FRI: "جمعه",
};

export function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

export function formatPrice(price: number, currency = "IRT"): string {
  const formatted = new Intl.NumberFormat("fa-IR").format(price);
  const suffix = currency === "IRT" ? "تومان" : currency;
  return `${formatted} ${suffix}`;
}

export function formatTime(time: string): string {
  const [hours, minutes] = time.split(":");
  return `${hours}:${minutes}`;
}

export function formatWeekday(weekday: string): string {
  return WEEKDAY_LABELS[weekday] ?? weekday;
}

export function isRtlLanguage(language: string): boolean {
  return language.startsWith("FA") || language.startsWith("AR");
}

export function hasDiscount(
  originalPrice: number,
  price: number,
): boolean {
  return originalPrice > price;
}
